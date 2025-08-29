// server/routes/applications.js - Production Ready με Real Database Query
const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const Application = require('../models/Application');
const { requireAuth, addUserToRequest } = require('../middleware/auth');

// GET /api/applications/employer - Όλες οι αιτήσεις για τον συνδεδεμένο employer
router.get('/employer', requireAuth, addUserToRequest, async (req, res) => {
  try {
    console.log('Fetching applications for employer:', req.user?._id);

    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    if (!req.db) {
      return res.status(500).json({
        success: false,
        message: 'Database not available'
      });
    }

    // Πραγματικό query για applications από database
    const result = await Application.findByEmployer(req.db, userId.toString());
    
    if (result.success) {
      console.log(`Found ${result.count} applications for employer ${userId}`);
      res.json({
        success: true,
        applications: result.applications,
        count: result.count
      });
    } else {
      console.error('Error fetching applications:', result.error);
      res.status(500).json({
        success: false,
        message: result.error,
        applications: [],
        count: 0
      });
    }

  } catch (error) {
    console.error('Error in /employer route:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message,
      applications: [],
      count: 0
    });
  }
});

// GET /api/applications/job/:jobId - Αιτήσεις για συγκεκριμένο job
router.get('/job/:jobId', requireAuth, addUserToRequest, async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Ελέγχουμε αν το job υπάρχει και ανήκει στον employer
    const job = await req.db.collection('jobs').findOne({ 
      _id: new ObjectId(jobId) 
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.employerId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only view applications for your own jobs'
      });
    }

    // Βρίσκουμε τις αιτήσεις για αυτό το job
    const applications = await req.db.collection('applications')
      .aggregate([
        {
          $match: { jobId: new ObjectId(jobId) }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'applicantId',
            foreignField: '_id',
            as: 'applicant'
          }
        },
        {
          $sort: { appliedDate: -1 }
        }
      ])
      .toArray();

    // Privacy-safe format
    const safeApplications = applications.map(app => {
      const applicant = app.applicant[0] || {};
      const firstName = applicant.firstName || '';
      const lastName = applicant.lastName || '';
      
      return {
        id: app._id,
        profileId: `candidate_${app._id.toString().slice(-6)}`,
        initials: `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U.U.',
        appliedFor: job.title,
        appliedDate: app.appliedDate,
        status: app.status,
        interviewStatus: app.interviewStatus,
        rating: app.rating,
        location: applicant.location || 'Location not specified',
        coverLetter: app.coverLetter || ''
      };
    });

    res.json({
      success: true,
      applications: safeApplications,
      jobTitle: job.title,
      count: safeApplications.length
    });

  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job applications',
      error: error.message
    });
  }
});

// POST /api/applications - Δημιουργία νέας αίτησης (για job seekers)
router.post('/', requireAuth, addUserToRequest, async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: 'Job ID is required'
      });
    }

    // Ελέγχουμε αν το job υπάρχει και είναι active
    const job = await req.db.collection('jobs').findOne({ 
      _id: new ObjectId(jobId) 
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.status === 'closed') {
      return res.status(400).json({
        success: false,
        message: 'This job is no longer accepting applications'
      });
    }

    // Δημιουργούμε την αίτηση
    const result = await Application.create(req.db, {
      jobId: jobId,
      applicantId: userId.toString(),
      coverLetter: coverLetter || ''
    });

    if (result.success) {
      console.log('New application created:', result.applicationId);
      res.status(201).json({
        success: true,
        message: 'Application submitted successfully',
        applicationId: result.applicationId
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.error
      });
    }

  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message
    });
  }
});

// PUT /api/applications/:id/status - Ενημέρωση status (approve/reject)
router.put('/:id/status', requireAuth, addUserToRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: pending, approved, or rejected'
      });
    }

    const result = await Application.updateStatus(req.db, id, status, userId.toString());

    if (result.success) {
      console.log(`Application ${id} status updated to ${status}`);
      res.json({
        success: true,
        message: result.message
      });
    } else {
      const statusCode = result.error.includes('not found') ? 404 :
                        result.error.includes('only update') ? 403 : 400;
      
      res.status(statusCode).json({
        success: false,
        message: result.error
      });
    }

  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application status',
      error: error.message
    });
  }
});

// PUT /api/applications/:id/rating - Rating candidate
router.put('/:id/rating', requireAuth, addUserToRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    if (typeof rating !== 'number' || rating < 0 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be a number between 0 and 5'
      });
    }

    const result = await Application.updateRating(req.db, id, rating, userId.toString());

    if (result.success) {
      console.log(`Candidate rated ${rating} stars for application ${id}`);
      res.json({
        success: true,
        message: result.message
      });
    } else {
      const statusCode = result.error.includes('not found') ? 404 :
                        result.error.includes('only rate') ? 403 : 400;
      
      res.status(statusCode).json({
        success: false,
        message: result.error
      });
    }

  } catch (error) {
    console.error('Error rating candidate:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to rate candidate',
      error: error.message
    });
  }
});

// POST /api/applications/:id/interview - Send interview questions
router.post('/:id/interview', requireAuth, addUserToRequest, async (req, res) => {
  try {
    const { id } = req.params;
    const { questions } = req.body;
    
    const userId = req.user?._id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Interview questions are required'
      });
    }

    const result = await Application.sendInterviewQuestions(req.db, id, questions, userId.toString());

    if (result.success) {
      console.log(`Interview questions sent for application ${id}`);
      res.json({
        success: true,
        message: result.message,
        questionsCount: result.questionsCount
      });
    } else {
      const statusCode = result.error.includes('not found') ? 404 :
                        result.error.includes('only send') ? 403 : 400;
      
      res.status(statusCode).json({
        success: false,
        message: result.error
      });
    }

  } catch (error) {
    console.error('Error sending interview questions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send interview questions',
      error: error.message
    });
  }
});

module.exports = router;