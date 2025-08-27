// ============================================
// AUTHENTICATION ROUTES
// ============================================

const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { requireAuth, addUserToRequest } = require('../middleware/auth');

const router = express.Router();

// ============================================
// POST /api/auth/register - User Registration
// ============================================

router.post('/register', [
  // Validation rules
  body('email')
    .isEmail()
    .withMessage('Invalid email')
    .normalizeEmail(), // Cleans the email
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  
  body('userType')
    .isIn(['employer', 'jobSeeker'])
    .withMessage('User type must be employer or jobSeeker'),
    
  // For job seekers - only email/password in register
  // Profile will be completed in ProfileCompletion step
  
  // For employers - only email/password in register  
  // Company profile will be completed in EmployerProfile step
    
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array().map(err => err.msg)
      });
    }

    // Create user
    const user = await User.create(req.db, req.body);
    
    // Create session (automatic login after registration)
    req.session.userId = user._id.toString();
    req.session.userType = user.userType;
    req.session.email = user.email;
    
    // Response with user data (without password)
    res.status(201).json({
      message: 'Registration successful',
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
// POST /api/auth/login - User Login
// ============================================

router.post('/login', [
  // Validation rules
  body('email')
    .isEmail()
    .withMessage('Invalid email')
    .normalizeEmail(),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    
], async (req, res) => {
  try {
    // Check validation errors
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
    
    // Create session
    req.session.userId = user._id.toString();
    req.session.userType = user.userType;
    req.session.email = user.email;
    
    res.json({
      message: 'Login successful',
      user: user,
      session: {
        userId: req.session.userId,
        userType: req.session.userType,
        email: req.session.email
      }
    });
    
  } catch (error) {
    console.error('Login error:', error.message);
    
    // Generic error message for security (don't reveal if email exists)
    res.status(401).json({
      error: 'Login failed',
      message: 'Invalid email or password'
    });
  }
});

// ============================================
// POST /api/auth/logout - User Logout
// ============================================

router.post('/logout', requireAuth, (req, res) => {
  // Delete session
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({
        error: 'Logout failed',
        message: 'Could not logout'
      });
    }
    
    // Clear session cookie
    res.clearCookie('jobboard.sid');
    
    res.json({
      message: 'Logout successful'
    });
  });
});

// ============================================
// GET /api/auth/me - Current User Information
// ============================================

router.get('/me', requireAuth, addUserToRequest, (req, res) => {
  // Returns logged-in user information
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
// GET /api/auth/check - Check if logged in
// ============================================

router.get('/check', (req, res) => {
  // Simple session check without requiring authentication
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