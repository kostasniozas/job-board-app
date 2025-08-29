// ============================================
// JOB BOARD BACKEND - MAIN SERVER FILE
// ============================================

// Import των απαραίτητων modules
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config(); // Φορτώνει το .env αρχείο

// Δημιουργία του Express app
const app = express();

// Ρυθμίσεις από environment variables
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobboard';
const SESSION_SECRET = process.env.SESSION_SECRET || 'fallback-secret-key';

// Global variables για database connection
let db;
let client;

// ============================================
// MIDDLEWARE SETUP (σειρά έχει σημασία!)
// ============================================

// 1. Security middleware
app.use(helmet()); // Προστασία από common attacks

// 2. Rate limiting - περιορίζει requests ανά IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 λεπτά
  max: 100, // μέγιστο 100 requests ανά 15 λεπτά ανά IP
  message: 'Πάρα πολλά requests, δοκίμασε σε λίγο'
});
app.use(limiter);

// 3. CORS - επιτρέπει requests από το React app
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-frontend-url.netlify.app' 
    : ['http://localhost:3000', 'http://localhost:5173'], // <-- ΠΡΟΣΘΕΣΕ ΚΑΙ ΤΟ 5173
  credentials: true
}));

// 4. Body parsing - διαβάζει JSON data από requests
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 5. Session middleware (πριν τα routes!)
app.use(session({
  secret: SESSION_SECRET,
  name: 'jobboard.sid', // Όνομα του session cookie
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS μόνο σε production
    httpOnly: true, // Δεν μπορεί να διαβαστεί από JavaScript (ασφάλεια)
    maxAge: parseInt(process.env.SESSION_MAX_AGE) || 24 * 60 * 60 * 1000 // 24 ώρες
  },
  store: MongoStore.create({
    mongoUrl: MONGODB_URI,
    collectionName: 'sessions'
  })
}));

// ============================================
// DATABASE CONNECTION
// ============================================

async function connectToDatabase() {
  try {
    console.log('🔄 Συνδέεται με MongoDB...');
    
    client = new MongoClient(MONGODB_URI, {
      // Ρυθμίσεις σύνδεσης
      maxPoolSize: 10, // Μέγιστες ταυτόχρονες συνδέσεις
      serverSelectionTimeoutMS: 5000, // Timeout για σύνδεση
      socketTimeoutMS: 45000, // Socket timeout
    });
    
    await client.connect();
    db = client.db(); // Χρησιμοποιεί το database name από το URI
    
    // Test της σύνδεσης
    await db.admin().ping();
    console.log('✅ Συνδέθηκε επιτυχώς με MongoDB!');
    
    // Δημιουργία indexes για καλύτερη performance (αργότερα)
    await createIndexes();
    
  } catch (error) {
    console.error('❌ Σφάλμα σύνδεσης με MongoDB:', error.message);
    process.exit(1); // Σταματάει τον server αν δεν μπορεί να συνδεθεί
  }
}

// Δημιουργία indexes για βελτίωση performance
async function createIndexes() {
  try {
    // Users collection indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ userType: 1 });
    
    // Jobs collection indexes  
    await db.collection('jobs').createIndex({ title: 'text', description: 'text' });
    await db.collection('jobs').createIndex({ category: 1, location: 1 });
    await db.collection('jobs').createIndex({ createdAt: -1 });
    
    // Applications collection indexes
    await db.collection('applications').createIndex({ applicant: 1, job: 1 }, { unique: true });
    await db.collection('applications').createIndex({ job: 1 });
    
    console.log('✅ Δημιουργήθηκαν indexes');
  } catch (error) {
    console.log('⚠️ Προειδοποίηση: Κάποια indexes υπάρχουν ήδη');
  }
}

// ============================================
// MIDDLEWARE ΓΙΑ DATABASE ACCESS
// ============================================

// Κάνει διαθέσιμο το db object σε όλα τα routes
app.use((req, res, next) => {
  req.db = db;
  next();
});

// ============================================
// BASIC ROUTES (θα τα φτιάξουμε μετά)
// ============================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Job Board API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Test endpoint για να βλέπουμε ότι δουλεύει
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Το API δουλεύει!',
    session: req.session.id ? 'Active' : 'No session',
    database: db ? 'Connected' : 'Disconnected'
  });
});

// ============================================
// ROUTES SETUP
// ============================================

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler - για routes που δεν υπάρχουν
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint δεν βρέθηκε',
    path: req.path 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🚨 Server Error:', err.stack);
  
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Κάτι πήγε στραβά' 
      : err.message,
    timestamp: new Date().toISOString()
  });
});

// ============================================
// SERVER STARTUP
// ============================================

async function startServer() {
  try {
    // Πρώτα συνδέεται με τη βάση
    await connectToDatabase();
    
    // Μετά ξεκινάει τον server
    app.listen(PORT, () => {
      console.log(`🚀 Server τρέχει στο http://localhost:${PORT}`);
      console.log(`📱 API διαθέσιμο στο http://localhost:${PORT}/api`);
      console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
      console.log(`⚡ Environment: ${process.env.NODE_ENV}`);
    });
    
  } catch (error) {
    console.error('❌ Αποτυχία εκκίνησης server:', error);
    process.exit(1);
  }
}

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

// Κλείνει σωστά τη σύνδεση με τη βάση όταν σταματάει ο server
process.on('SIGINT', async () => {
  console.log('\n🔄 Κλείσιμο server...');
  
  if (client) {
    await client.close();
    console.log('✅ Έκλεισε η σύνδεση με MongoDB');
  }
  
  console.log('👋 Server έκλεισε');
  process.exit(0);
});

// Ξεκίνημα του server
startServer();