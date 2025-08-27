// server/models/Job.js
// Αυτό το αρχείο χειρίζεται τις αγγελίες εργασίας στη βάση δεδομένων

const { ObjectId } = require('mongodb');

class Job {
  // Όταν δημιουργούμε νέο Job, του δίνουμε τη σύνδεση με τη βάση
  constructor(db) {
    this.collection = db.collection('jobs'); // Εδώ θα αποθηκεύονται οι αγγελίες
  }

  // ΜΕΘΟΔΟΣ 1: Δημιουργία νέας αγγελίας
  async createJob(jobData, employerId) {
    // Φτιάχνουμε το αντικείμενο που θα αποθηκευτεί
    const newJob = {
      title: jobData.title,              // Τίτλος: "Frontend Developer"
      description: jobData.description,   // Περιγραφή της δουλειάς
      location: jobData.location,        // Τοποθεσία: "Αθήνα" 
      salary: jobData.salary || null,    // Μισθός (προαιρετικό)
      company: new ObjectId(employerId), // Ποια εταιρεία το δημοσίευσε
      status: 'active',                  // Κατάσταση: ενεργή
      createdAt: new Date(),            // Πότε δημιουργήθηκε
      applications: []                   // Λίστα με αιτήσεις (αρχικά κενή)
    };

    // Αποθηκεύουμε στη βάση δεδομένων
    const result = await this.collection.insertOne(newJob);
    
    // Επιστρέφουμε την αγγελία με το ID που της έδωσε η βάση
    return { ...newJob, _id: result.insertedId };
  }

  // ΜΕΘΟΔΟΣ 2: Βρες όλες τις αγγελίες
  async getAllJobs() {
    // Βρες όλες τις ενεργές αγγελίες, με τις πιο πρόσφατες πρώτες
    const jobs = await this.collection
      .find({ status: 'active' })     // Μόνο ενεργές αγγελίες
      .sort({ createdAt: -1 })        // Οι πιο πρόσφατες πρώτες
      .toArray();                     // Μετέτρεψε σε λίστα
    
    return jobs;
  }

  // ΜΕΘΟΔΟΣ 3: Βρες μια συγκεκριμένη αγγελία με το ID της
  async getJobById(jobId) {
    const job = await this.collection.findOne({ 
      _id: new ObjectId(jobId) 
    });
    return job;
  }

  // ΜΕΘΟΔΟΣ 4: Βρες τις αγγελίες μιας συγκεκριμένης εταιρείας
  async getJobsByEmployer(employerId) {
    const jobs = await this.collection
      .find({ company: new ObjectId(employerId) })
      .sort({ createdAt: -1 })
      .toArray();
    
    return jobs;
  }
}

// Εξάγουμε την κλάση για να τη χρησιμοποιήσουμε σε άλλα αρχεία
module.exports = Job;