// server/routes/jobs.js
// Αυτό το αρχείο ορίζει τα URL endpoints για τις αγγελίες εργασίας

const express = require('express');
const { requireAuth, requireEmployer, addUserToRequest } = require('../middleware/auth');
const Job = require('../models/Job');

// Δημιουργούμε router για να ομαδοποιήσουμε τα routes
const router = express.Router();

// ROUTE 1: Δες όλες τις αγγελίες (ΔΗΜΟΣΙΟ - χωρίς login)
// URL: GET /api/jobs
router.get('/', async (req, res) => {
  try {
    // Δημιουργούμε Job instance
    const jobModel = new Job(req.db);
    
    // Παίρνουμε όλες τις αγγελίες
    const jobs = await jobModel.getAllJobs();
    
    // Στέλνουμε την απάντηση
    res.json({
      success: true,
      data: jobs,
      message: `Βρέθηκαν ${jobs.length} αγγελίες`
    });
  } catch (error) {
    console.error('Σφάλμα στο GET /api/jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Σφάλμα στην ανάκτηση αγγελιών'
    });
  }
});

// ROUTE 2: Δες τις αγγελίες μου (ΜΟΝΟ ΕΡΓΟΔΟΤΕΣ)
// URL: GET /api/jobs/my-jobs
// ΣΗΜΑΝΤΙΚΟ: Αυτό πρέπει να είναι ΠΡΙΝ το /:id route!
router.get('/my-jobs', requireAuth, addUserToRequest, requireEmployer, async (req, res) => {
  try {
    const jobModel = new Job(req.db);
    const employerId = req.user._id;
    
    // Βρίσκουμε τις αγγελίες αυτού του εργοδότη
    const jobs = await jobModel.getJobsByEmployer(employerId);
    
    res.json({
      success: true,
      data: jobs,
      message: `Βρέθηκαν ${jobs.length} αγγελίες σας`
    });
  } catch (error) {
    console.error('Σφάλμα στο GET /api/jobs/my-jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Σφάλμα στην ανάκτηση των αγγελιών σας'
    });
  }
});

// ROUTE 3: Δες μια συγκεκριμένη αγγελία (ΔΗΜΟΣΙΟ)
// URL: GET /api/jobs/:id (π.χ. GET /api/jobs/64f7a8b2c1d4e5f6789abcd0)
// ΣΗΜΑΝΤΙΚΟ: Αυτό πρέπει να είναι ΜΕΤΑ τα specific routes όπως /my-jobs
router.get('/:id', async (req, res) => {
  try {
    const jobModel = new Job(req.db);
    const jobId = req.params.id; // Παίρνουμε το ID από το URL
    
    // Βρίσκουμε την αγγελία
    const job = await jobModel.getJobById(jobId);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Η αγγελία δε βρέθηκε'
      });
    }
    
    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Σφάλμα στο GET /api/jobs/:id:', error);
    res.status(500).json({
      success: false,
      message: 'Σφάλμα στην ανάκτηση αγγελίας'
    });
  }
});

// ROUTE 4: Δημιούργησε νέα αγγελία (ΜΟΝΟ ΕΡΓΟΔΟΤΕΣ)
// URL: POST /api/jobs
router.post('/', requireAuth, addUserToRequest, requireEmployer, async (req, res) => {
  try {
    const jobModel = new Job(req.db);
    const employerId = req.user._id; // Το ID του εργοδότη από το session
    
    // Δεδομένα της νέας αγγελίας από το request body
    const jobData = {
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      salary: req.body.salary
    };
    
    // Βασικός έλεγχος δεδομένων
    if (!jobData.title || !jobData.description || !jobData.location) {
      return res.status(400).json({
        success: false,
        message: 'Τα πεδία title, description και location είναι υποχρεωτικά'
      });
    }
    
    // Δημιουργούμε την αγγελία
    const newJob = await jobModel.createJob(jobData, employerId);
    
    res.status(201).json({
      success: true,
      data: newJob,
      message: 'Η αγγελία δημιουργήθηκε επιτυχώς!'
    });
  } catch (error) {
    console.error('Σφάλμα στο POST /api/jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Σφάλμα στη δημιουργία αγγελίας'
    });
  }
});

// Εξάγουμε το router για να το χρησιμοποιήσουμε στο server.js
module.exports = router;