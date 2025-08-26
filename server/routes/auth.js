// ============================================
// AUTHENTICATION ROUTES
// ============================================

const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { requireAuth, addUserToRequest } = require('../middleware/auth');

const router = express.Router();

// ============================================
// POST /api/auth/register - Εγγραφή χρήστη
// ============================================

router.post('/register', [
  // Validation rules
  body('email')
    .isEmail()
    .withMessage('Μη έγκυρο email')
    .normalizeEmail(), // Καθαρίζει το email
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password πρέπει να έχει τουλάχιστον 6 χαρακτήρες'),
  
  body('userType')
    .isIn(['employer', 'jobSeeker'])
    .withMessage('User type πρέπει να είναι employer ή jobSeeker'),
    
  // Για job seekers - μόνο email/password στο register
  // Το profile θα συμπληρωθεί στο ProfileCompletion step
  
  // Για employers - μόνο email/password στο register  
  // Το company profile θα συμπληρωθεί στο EmployerProfile step
    
], async (req, res) => {
  try {
    // Έλεγχος validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array().map(err => err.msg)
      });
    }

    // Δημιουργία χρήστη
    const user = await User.create(req.db, req.body);
    
    // Δημιουργία session (αυτόματο login μετά την εγγραφή)
    req.session.userId = user._id.toString();
    req.session.userType = user.userType;
    req.session.email = user.email;
    
    // Response με user data (χωρίς password)
    res.status(201).json({
      message: 'Εγγραφή επιτυχής',
      user: user,
      session: {
        userId: req.session.userId,
        userType: req.session.userType,
        email: req.session.email
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error.message);
    
    res.status(400).json({
      error: 'Registration failed',
      message: error.message
    });
  }
});

// ============================================
// POST /api/auth/login - Σύνδεση χρήστη
// ============================================

router.post('/login', [
  // Validation rules
  body('email')
    .isEmail()
    .withMessage('Μη έγκυρο email')
    .normalizeEmail(),
    
  body('password')
    .notEmpty()
    .withMessage('Password απαιτείται')
    
], async (req, res) => {
  try {
    // Έλεγχος validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array().map(err => err.msg)
      });
    }

    const { email, password } = req.body;

    // Authentication
    const user = await User.authenticate(req.db, email, password);
    
    // Δημιουργία session
    req.session.userId = user._id.toString();
    req.session.userType = user.userType;
    req.session.email = user.email;
    
    res.json({
      message: 'Σύνδεση επιτυχής',
      user: user,
      session: {
        userId: req.session.userId,
        userType: req.session.userType,
        email: req.session.email
      }
    });
    
  } catch (error) {
    console.error('Login error:', error.message);
    
    // Generic error message για ασφάλεια (δεν αποκαλύπτουμε αν το email υπάρχει)
    res.status(401).json({
      error: 'Login failed',
      message: 'Λάθος email ή password'
    });
  }
});

// ============================================
// POST /api/auth/logout - Αποσύνδεση χρήστη
// ============================================

router.post('/logout', requireAuth, (req, res) => {
  // Διαγραφή session
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({
        error: 'Logout failed',
        message: 'Δεν μπόρεσε να γίνει logout'
      });
    }
    
    // Διαγραφή session cookie
    res.clearCookie('jobboard.sid');
    
    res.json({
      message: 'Αποσύνδεση επιτυχής'
    });
  });
});

// ============================================
// GET /api/auth/me - Πληροφορίες τρέχοντος χρήστη
// ============================================

router.get('/me', requireAuth, addUserToRequest, (req, res) => {
  // Επιστρέφει τις πληροφορίες του συνδεδεμένου χρήστη
  res.json({
    user: req.user,
    session: {
      userId: req.session.userId,
      userType: req.session.userType,
      email: req.session.email
    }
  });
});

// ============================================
// GET /api/auth/check - Έλεγχος αν είναι logged in
// ============================================

router.get('/check', (req, res) => {
  // Απλός έλεγχος session χωρίς να απαιτεί authentication
  if (req.session && req.session.userId) {
    res.json({
      isAuthenticated: true,
      userType: req.session.userType,
      email: req.session.email
    });
  } else {
    res.json({
      isAuthenticated: false
    });
  }
});

module.exports = router;