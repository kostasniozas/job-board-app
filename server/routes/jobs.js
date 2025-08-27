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
      jobs: jobs,  // UPDATED: consistent property name
      message: `Found ${jobs.length} jobs`
    });
  } catch (error) {
    console.error('Error in GET /api/jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs'
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
    
    console.log('Fetching jobs for employer:', employerId);
    
    // Βρίσκουμε τις αγγελίες αυτού του εργοδότη
    const jobs = await jobModel.getJobsByEmployer(employerId);
    
    console.log('Found jobs:', jobs.length);
    
    res.json({
      success: true,
      jobs: jobs,  // UPDATED: from "data" to "jobs"
      message: `Found ${jobs.length} jobs`
    });
  } catch (error) {
    console.error('Error in GET /api/jobs/my-jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your jobs'
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
        message: 'Job not found'
      });
    }
    
    res.json({
      success: true,
      job: job  // UPDATED: consistent property name
    });
  } catch (error) {
    console.error('Error in GET /api/jobs/:id:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job'
    });
  }
});

// ROUTE 4: Δημιούργησε νέα αγγελία (ΜΟΝΟ ΕΡΓΟΔΟΤΕΣ)
// URL: POST /api/jobs
router.post('/', requireAuth, addUserToRequest, requireEmployer, async (req, res) => {
  try {
    const jobModel = new Job(req.db);
    const employerId = req.user._id;
    
    console.log('Creating job for employer:', employerId);
    console.log('Job data received:', req.body);
    
    // UPDATED: Enhanced job data with all fields from PostJobForm
    const jobData = {
      title: req.body.title,
      company: req.body.company,
      description: req.body.description,
      requirements: req.body.requirements,
      responsibilities: req.body.responsibilities,
      location: req.body.location,
      workType: req.body.workType, // remote, office, hybrid
      type: req.body.type, // employment type: full-time, part-time, etc
      salary: req.body.salary,
      benefits: req.body.benefits,
      experienceLevel: req.body.experienceLevel,
      skills: req.body.skills,
      department: req.body.department,
      applicationDeadline: req.body.applicationDeadline,
      startDate: req.body.startDate,
      // Default values
      status: 'active',
      applicants: 0,
      views: 0,
      datePosted: new Date(),
      createdAt: new Date()
    };
    
    // Βασικός έλεγχος δεδομένων
    if (!jobData.title || !jobData.description || !jobData.location) {
      return res.status(400).json({
        success: false,
        message: 'Title, description and location are required'
      });
    }
    
    // Δημιουργούμε την αγγελία
    const newJob = await jobModel.createJob(jobData, employerId);
    
    console.log('Job created successfully:', newJob);
    
    res.status(201).json({
      success: true,
      job: newJob,  // UPDATED: from "data" to "job"
      message: 'Job posted successfully!'
    });
  } catch (error) {
    console.error('Error in POST /api/jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating job posting'
    });
  }
});

// ROUTE 5: Ενημέρωση αγγελίας (ΜΟΝΟ Ο ΕΡΓΟΔΟΤΗΣ ΠΟΥ ΤΗΝ ΕΦΤΙΑΞΕ)
// URL: PUT /api/jobs/:id
router.put('/:id', requireAuth, addUserToRequest, requireEmployer, async (req, res) => {
  try {
    const jobModel = new Job(req.db);
    const jobId = req.params.id;
    const employerId = req.user._id;
    
    // Ελέγχουμε αν η αγγελία υπάρχει και ανήκει σε αυτόν τον εργοδότη
    const existingJob = await jobModel.getJobById(jobId);
    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    if (existingJob.employerId.toString() !== employerId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own job postings'
      });
    }
    
    // Δεδομένα για ενημέρωση
    const updateData = {
      title: req.body.title,
      company: req.body.company,
      description: req.body.description,
      requirements: req.body.requirements,
      responsibilities: req.body.responsibilities,
      location: req.body.location,
      workType: req.body.workType,
      type: req.body.type,
      salary: req.body.salary,
      benefits: req.body.benefits,
      experienceLevel: req.body.experienceLevel,
      skills: req.body.skills,
      department: req.body.department,
      applicationDeadline: req.body.applicationDeadline,
      startDate: req.body.startDate,
      status: req.body.status,
      updatedAt: new Date()
    };
    
    // Ενημερώνουμε την αγγελία
    const updatedJob = await jobModel.updateJob(jobId, updateData);
    
    res.json({
      success: true,
      job: updatedJob,
      message: 'Job updated successfully!'
    });
  } catch (error) {
    console.error('Error in PUT /api/jobs/:id:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating job'
    });
  }
});

// ROUTE 6: Διαγραφή αγγελίας (ΜΟΝΟ Ο ΕΡΓΟΔΟΤΗΣ ΠΟΥ ΤΗΝ ΕΦΤΙΑΞΕ)
// URL: DELETE /api/jobs/:id
router.delete('/:id', requireAuth, addUserToRequest, requireEmployer, async (req, res) => {
  try {
    const jobModel = new Job(req.db);
    const jobId = req.params.id;
    const employerId = req.user._id;
    
    // Ελέγχουμε αν η αγγελία υπάρχει και ανήκει σε αυτόν τον εργοδότη
    const existingJob = await jobModel.getJobById(jobId);
    if (!existingJob) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    if (existingJob.employerId.toString() !== employerId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own job postings'
      });
    }
    
    // Διαγράφουμε την αγγελία
    await jobModel.deleteJob(jobId);
    
    res.json({
      success: true,
      message: 'Job deleted successfully!'
    });
  } catch (error) {
    console.error('Error in DELETE /api/jobs/:id:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting job'
    });
  }
});

// Εξάγουμε το router για να το χρησιμοποιήσουμε στο server.js
module.exports = router;