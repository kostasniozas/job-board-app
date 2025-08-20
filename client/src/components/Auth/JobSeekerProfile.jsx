// JobSeekerProfile.jsx - Multi-step Job Seeker Profile Form

import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import './JobSeekerProfile.css';

function JobSeekerProfile({ userBasicInfo, onComplete, onBack }) {
  // Step 1: Create state for profile data
  const [profileData, setProfileData] = useState({
    // Personal Information (additional to what we have from registration)
    dateOfBirth: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    
    // Professional Information
    jobTitle: '',
    experienceLevel: '',
    industry: '',
    employmentType: [], // Array for multiple selections (full-time, part-time, etc.)
    
    // Skills and Education
    skills: '',
    languages: [],
    education: '',
    university: '',
    
    // Preferences
    expectedSalary: '',
    workLocation: '', // remote, office, hybrid
    availableToStart: '',
    
    // Optional
    portfolio: '',
    linkedIn: '',
    summary: ''
  });

  // Step 2: Form navigation state
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const totalSteps = 4;

  // Step 3: Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      // Handle employment type checkboxes
      setProfileData(prev => ({
        ...prev,
        [name]: checked 
          ? [...prev[name], value]
          : prev[name].filter(item => item !== value)
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Step 4: Add language to languages array
  const addLanguage = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const language = e.target.value.trim();
      if (language && !profileData.languages.includes(language)) {
        setProfileData(prev => ({
          ...prev,
          languages: [...prev.languages, language]
        }));
        e.target.value = '';
      }
    }
  };

  // Step 5: Remove language
  const removeLanguage = (languageToRemove) => {
    setProfileData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang !== languageToRemove)
    }));
  };

  // Step 6: Validate current step
  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!profileData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!profileData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!profileData.address.trim()) newErrors.address = 'Address is required';
        if (!profileData.city.trim()) newErrors.city = 'City is required';
        if (!profileData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';
        break;
      
      case 2:
        if (!profileData.experienceLevel) newErrors.experienceLevel = 'Experience level is required';
        if (!profileData.industry) newErrors.industry = 'Industry is required';
        if (profileData.employmentType.length === 0) newErrors.employmentType = 'Select at least one employment type';
        break;
      
      case 3:
        if (!profileData.skills.trim()) newErrors.skills = 'Skills are required';
        if (!profileData.education) newErrors.education = 'Education level is required';
        break;
      
      case 4:
        if (!profileData.workLocation) newErrors.workLocation = 'Work location preference is required';
        if (!profileData.availableToStart) newErrors.availableToStart = 'Availability is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 7: Handle next step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  // Step 8: Handle previous step
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Step 9: Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Complete job seeker profile:', {
        ...userBasicInfo,
        ...profileData
      });
      
      setIsLoading(false);
      onComplete({
        ...userBasicInfo,
        ...profileData
      });
    }, 2000);
  };

  // Step 10: Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <div className="step-header">
              <h3>Personal Information</h3>
              <p>Complete your personal details</p>
            </div>
            
            {/* Date of Birth */}
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth *</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={profileData.dateOfBirth}
                onChange={handleChange}
                className={`form-input ${errors.dateOfBirth ? 'error' : ''}`}
              />
              {errors.dateOfBirth && <div className="error-text">{errors.dateOfBirth}</div>}
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profileData.phone}
                onChange={handleChange}
                className={`form-input ${errors.phone ? 'error' : ''}`}
                placeholder="+30 123 456 7890"
              />
              {errors.phone && <div className="error-text">{errors.phone}</div>}
            </div>

            {/* Address */}
            <div className="form-group">
              <label htmlFor="address">Street Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={profileData.address}
                onChange={handleChange}
                className={`form-input ${errors.address ? 'error' : ''}`}
                placeholder="123 Main Street"
              />
              {errors.address && <div className="error-text">{errors.address}</div>}
            </div>

            {/* City and Country */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={profileData.city}
                  onChange={handleChange}
                  className={`form-input ${errors.city ? 'error' : ''}`}
                  placeholder="Athens"
                />
                {errors.city && <div className="error-text">{errors.city}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  name="country"
                  value={profileData.country}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Select country</option>
                  <option value="greece">Greece</option>
                  <option value="cyprus">Cyprus</option>
                  <option value="germany">Germany</option>
                  <option value="uk">United Kingdom</option>
                  <option value="usa">United States</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Current/Desired Job Title */}
            <div className="form-group">
              <label htmlFor="jobTitle">Current/Desired Job Title *</label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={profileData.jobTitle}
                onChange={handleChange}
                className={`form-input ${errors.jobTitle ? 'error' : ''}`}
                placeholder="e.g. Frontend Developer, Marketing Manager"
              />
              {errors.jobTitle && <div className="error-text">{errors.jobTitle}</div>}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <div className="step-header">
              <h3>Experience & Industry</h3>
              <p>Tell us about your professional background</p>
            </div>
            
            <div className="form-group">
              <label htmlFor="experienceLevel">Experience Level *</label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={profileData.experienceLevel}
                onChange={handleChange}
                className={`form-input ${errors.experienceLevel ? 'error' : ''}`}
              >
                <option value="">Select your experience level</option>
                <option value="entry">Entry Level (0-2 years)</option>
                <option value="mid">Mid Level (2-5 years)</option>
                <option value="senior">Senior Level (5-10 years)</option>
                <option value="lead">Lead/Principal (10+ years)</option>
                <option value="executive">Executive/C-Level</option>
              </select>
              {errors.experienceLevel && <div className="error-text">{errors.experienceLevel}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="industry">Industry *</label>
              <select
                id="industry"
                name="industry"
                value={profileData.industry}
                onChange={handleChange}
                className={`form-input ${errors.industry ? 'error' : ''}`}
              >
                <option value="">Select your industry</option>
                <option value="technology">Technology</option>
                <option value="finance">Finance</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
                <option value="design">Design</option>
                <option value="engineering">Engineering</option>
                <option value="consulting">Consulting</option>
                <option value="retail">Retail</option>
                <option value="other">Other</option>
              </select>
              {errors.industry && <div className="error-text">{errors.industry}</div>}
            </div>

            <div className="form-group">
              <label>Employment Type Preferences *</label>
              <div className="checkbox-group">
                {['full-time', 'part-time', 'contract', 'freelance', 'internship'].map(type => (
                  <label key={type} className="checkbox-option">
                    <input
                      type="checkbox"
                      name="employmentType"
                      value={type}
                      checked={profileData.employmentType.includes(type)}
                      onChange={handleChange}
                    />
                    <span>{type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}</span>
                  </label>
                ))}
              </div>
              {errors.employmentType && <div className="error-text">{errors.employmentType}</div>}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <div className="step-header">
              <h3>Skills & Education</h3>
              <p>Showcase your abilities and qualifications</p>
            </div>
            
            <div className="form-group">
              <label htmlFor="skills">Skills & Technologies *</label>
              <textarea
                id="skills"
                name="skills"
                value={profileData.skills}
                onChange={handleChange}
                className={`form-input ${errors.skills ? 'error' : ''}`}
                placeholder="e.g. JavaScript, React, Node.js, Project Management, Adobe Creative Suite..."
                rows="4"
              />
              <div className="field-hint">Separate skills with commas</div>
              {errors.skills && <div className="error-text">{errors.skills}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="languageInput">Languages</label>
              <input
                type="text"
                id="languageInput"
                placeholder="Type a language and press Enter"
                onKeyPress={addLanguage}
                className="form-input"
              />
              <div className="field-hint">Press Enter to add each language</div>
              
              {profileData.languages.length > 0 && (
                <div className="tags-container">
                  {profileData.languages.map(language => (
                    <span key={language} className="tag">
                      {language}
                      <button 
                        type="button" 
                        onClick={() => removeLanguage(language)}
                        className="tag-remove"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="education">Education Level *</label>
              <select
                id="education"
                name="education"
                value={profileData.education}
                onChange={handleChange}
                className={`form-input ${errors.education ? 'error' : ''}`}
              >
                <option value="">Select your education level</option>
                <option value="high-school">High School</option>
                <option value="associate">Associate Degree</option>
                <option value="bachelor">Bachelor's Degree</option>
                <option value="master">Master's Degree</option>
                <option value="phd">PhD</option>
                <option value="bootcamp">Bootcamp/Certificate</option>
                <option value="self-taught">Self-taught</option>
              </select>
              {errors.education && <div className="error-text">{errors.education}</div>}
            </div>

            {/* University/Institution */}
            <div className="form-group">
              <label htmlFor="university">University/Institution</label>
              <input
                type="text"
                id="university"
                name="university"
                value={profileData.university}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. University of Athens, TEI, etc."
              />
              <div className="field-hint">Optional - Name of your university or educational institution</div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <div className="step-header">
              <h3>Preferences & Additional Info</h3>
              <p>Help us match you with the right opportunities</p>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expectedSalary">Expected Salary (€/year)</label>
                <input
                  type="number"
                  id="expectedSalary"
                  name="expectedSalary"
                  value={profileData.expectedSalary}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. 35000"
                />
              </div>

              <div className="form-group">
                <label htmlFor="availableToStart">Available to Start *</label>
                <select
                  id="availableToStart"
                  name="availableToStart"
                  value={profileData.availableToStart}
                  onChange={handleChange}
                  className={`form-input ${errors.availableToStart ? 'error' : ''}`}
                >
                  <option value="">Select availability</option>
                  <option value="immediately">Immediately</option>
                  <option value="2-weeks">2 weeks notice</option>
                  <option value="1-month">1 month notice</option>
                  <option value="2-months">2+ months</option>
                </select>
                {errors.availableToStart && <div className="error-text">{errors.availableToStart}</div>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="workLocation">Work Location Preference *</label>
              <div className="radio-group">
                {[
                  { value: 'remote', label: 'Remote Only' },
                  { value: 'office', label: 'Office Only' },
                  { value: 'hybrid', label: 'Hybrid (Remote + Office)' },
                  { value: 'flexible', label: 'Flexible' }
                ].map(option => (
                  <label key={option.value} className="radio-option">
                    <input
                      type="radio"
                      name="workLocation"
                      value={option.value}
                      checked={profileData.workLocation === option.value}
                      onChange={handleChange}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.workLocation && <div className="error-text">{errors.workLocation}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="portfolio">Portfolio/Website URL</label>
              <input
                type="url"
                id="portfolio"
                name="portfolio"
                value={profileData.portfolio}
                onChange={handleChange}
                className="form-input"
                placeholder="https://yourportfolio.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="linkedIn">LinkedIn Profile URL</label>
              <input
                type="url"
                id="linkedIn"
                name="linkedIn"
                value={profileData.linkedIn}
                onChange={handleChange}
                className="form-input"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            {/* Professional Summary */}
            <div className="form-group">
              <label htmlFor="summary">Professional Summary</label>
              <textarea
                id="summary"
                name="summary"
                value={profileData.summary}
                onChange={handleChange}
                className="form-input"
                placeholder="Write a brief summary about yourself, your goals, and what makes you unique..."
                rows="4"
              />
              <div className="field-hint">Optional - A brief professional summary that employers will see</div>
            </div>
          </div>
        );

      default:
        return (
          <div className="step-content">
            <div className="step-header">
              <h3>Step {currentStep}</h3>
              <p>Content for step {currentStep} goes here</p>
            </div>
            <div className="placeholder-content">
              <p>This step is under construction</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        
        {/* Header with back button */}
        <div className="profile-header">
          <button onClick={onBack} className="back-btn">
            <ChevronLeft size={20} />
            Back
          </button>
          <div className="header-text">
            <h1>Complete Your Profile</h1>
            <p>Help us find the perfect job for you, {userBasicInfo?.firstName}!</p>
          </div>
        </div>

        {/* User Info Display */}
        <div className="user-info-display">
          <div className="user-avatar-large">
            {userBasicInfo?.firstName?.charAt(0)}{userBasicInfo?.lastName?.charAt(0)}
          </div>
          <div className="user-basic-info">
            <h3>{userBasicInfo?.firstName} {userBasicInfo?.lastName}</h3>
            <p>{userBasicInfo?.email}</p>
            <span className="user-type-badge">
              {userBasicInfo?.userType === 'jobseeker' ? 'Job Seeker' : 'Employer'}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
          <div className="progress-text">
            Step {currentStep} of {totalSteps}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={currentStep === totalSteps ? handleSubmit : undefined}>
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="form-navigation">
            {currentStep > 1 && (
              <button 
                type="button" 
                onClick={handlePrevious}
                className="btn btn-outline nav-btn"
              >
                <ChevronLeft size={20} />
                Previous
              </button>
            )}
            
            {currentStep < totalSteps ? (
              <button 
                type="button" 
                onClick={handleNext}
                className="btn btn-primary nav-btn"
              >
                Next
                <ChevronRight size={20} />
              </button>
            ) : (
              <button 
                type="submit" 
                className="btn btn-primary nav-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Completing...' : 'Complete Profile'}
              </button>
            )}
          </div>
        </form>

      </div>
    </div>
  );
}

export default JobSeekerProfile;