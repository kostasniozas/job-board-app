// PostJobForm.jsx - Post Job Form Component (Dashboard Compatible)

import { useState } from 'react';
import { ArrowLeft, MapPin, Clock, Users, DollarSign } from 'lucide-react';
import './PostJobForm.css';

function PostJobForm({ onBack, userInfo }) {
  // Step 1: Job posting state
  const [jobData, setJobData] = useState({
    // Basic Information
    title: '',
    department: '',
    location: '',
    workType: '', // remote, office, hybrid
    employmentType: '', // full-time, part-time, contract, etc.
    
    // Job Details
    description: '',
    requirements: '',
    responsibilities: '',
    
    // Compensation & Benefits
    salaryMin: '',
    salaryMax: '',
    currency: 'EUR',
    benefits: [],
    
    // Application Details
    applicationDeadline: '',
    startDate: '',
    
    // Additional Info
    experienceLevel: '',
    skills: '',
    tags: []
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Step 2: Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      // Handle benefits checkboxes
      setJobData(prev => ({
        ...prev,
        [name]: checked 
          ? [...prev[name], value]
          : prev[name].filter(item => item !== value)
      }));
    } else {
      setJobData(prev => ({
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

  // Step 3: Validation
  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!jobData.title.trim()) newErrors.title = 'Job title is required';
        if (!jobData.location.trim()) newErrors.location = 'Location is required';
        if (!jobData.workType) newErrors.workType = 'Work type is required';
        if (!jobData.employmentType) newErrors.employmentType = 'Employment type is required';
        break;
      
      case 2:
        if (!jobData.description.trim()) newErrors.description = 'Job description is required';
        if (!jobData.requirements.trim()) newErrors.requirements = 'Requirements are required';
        if (!jobData.responsibilities.trim()) newErrors.responsibilities = 'Responsibilities are required';
        break;
      
      case 3:
        if (!jobData.experienceLevel) newErrors.experienceLevel = 'Experience level is required';
        if (!jobData.applicationDeadline) newErrors.applicationDeadline = 'Application deadline is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 4: Navigation
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Step 5: Submit job posting
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Job posting data:', {
        ...jobData,
        companyInfo: userInfo,
        createdAt: new Date().toISOString()
      });
      
      setIsLoading(false);
      alert('Job posted successfully!');
      onBack(); // Go back to dashboard
    }, 2000);
  };

  // Step 6: Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="postjob-step-content">
            <div className="postjob-step-header">
              <h3>Basic Job Information</h3>
              <p>Tell us about the position you're hiring for</p>
            </div>

            {/* Job Title */}
            <div className="postjob-form-group">
              <label htmlFor="title">Job Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={jobData.title}
                onChange={handleChange}
                className={`postjob-form-input ${errors.title ? 'error' : ''}`}
                placeholder="e.g. Senior Frontend Developer"
              />
              {errors.title && <div className="postjob-error-text">{errors.title}</div>}
            </div>

            {/* Department */}
            <div className="postjob-form-group">
              <label htmlFor="department">Department</label>
              <input
                type="text"
                id="department"
                name="department"
                value={jobData.department}
                onChange={handleChange}
                className="postjob-form-input"
                placeholder="e.g. Engineering, Marketing, Sales"
              />
            </div>

            {/* Location and Work Type Row */}
            <div className="postjob-form-row">
              <div className="postjob-form-group">
                <label htmlFor="location">Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={jobData.location}
                  onChange={handleChange}
                  className={`postjob-form-input ${errors.location ? 'error' : ''}`}
                  placeholder="Athens, Greece"
                />
                {errors.location && <div className="postjob-error-text">{errors.location}</div>}
              </div>

              <div className="postjob-form-group">
                <label htmlFor="workType">Work Type *</label>
                <select
                  id="workType"
                  name="workType"
                  value={jobData.workType}
                  onChange={handleChange}
                  className={`postjob-form-input ${errors.workType ? 'error' : ''}`}
                >
                  <option value="">Select work type</option>
                  <option value="remote">Remote</option>
                  <option value="office">On-site</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                {errors.workType && <div className="postjob-error-text">{errors.workType}</div>}
              </div>
            </div>

            {/* Employment Type */}
            <div className="postjob-form-group">
              <label htmlFor="employmentType">Employment Type *</label>
              <select
                id="employmentType"
                name="employmentType"
                value={jobData.employmentType}
                onChange={handleChange}
                className={`postjob-form-input ${errors.employmentType ? 'error' : ''}`}
              >
                <option value="">Select employment type</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
                <option value="internship">Internship</option>
              </select>
              {errors.employmentType && <div className="postjob-error-text">{errors.employmentType}</div>}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="postjob-step-content">
            <div className="postjob-step-header">
              <h3>Job Description & Requirements</h3>
              <p>Provide detailed information about the role</p>
            </div>

            {/* Job Description */}
            <div className="postjob-form-group">
              <label htmlFor="description">Job Description *</label>
              <textarea
                id="description"
                name="description"
                value={jobData.description}
                onChange={handleChange}
                className={`postjob-form-input ${errors.description ? 'error' : ''}`}
                placeholder="Describe the role, what the candidate will do, company culture, etc..."
                rows="6"
              />
              {errors.description && <div className="postjob-error-text">{errors.description}</div>}
            </div>

            {/* Requirements */}
            <div className="postjob-form-group">
              <label htmlFor="requirements">Requirements *</label>
              <textarea
                id="requirements"
                name="requirements"
                value={jobData.requirements}
                onChange={handleChange}
                className={`postjob-form-input ${errors.requirements ? 'error' : ''}`}
                placeholder="List the required skills, experience, education, etc..."
                rows="5"
              />
              <div className="postjob-field-hint">List each requirement on a new line</div>
              {errors.requirements && <div className="postjob-error-text">{errors.requirements}</div>}
            </div>

            {/* Responsibilities */}
            <div className="postjob-form-group">
              <label htmlFor="responsibilities">Key Responsibilities *</label>
              <textarea
                id="responsibilities"
                name="responsibilities"
                value={jobData.responsibilities}
                onChange={handleChange}
                className={`postjob-form-input ${errors.responsibilities ? 'error' : ''}`}
                placeholder="What will the person be responsible for? Main duties and tasks..."
                rows="5"
              />
              <div className="postjob-field-hint">List each responsibility on a new line</div>
              {errors.responsibilities && <div className="postjob-error-text">{errors.responsibilities}</div>}
            </div>

            {/* Skills */}
            <div className="postjob-form-group">
              <label htmlFor="skills">Required Skills & Technologies</label>
              <textarea
                id="skills"
                name="skills"
                value={jobData.skills}
                onChange={handleChange}
                className="postjob-form-input"
                placeholder="e.g. JavaScript, React, Node.js, MongoDB, Git..."
                rows="3"
              />
              <div className="postjob-field-hint">Separate skills with commas</div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="postjob-step-content">
            <div className="postjob-step-header">
              <h3>Compensation & Details</h3>
              <p>Finalize your job posting with salary and application details</p>
            </div>

            {/* Experience Level */}
            <div className="postjob-form-group">
              <label htmlFor="experienceLevel">Experience Level *</label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={jobData.experienceLevel}
                onChange={handleChange}
                className={`postjob-form-input ${errors.experienceLevel ? 'error' : ''}`}
              >
                <option value="">Select experience level</option>
                <option value="entry">Entry Level (0-2 years)</option>
                <option value="mid">Mid Level (2-5 years)</option>
                <option value="senior">Senior Level (5-10 years)</option>
                <option value="lead">Lead/Principal (10+ years)</option>
                <option value="executive">Executive/C-Level</option>
              </select>
              {errors.experienceLevel && <div className="postjob-error-text">{errors.experienceLevel}</div>}
            </div>

            {/* Salary Range */}
            <div className="postjob-form-row">
              <div className="postjob-form-group">
                <label htmlFor="salaryMin">Minimum Salary (€/year)</label>
                <input
                  type="number"
                  id="salaryMin"
                  name="salaryMin"
                  value={jobData.salaryMin}
                  onChange={handleChange}
                  className="postjob-form-input"
                  placeholder="e.g. 30000"
                />
              </div>

              <div className="postjob-form-group">
                <label htmlFor="salaryMax">Maximum Salary (€/year)</label>
                <input
                  type="number"
                  id="salaryMax"
                  name="salaryMax"
                  value={jobData.salaryMax}
                  onChange={handleChange}
                  className="postjob-form-input"
                  placeholder="e.g. 50000"
                />
              </div>
            </div>

            {/* Benefits */}
            <div className="postjob-form-group">
              <label>Benefits & Perks</label>
              <div className="postjob-checkbox-group">
                {[
                  'Health Insurance',
                  'Dental Insurance',
                  'Paid Time Off',
                  'Remote Work',
                  'Flexible Hours',
                  'Professional Development',
                  'Gym Membership',
                  'Free Meals'
                ].map(benefit => (
                  <label key={benefit} className="postjob-checkbox-option">
                    <input
                      type="checkbox"
                      name="benefits"
                      value={benefit}
                      checked={jobData.benefits.includes(benefit)}
                      onChange={handleChange}
                    />
                    <span>{benefit}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Application Deadline */}
            <div className="postjob-form-row">
              <div className="postjob-form-group">
                <label htmlFor="applicationDeadline">Application Deadline *</label>
                <input
                  type="date"
                  id="applicationDeadline"
                  name="applicationDeadline"
                  value={jobData.applicationDeadline}
                  onChange={handleChange}
                  className={`postjob-form-input ${errors.applicationDeadline ? 'error' : ''}`}
                />
                {errors.applicationDeadline && <div className="postjob-error-text">{errors.applicationDeadline}</div>}
              </div>

              <div className="postjob-form-group">
                <label htmlFor="startDate">Expected Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={jobData.startDate}
                  onChange={handleChange}
                  className="postjob-form-input"
                />
              </div>
            </div>
          </div>
        );

      default:
        return <div>Step {currentStep} content</div>;
    }
  };

  return (
    <div className="postjob-dashboard-container">
      <div className="postjob-dashboard-card">
        
        {/* Header */}
        <div className="postjob-header">
          <button onClick={onBack} className="postjob-back-btn">
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <div className="postjob-header-text">
            <h1>Post a New Job</h1>
            <p>Create a compelling job posting to attract the best candidates</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="postjob-progress-container">
          <div className="postjob-progress-bar">
            <div 
              className="postjob-progress-fill"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
          <div className="postjob-progress-text">
            Step {currentStep} of {totalSteps}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={currentStep === totalSteps ? handleSubmit : undefined}>
          {renderStepContent()}

          {/* Navigation */}
          <div className="postjob-form-navigation">
            {currentStep > 1 && (
              <button 
                type="button" 
                onClick={handlePrevious}
                className="btn btn-outline postjob-nav-btn"
              >
                Previous
              </button>
            )}
            
            {currentStep < totalSteps ? (
              <button 
                type="button" 
                onClick={handleNext}
                className="btn btn-primary postjob-nav-btn"
              >
                Next
              </button>
            ) : (
              <button 
                type="submit" 
                className="btn btn-primary postjob-nav-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Posting Job...' : 'Post Job'}
              </button>
            )}
          </div>
        </form>

      </div>
    </div>
  );
}

export default PostJobForm;