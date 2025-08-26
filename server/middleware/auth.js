// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================

// Middleware που ελέγχει αν ο χρήστης είναι logged in
function requireAuth(req, res, next) {
  // Έλεγχος αν υπάρχει session και user
  if (req.session && req.session.userId) {
    // Ο χρήστης είναι συνδεδεμένος - προχωράει στο επόμενο middleware
    return next();
  }
  
  // Ο χρήστης δεν είναι συνδεδεμένος
  return res.status(401).json({
    error: 'Authentication required',
    message: 'Πρέπει να συνδεθείς για να δεις αυτή τη σελίδα'
  });
}

// Middleware που ελέγχει αν ο χρήστης είναι employer
function requireEmployer(req, res, next) {
  // Πρώτα έλεγχος authentication
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'Πρέπει να συνδεθείς πρώτα'
    });
  }
  
  // Έλεγχος user type
  if (req.session.userType !== 'employer') {
    return res.status(403).json({
      error: 'Access denied',
      message: 'Μόνο employers έχουν πρόσβαση σε αυτή τη λειτουργία'
    });
  }
  
  next();
}

// Middleware που ελέγχει αν ο χρήστης είναι job seeker
function requireJobSeeker(req, res, next) {
  // Πρώτα έλεγχος authentication
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'Πρέπει να συνδεθείς πρώτα'
    });
  }
  
  // Έλεγχος user type
  if (req.session.userType !== 'jobSeeker') {
    return res.status(403).json({
      error: 'Access denied',
      message: 'Μόνο job seekers έχουν πρόσβαση σε αυτή τη λειτουργία'
    });
  }
  
  next();
}

// Middleware που προσθέτει user info στο request
async function addUserToRequest(req, res, next) {
  if (req.session && req.session.userId) {
    try {
      const { ObjectId } = require('mongodb');
      
      // Βρες τον χρήστη από τη βάση (χωρίς password)
      const user = await req.db.collection('users').findOne(
        { _id: new ObjectId(req.session.userId) },
        { projection: { password: 0 } }
      );
      
      if (user) {
        req.user = user; // Προσθήκη του user object στο request
      }
    } catch (error) {
      console.log('Error fetching user:', error.message);
    }
  }
  
  next();
}

// Export όλων των middleware functions
module.exports = {
  requireAuth,
  requireEmployer,
  requireJobSeeker,
  addUserToRequest
};