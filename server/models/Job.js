// server/models/Job.js
// Αυτό το αρχείο χειρίζεται τις αγγελίες εργασίας στη βάση δεδομένων

const { ObjectId } = require('mongodb');

class Job {
  // Όταν δημιουργούμε νέο Job, του δίνουμε τη σύνδεση με τη βάση
  constructor(db) {
    this.collection = db.collection('jobs'); // Εδώ θα αποθηκεύονται οι αγγελίες
  }

  // ΜΕΘΟΔΟΣ 1: Δημιουργία νέας αγγελίας - ΕΝΗΜΕΡΩΜΕΝΗ
  async createJob(jobData, employerId) {
    // Φτιάχνουμε το αντικείμενο που θα αποθηκευτεί με όλα τα πεδία
    const newJob = {
      // Basic Information
      title: jobData.title,
      company: jobData.company || 'Company Name',
      description: jobData.description,
      location: jobData.location,
      
      // Employment Details
      workType: jobData.workType || 'office',        // remote, office, hybrid
      type: jobData.type || 'full-time',              // full-time, part-time, contract
      
      // Additional Information
      requirements: jobData.requirements || '',
      responsibilities: jobData.responsibilities || '',
      salary: jobData.salary || 'Competitive',
      benefits: jobData.benefits || '',
      experienceLevel: jobData.experienceLevel || 'mid',
      skills: jobData.skills || '',
      department: jobData.department || '',
      
      // Dates
      applicationDeadline: jobData.applicationDeadline ? new Date(jobData.applicationDeadline) : null,
      startDate: jobData.startDate ? new Date(jobData.startDate) : null,
      
      // System Fields
      employerId: new ObjectId(employerId),          // Ποια εταιρεία το δημοσίευσε
      status: jobData.status || 'active',            // active, closed, draft
      createdAt: new Date(),                         // Πότε δημιουργήθηκε
      updatedAt: new Date(),                         // Πότε ενημερώθηκε τελευταία
      datePosted: new Date(),                        // Public posting date
      
      // Statistics
      applicants: 0,                                 // Αριθμός αιτήσεων
      views: 0,                                      // Αριθμός προβολών
      applications: []                               // Λίστα με αιτήσεις (αρχικά κενή)
    };

    console.log('Creating job in database:', newJob);

    try {
      // Αποθηκεύουμε στη βάση δεδομένων
      const result = await this.collection.insertOne(newJob);
      
      // Επιστρέφουμε την αγγελία με το ID που της έδωσε η βάση
      const createdJob = { ...newJob, _id: result.insertedId };
      console.log('Job created successfully with ID:', result.insertedId);
      return createdJob;
    } catch (error) {
      console.error('Error creating job in database:', error);
      throw error;
    }
  }

  // ΜΕΘΟΔΟΣ 2: Βρες όλες τις αγγελίες - ΕΝΗΜΕΡΩΜΕΝΗ
  async getAllJobs() {
    try {
      // Βρες όλες τις ενεργές αγγελίες, με τις πιο πρόσφατες πρώτες
      const jobs = await this.collection
        .find({ status: 'active' })     // Μόνο ενεργές αγγελίες
        .sort({ createdAt: -1 })        // Οι πιο πρόσφατες πρώτες
        .toArray();                     // Μετέτρεψε σε λίστα
      
      console.log(`Found ${jobs.length} active jobs`);
      return jobs;
    } catch (error) {
      console.error('Error getting all jobs:', error);
      throw error;
    }
  }

  // ΜΕΘΟΔΟΣ 3: Βρες μια συγκεκριμένη αγγελία με το ID της - ΕΝΗΜΕΡΩΜΕΝΗ
  async getJobById(jobId) {
    try {
      const job = await this.collection.findOne({ 
        _id: new ObjectId(jobId) 
      });
      
      if (job) {
        console.log('Found job:', job.title);
      } else {
        console.log('Job not found with ID:', jobId);
      }
      
      return job;
    } catch (error) {
      console.error('Error getting job by ID:', error);
      throw error;
    }
  }

  // ΜΕΘΟΔΟΣ 4: Βρες τις αγγελίες μιας συγκεκριμένης εταιρείας - ΕΝΗΜΕΡΩΜΕΝΗ
  async getJobsByEmployer(employerId) {
    try {
      console.log('Searching jobs for employer:', employerId);
      
      const jobs = await this.collection
        .find({ employerId: new ObjectId(employerId) })  // ΔΙΟΡΘΩΣΗ: employerId αντί για company
        .sort({ createdAt: -1 })
        .toArray();
      
      console.log(`Found ${jobs.length} jobs for employer ${employerId}`);
      return jobs;
    } catch (error) {
      console.error('Error getting jobs by employer:', error);
      throw error;
    }
  }

  // ΜΕΘΟΔΟΣ 5: Ενημέρωση αγγελίας - ΝΕΑ
  async updateJob(jobId, updateData) {
    try {
      console.log('Updating job:', jobId);
      
      // Προσθέτουμε updatedAt timestamp
      updateData.updatedAt = new Date();
      
      const result = await this.collection.updateOne(
        { _id: new ObjectId(jobId) },
        { $set: updateData }
      );
      
      if (result.modifiedCount === 0) {
        throw new Error('Job not found or no changes made');
      }
      
      // Επιστρέφουμε την ενημερωμένη αγγελία
      const updatedJob = await this.getJobById(jobId);
      console.log('Job updated successfully');
      return updatedJob;
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  }

  // ΜΕΘΟΔΟΣ 6: Διαγραφή αγγελίας - ΝΕΑ
  async deleteJob(jobId) {
    try {
      console.log('Deleting job:', jobId);
      
      const result = await this.collection.deleteOne({
        _id: new ObjectId(jobId)
      });
      
      if (result.deletedCount === 0) {
        throw new Error('Job not found');
      }
      
      console.log('Job deleted successfully');
      return result;
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  }

  // ΜΕΘΟΔΟΣ 7: Αύξηση προβολών - ΝΕΑ
  async incrementViews(jobId) {
    try {
      const result = await this.collection.updateOne(
        { _id: new ObjectId(jobId) },
        { $inc: { views: 1 } }  // Αύξηση προβολών κατά 1
      );
      
      return result;
    } catch (error) {
      console.error('Error incrementing views:', error);
      throw error;
    }
  }

  // ΜΕΘΟΔΟΣ 8: Αύξηση αιτήσεων - ΝΕΑ
  async incrementApplications(jobId) {
    try {
      const result = await this.collection.updateOne(
        { _id: new ObjectId(jobId) },
        { $inc: { applicants: 1 } }  // Αύξηση αιτήσεων κατά 1
      );
      
      return result;
    } catch (error) {
      console.error('Error incrementing applications:', error);
      throw error;
    }
  }

  // ΜΕΘΟΔΟΣ 9: Αλλαγή κατάστασης αγγελίας - ΝΕΑ
  async updateStatus(jobId, status) {
    try {
      const result = await this.collection.updateOne(
        { _id: new ObjectId(jobId) },
        { 
          $set: { 
            status: status,
            updatedAt: new Date() 
          } 
        }
      );
      
      return result;
    } catch (error) {
      console.error('Error updating job status:', error);
      throw error;
    }
  }

  // ΜΕΘΟΔΟΣ 10: Αναζήτηση αγγελιών με φίλτρα - ΝΕΑ
  async searchJobs(filters = {}) {
    try {
      let query = { status: 'active' };  // Πάντα μόνο ενεργές αγγελίες
      
      // Φίλτρο τίτλου ή περιγραφής
      if (filters.search) {
        query.$or = [
          { title: { $regex: filters.search, $options: 'i' } },
          { description: { $regex: filters.search, $options: 'i' } },
          { company: { $regex: filters.search, $options: 'i' } }
        ];
      }
      
      // Φίλτρο τοποθεσίας
      if (filters.location) {
        query.location = { $regex: filters.location, $options: 'i' };
      }
      
      // Φίλτρο τύπου εργασίας
      if (filters.workType) {
        query.workType = filters.workType;
      }
      
      // Φίλτρο τύπου απασχόλησης
      if (filters.type) {
        query.type = filters.type;
      }
      
      // Φίλτρο εμπειρίας
      if (filters.experienceLevel) {
        query.experienceLevel = filters.experienceLevel;
      }
      
      const jobs = await this.collection
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();
      
      console.log(`Search found ${jobs.length} jobs`);
      return jobs;
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw error;
    }
  }
}

// Εξάγουμε την κλάση για να τη χρησιμοποιήσουμε σε άλλα αρχεία
module.exports = Job;