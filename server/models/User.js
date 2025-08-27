// ============================================
// USER MODEL - User data structure
// ============================================

const bcrypt = require('bcryptjs');
const { ObjectId } = require('mongodb');

class User {
  constructor(userData) {
    this.userType = userData.userType; // 'employer' ή 'jobSeeker'
    this.email = userData.email;
    this.password = userData.password; // will be hashed
    this.createdAt = new Date();
    this.updatedAt = new Date();
    
    // Profile data - different for each user type
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
      // Statistics
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
      
      // Files and links
      cv: userData.cv || '',
      portfolio: userData.portfolio || '',
      linkedIn: userData.linkedIn || '',
      github: userData.github || '',
      
      // Statistics
      applicationsSubmitted: 0,
      interviewsReceived: 0,
      savedJobs: []
    };
  }

  // Hash password before saving
  async hashPassword() {
    if (this.password) {
      const saltRounds = 12; // Very secure
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }

  // Validation methods
  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  validatePassword(plainPassword) {
    // At least 6 characters (user-friendly)
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
    
    if (!this.email) errors.push('Email is required');
    if (!this.password) errors.push('Password is required');
    if (!this.userType) errors.push('User type is required');
    
    if (!this.validateEmail()) errors.push('Invalid email format');
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Prepare for database save
  async prepareForSave() {
    await this.hashPassword();
    this.updatedAt = new Date();
    
    // Remove undefined values
    return JSON.parse(JSON.stringify(this));
  }

  // Static method for password comparison during login
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Static method to find user by email
  static async findByEmail(db, email) {
    return await db.collection('users').findOne({ email: email.toLowerCase() });
  }

  // Static method for user creation
  static async create(db, userData) {
    try {
      // Check if user with this email already exists
      const existingUser = await User.findByEmail(db, userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user object
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
              case 'minLength': return 'Password must be at least 6 characters';
              default: return '';
            }
          });
        throw new Error(passwordErrors.join(', '));
      }

      // Prepare for save
      const userToSave = await user.prepareForSave();
      
      // Convert email to lowercase for consistency
      userToSave.email = userToSave.email.toLowerCase();

      // Save to database
      const result = await db.collection('users').insertOne(userToSave);
      
      // Return user without password
      const savedUser = await db.collection('users').findOne(
        { _id: result.insertedId },
        { projection: { password: 0 } } // Exclude password
      );

      return savedUser;

    } catch (error) {
      throw error;
    }
  }

  // Static method for authentication - FIXED
  static async authenticate(db, email, password) {
    try {
      // Find user
      const user = await User.findByEmail(db, email);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check password
      const isValidPassword = await User.comparePassword(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      // FIXED: Return with flattened profile data
      const { password: _, profile, ...userWithoutPassword } = user;
      
      return {
        ...userWithoutPassword,
        // Add profile fields to top level for job seekers
        ...(user.userType === 'jobSeeker' && profile ? {
          firstName: profile.firstName,
          lastName: profile.lastName,
          phone: profile.phone,
          location: profile.location
        } : {}),
        // Add company name for employers
        ...(user.userType === 'employer' && profile ? {
          companyName: profile.companyName,
          industry: profile.industry
        } : {}),
        // Keep profile object for full access if needed
        profile: profile
      };

    } catch (error) {
      throw error;
    }
  }

  // Static method for profile update
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
        throw new Error('User not found');
      }

      // Return updated user without password
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