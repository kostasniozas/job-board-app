// server/models/Application.js
// Raw MongoDB version - συμβατό με το υπάρχον σύστημα

const { ObjectId } = require('mongodb');

class Application {
  constructor(data = {}) {
    this.jobId = data.jobId ? new ObjectId(data.jobId) : null;
    this.applicantId = data.applicantId ? new ObjectId(data.applicantId) : null;
    this.status = data.status || 'pending';
    this.appliedDate = data.appliedDate || new Date();
    this.interviewStatus = data.interviewStatus || 'not_requested';
    this.interviewQuestions = data.interviewQuestions || [];
    this.rating = data.rating || 0;
    this.coverLetter = data.coverLetter || '';
    this.resumePath = data.resumePath || null;
    this.employerNotes = data.employerNotes || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Validation method
  validate() {
    const errors = [];

    if (!this.jobId) {
      errors.push('Job ID is required');
    }

    if (!this.applicantId) {
      errors.push('Applicant ID is required');
    }

    if (!['pending', 'approved', 'rejected'].includes(this.status)) {
      errors.push('Invalid status');
    }

    if (!['not_requested', 'questions_sent', 'completed', 'reviewed'].includes(this.interviewStatus)) {
      errors.push('Invalid interview status');
    }

    if (this.rating < 0 || this.rating > 5) {
      errors.push('Rating must be between 0 and 5');
    }

    if (this.coverLetter && this.coverLetter.length > 2000) {
      errors.push('Cover letter too long');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Convert to database format
  toDbObject() {
    const validation = this.validate();
    if (!validation.isValid) {
      throw new Error('Validation failed: ' + validation.errors.join(', '));
    }

    this.updatedAt = new Date();
    
    return {
      jobId: this.jobId,
      applicantId: this.applicantId,
      status: this.status,
      appliedDate: this.appliedDate,
      interviewStatus: this.interviewStatus,
      interviewQuestions: this.interviewQuestions,
      rating: this.rating,
      coverLetter: this.coverLetter,
      resumePath: this.resumePath,
      employerNotes: this.employerNotes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Static methods για database operations
  static async create(db, applicationData) {
    try {
      const app = new Application(applicationData);
      const dbObject = app.toDbObject();
      
      // Check for duplicate application
      const existing = await db.collection('applications').findOne({
        jobId: dbObject.jobId,
        applicantId: dbObject.applicantId
      });

      if (existing) {
        throw new Error('User has already applied for this job');
      }

      const result = await db.collection('applications').insertOne(dbObject);
      
      return {
        success: true,
        applicationId: result.insertedId,
        application: { ...dbObject, _id: result.insertedId }
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async findByEmployer(db, employerId) {
    try {
      // Pipeline για να βρούμε applications για jobs του employer
      const pipeline = [
        // Lookup job information
        {
          $lookup: {
            from: 'jobs',
            localField: 'jobId',
            foreignField: '_id',
            as: 'job'
          }
        },
        // Filter μόνο τα jobs αυτού του employer
        {
          $match: {
            'job.employerId': new ObjectId(employerId)
          }
        },
        // Lookup applicant information
        {
          $lookup: {
            from: 'users',
            localField: 'applicantId',
            foreignField: '_id',
            as: 'applicant'
          }
        },
        // Sort by applied date
        {
          $sort: { appliedDate: -1 }
        }
      ];

      const applications = await db.collection('applications')
        .aggregate(pipeline)
        .toArray();

      // Privacy-safe transformation
      const safeApplications = applications.map(app => {
        const job = app.job[0] || {};
        const applicant = app.applicant[0] || {};
        
        const firstName = applicant.firstName || '';
        const lastName = applicant.lastName || '';
        
        return {
          id: app._id,
          profileId: `candidate_${app._id.toString().slice(-6)}`,
          initials: `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U.U.',
          appliedFor: job.title || 'Unknown Position',
          appliedDate: app.appliedDate,
          status: app.status,
          interviewStatus: app.interviewStatus,
          rating: app.rating,
          location: applicant.location || 'Location not specified',
          coverLetter: app.coverLetter || '',
          employerNotes: app.employerNotes || '',
          experience: applicant.experience || 'Not specified', // Αν υπάρχει
          education: applicant.education || 'Not specified', // Αν υπάρχει
          skills: applicant.skills || [], // Αν υπάρχει
          summary: applicant.bio || 'No summary provided', // Αν υπάρχει
          lastActive: '2 days ago' // Placeholder
        };
      });

      return {
        success: true,
        applications: safeApplications,
        count: safeApplications.length
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        applications: []
      };
    }
  }

  static async updateStatus(db, applicationId, newStatus, employerId) {
    try {
      // Ελέγχουμε ότι η application ανήκει στον employer
      const pipeline = [
        {
          $match: { _id: new ObjectId(applicationId) }
        },
        {
          $lookup: {
            from: 'jobs',
            localField: 'jobId',
            foreignField: '_id',
            as: 'job'
          }
        }
      ];

      const applications = await db.collection('applications')
        .aggregate(pipeline)
        .toArray();

      if (applications.length === 0) {
        throw new Error('Application not found');
      }

      const application = applications[0];
      const job = application.job[0];

      if (!job || job.employerId.toString() !== employerId) {
        throw new Error('You can only update applications for your own jobs');
      }

      // Update status
      const result = await db.collection('applications').updateOne(
        { _id: new ObjectId(applicationId) },
        { 
          $set: { 
            status: newStatus,
            updatedAt: new Date()
          } 
        }
      );

      return {
        success: true,
        message: `Application ${newStatus} successfully`,
        modifiedCount: result.modifiedCount
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async updateRating(db, applicationId, rating, employerId) {
    try {
      if (rating < 0 || rating > 5) {
        throw new Error('Rating must be between 0 and 5');
      }

      // Ελέγχουμε ownership όπως στο updateStatus
      const pipeline = [
        {
          $match: { _id: new ObjectId(applicationId) }
        },
        {
          $lookup: {
            from: 'jobs',
            localField: 'jobId',
            foreignField: '_id',
            as: 'job'
          }
        }
      ];

      const applications = await db.collection('applications')
        .aggregate(pipeline)
        .toArray();

      if (applications.length === 0) {
        throw new Error('Application not found');
      }

      const application = applications[0];
      const job = application.job[0];

      if (!job || job.employerId.toString() !== employerId) {
        throw new Error('You can only rate applications for your own jobs');
      }

      const result = await db.collection('applications').updateOne(
        { _id: new ObjectId(applicationId) },
        { 
          $set: { 
            rating: rating,
            updatedAt: new Date()
          } 
        }
      );

      return {
        success: true,
        message: 'Candidate rated successfully',
        modifiedCount: result.modifiedCount
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async sendInterviewQuestions(db, applicationId, questions, employerId) {
    try {
      if (!questions || !Array.isArray(questions) || questions.length === 0) {
        throw new Error('Interview questions are required');
      }

      // Ελέγχουμε ownership
      const pipeline = [
        {
          $match: { _id: new ObjectId(applicationId) }
        },
        {
          $lookup: {
            from: 'jobs',
            localField: 'jobId',
            foreignField: '_id',
            as: 'job'
          }
        }
      ];

      const applications = await db.collection('applications')
        .aggregate(pipeline)
        .toArray();

      if (applications.length === 0) {
        throw new Error('Application not found');
      }

      const application = applications[0];
      const job = application.job[0];

      if (!job || job.employerId.toString() !== employerId) {
        throw new Error('You can only send interview questions for your own job applications');
      }

      // Format questions
      const formattedQuestions = questions.map((q, index) => ({
        question: q,
        isCustom: index < 4 // Πρώτες 4 custom, υπόλοιπες random
      }));

      const result = await db.collection('applications').updateOne(
        { _id: new ObjectId(applicationId) },
        { 
          $set: { 
            interviewQuestions: formattedQuestions,
            interviewStatus: 'questions_sent',
            updatedAt: new Date()
          } 
        }
      );

      return {
        success: true,
        message: 'Interview questions sent successfully',
        questionsCount: formattedQuestions.length,
        modifiedCount: result.modifiedCount
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = Application;