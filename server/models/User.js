// ============================================
// USER MODEL - Δομή δεδομένων χρήστη
// ============================================

const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');

class User {
  constructor(userData) {
    this.userType = userData.userType; // 'employer' ή 'jobSeeker'
    this.email = userData.email;
    this.password = userData.password; // θα γίνει hash
    this.createdAt = new Date();
    this.updatedAt = new Date();
    
    // Profile data - διαφορετικά για κάθε user type
    this.profile = this.userType === 'employer' 
      ? this.createEmployerProfile(userData) 
      : this.createJobSeekerProfile(userData);
  }

  // Employer profile structure
  createEmployerProfile(userData) {
    return {
      companyName: userData.companyName || '',
      industry: userData.industry || '',
      companySize: userData.companySize || '',
      website: userData.website || '',
      description: userData.description || '',
      location: userData.location || '',
      logo: userData.logo || '',
      // Στατιστικά
      jobsPosted: 0,
      activeJobs: 0,
      totalApplications: 0
    };
  }

  // Job seeker profile structure  
  createJobSeekerProfile(userData) {
    return {
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      phone: userData.phone || '',
      location: userData.location || '',
      bio: userData.bio || '',
      
      // Professional info
      skills: userData.skills || [],
      experience: userData.experience || [],
      education: userData.education || [],
      
      // Job preferences
      desiredSalaryMin: userData.desiredSalaryMin || 0,
      desiredSalaryMax: userData.desiredSalaryMax || 0,
      jobTypes: userData.jobTypes || [], // ['full-time', 'remote', 'contract']
      categories: userData.categories || [], // ['technology', 'marketing', etc]
      
      // Files και links
      cv: userData.cv || '',
      portfolio: userData.portfolio || '',
      linkedIn: userData.linkedIn || '',
      github: userData.github || '',
      
      // Στατιστικά
      applicationsSubmitted: 0,
      interviewsReceived: 0,
      savedJobs: []
    };
  }

  // Hash password πριν την αποθήκευση
  async hashPassword() {
    if (this.password) {
      const saltRounds = 12; // Πολύ ασφαλές
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }

  // Validation methods
  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  validatePassword(plainPassword) {
    // Τουλάχιστον 6 χαρακτήρες (πιο user-friendly)
    const minLength = plainPassword.length >= 6;
    
    return {
      isValid: minLength,
      errors: {
        minLength: !minLength
      }
    };
  }

  validateRequired() {
    const errors = [];
    
    if (!this.email) errors.push('Email απαιτείται');
    if (!this.password) errors.push('Password απαιτείται');
    if (!this.userType) errors.push('User type απαιτείται');
    
    if (!this.validateEmail()) errors.push('Μη έγκυρο email format');
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Prepare για αποθήκευση στη βάση
  async prepareForSave() {
    await this.hashPassword();
    this.updatedAt = new Date();
    
    // Αφαιρούμε undefined values
    return JSON.parse(JSON.stringify(this));
  }

  // Static method για comparison password κατά το login
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Static method για εύρεση χρήστη από email
  static async findByEmail(db, email) {
    return await db.collection('users').findOne({ email: email.toLowerCase() });
  }

  // Static method για δημιουργία χρήστη
  static async create(db, userData) {
    try {
      // Έλεγχος αν υπάρχει ήδη χρήστης με αυτό το email
      const existingUser = await User.findByEmail(db, userData.email);
      if (existingUser) {
        throw new Error('Χρήστης με αυτό το email υπάρχει ήδη');
      }

      // Δημιουργία νέου user object
      const user = new User(userData);
      
      // Validation
      const validation = user.validateRequired();
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const passwordValidation = user.validatePassword(userData.password);
      if (!passwordValidation.isValid) {
        const passwordErrors = Object.keys(passwordValidation.errors)
          .filter(key => passwordValidation.errors[key])
          .map(key => {
            switch(key) {
              case 'minLength': return 'Password πρέπει να έχει τουλάχιστον 6 χαρακτήρες';
              default: return '';
            }
          });
        throw new Error(passwordErrors.join(', '));
      }

      // Προετοιμασία για αποθήκευση
      const userToSave = await user.prepareForSave();
      
      // Convert email σε lowercase για consistency
      userToSave.email = userToSave.email.toLowerCase();

      // Αποθήκευση στη βάση
      const result = await db.collection('users').insertOne(userToSave);
      
      // Επιστροφή του χρήστη χωρίς το password
      const savedUser = await db.collection('users').findOne(
        { _id: result.insertedId },
        { projection: { password: 0 } } // Exclude password
      );

      return savedUser;

    } catch (error) {
      throw error;
    }
  }

  // Static method για authentication
  static async authenticate(db, email, password) {
    try {
      // Βρες χρήστη
      const user = await User.findByEmail(db, email);
      if (!user) {
        throw new Error('Λάθος email ή password');
      }

      // Έλεγχος password
      const isValidPassword = await User.comparePassword(password, user.password);
      if (!isValidPassword) {
        throw new Error('Λάθος email ή password');
      }

      // Επιστροφή χρήστη χωρίς password
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;

    } catch (error) {
      throw error;
    }
  }

  // Static method για update profile
  static async updateProfile(db, userId, profileData) {
    try {
      const updateData = {
        ...profileData,
        updatedAt: new Date()
      };

      const result = await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        throw new Error('Χρήστης δεν βρέθηκε');
      }

      // Επιστροφή updated χρήστη χωρίς password
      const updatedUser = await db.collection('users').findOne(
        { _id: new ObjectId(userId) },
        { projection: { password: 0 } }
      );

      return updatedUser;

    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;