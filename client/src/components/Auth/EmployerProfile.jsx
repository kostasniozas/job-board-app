// EmployerProfile.jsx - Employer Profile Form

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './EmployerProfile.css';

function EmployerProfile({ userBasicInfo, onComplete, onBack }) {
  // Step 1: Create state for employer profile data
  const [profileData, setProfileData] = useState({
    // Company Information
    companyName: '',
    companySize: '',
    industry: '',
    website: '',
    
    // Contact Information
    jobTitle: '',
    phone: '',
    location: '',
    
    // Company Description
    companyDescription: '',
    
    // Hiring Information
    typicalHires: [], // Types of roles they usually hire for
    hiringFrequency: ''
  });

  // Step 2: Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const totalSteps = 2; // Simpler than job seeker - only 2 steps

  // Step 3: Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      // Handle typical hires checkboxes
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

  // Step 4: Validate current step
  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!profileData.companyName.trim()) newErrors.companyName = 'Company name is required';
        if (!profileData.industry) newErrors.industry = 'Industry is required';
        if (!profileData.jobTitle.trim()) newErrors.jobTitle = 'Your job title is required';
        if (!profileData.phone.trim()) newErrors.phone = 'Phone number is required';
        break;
      
      case 2:
        if (!profileData.location.trim()) newErrors.location = 'Company location is required';
        if (!profileData.companyDescription.trim()) newErrors.companyDescription = 'Company description is required';
        if (!profileData.hiringFrequency) newErrors.hiringFrequency = 'Hiring frequency is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 5: Handle next step
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  // Step 6: Handle previous step
  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Step 7: Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Complete employer profile:', {
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

  // Step 8: Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <div className="step-header">
              <h3>Company & Contact Information</h3>
              <p>Tell us about your company and role</p>
            </div>
            
            <div className="form-group">
              <label htmlFor="companyName">Company Name *</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={profileData.companyName}
                onChange={handleChange}
                className={`form-input ${errors.companyName ? 'error' : ''}`}
                placeholder="e.g. Tech Solutions Inc."
              />
              {errors.companyName && <div className="error-text">{errors.companyName}</div>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="companySize">Company Size</label>
                <select
                  id="companySize"
                  name="companySize"
                  value={profileData.companySize}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Select company size (optional)</option>
                  <option value="startup">Startup (1-10 employees)</option>
                  <option value="small">Small (11-50 employees)</option>
                  <option value="medium">Medium (51-200 employees)</option>
                  <option value="large">Large (201-1000 employees)</option>
                  <option value="enterprise">Enterprise (1000+ employees)</option>
                </select>
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
                  <option value="marketing">Marketing & Advertising</option>
                  <option value="retail">Retail & E-commerce</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="consulting">Consulting</option>
                  <option value="real-estate">Real Estate</option>
                  <option value="hospitality">Hospitality & Travel</option>
                  <option value="other">Other</option>
                </select>
                {errors.industry && <div className="error-text">{errors.industry}</div>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="website">Company Website</label>
              <input
                type="url"
                id="website"
                name="website"
                value={profileData.website}
                onChange={handleChange}
                className="form-input"
                placeholder="https://www.yourcompany.com"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="jobTitle">Your Job Title *</label>
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  value={profileData.jobTitle}
                  onChange={handleChange}
                  className={`form-input ${errors.jobTitle ? 'error' : ''}`}
                  placeholder="e.g. HR Manager, CEO, Recruiter"
                />
                {errors.jobTitle && <div className="error-text">{errors.jobTitle}</div>}
              </div>

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
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <div className="step-header">
              <h3>Company Details & Hiring</h3>
              <p>Help candidates understand your company better</p>
            </div>
            
            <div className="form-group">
              <label htmlFor="location">Company Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={profileData.location}
                onChange={handleChange}
                className={`form-input ${errors.location ? 'error' : ''}`}
                placeholder="e.g. Athens, Greece"
              />
              {errors.location && <div className="error-text">{errors.location}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="companyDescription">Company Description *</label>
              <textarea
                id="companyDescription"
                name="companyDescription"
                value={profileData.companyDescription}
                onChange={handleChange}
                className={`form-input ${errors.companyDescription ? 'error' : ''}`}
                placeholder="Describe your company, what you do, your mission, and company culture..."
                rows="5"
              />
              <div className="field-hint">This will be visible to job seekers</div>
              {errors.companyDescription && <div className="error-text">{errors.companyDescription}</div>}
            </div>

            <div className="form-group">
              <label>Types of Roles You Typically Hire</label>
              <div className="checkbox-group">
                {[
                  'developers',
                  'designers', 
                  'marketing',
                  'sales',
                  'management',
                  'customer-service',
                  'finance',
                  'operations',
                  'hr',
                  'interns'
                ].map(role => (
                  <label key={role} className="checkbox-option">
                    <input
                      type="checkbox"
                      name="typicalHires"
                      value={role}
                      checked={profileData.typicalHires.includes(role)}
                      onChange={handleChange}
                    />
                    <span>{role.charAt(0).toUpperCase() + role.slice(1).replace('-', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="hiringFrequency">How Often Do You Hire? *</label>
              <select
                id="hiringFrequency"
                name="hiringFrequency"
                value={profileData.hiringFrequency}
                onChange={handleChange}
                className={`form-input ${errors.hiringFrequency ? 'error' : ''}`}
              >
                <option value="">Select hiring frequency</option>
                <option value="weekly">Weekly (High growth company)</option>
                <option value="monthly">Monthly (Regular hiring)</option>
                <option value="quarterly">Quarterly (Seasonal hiring)</option>
                <option value="annually">Annually (Occasional hiring)</option>
                <option value="as-needed">As needed (Project-based)</option>
              </select>
              {errors.hiringFrequency && <div className="error-text">{errors.hiringFrequency}</div>}
            </div>
          </div>
        );

      default:
        return <div>Step {currentStep} content coming next...</div>;
    }
  };

  return (
    <div className="employer-profile-container">
      <div className="employer-profile-card">
        
        {/* Header with back button */}
        <div className="profile-header">
          <button onClick={onBack} className="back-btn">
            <ChevronLeft size={20} />
            Back
          </button>
          <div className="header-text">
            <h1>Complete Your Company Profile</h1>
            <p>Attract the best candidates to your company</p>
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

export default EmployerProfile;