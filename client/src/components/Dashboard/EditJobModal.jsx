// EditJobModal.jsx - Edit Job Modal Component

import { useState, useEffect } from 'react';
import { X, Save, MapPin, DollarSign, Calendar, Users } from 'lucide-react';
import './EditJobModal.css';

function EditJobModal({ job, isOpen, onClose, onSave, userInfo }) {
  // Initialize form data with job data
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    workType: '',
    employmentType: '',
    description: '',
    requirements: '',
    responsibilities: '',
    salaryMin: '',
    salaryMax: '',
    experienceLevel: '',
    skills: '',
    benefits: [],
    applicationDeadline: '',
    startDate: '',
    status: 'active'
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  // Populate form when job data changes
  useEffect(() => {
    if (job && isOpen) {
      setFormData({
        title: job.title || '',
        department: job.department || '',
        location: job.location || '',
        workType: job.workType || '',
        employmentType: job.employmentType || '',
        description: job.description || '',
        requirements: job.requirements || '',
        responsibilities: job.responsibilities || '',
        salaryMin: job.salaryMin || '',
        salaryMax: job.salaryMax || '',
        experienceLevel: job.experienceLevel || '',
        skills: job.skills || '',
        benefits: job.benefits || [],
        applicationDeadline: job.deadline || '',
        startDate: job.startDate || '',
        status: job.status || 'active'
      });
      setActiveTab('basic');
      setErrors({});
    }
  }, [job, isOpen]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked 
          ? [...prev[name], value]
          : prev[name].filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({
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

  // Validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.workType) newErrors.workType = 'Work type is required';
    if (!formData.employmentType) newErrors.employmentType = 'Employment type is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedJob = {
        ...job,
        ...formData,
        deadline: formData.applicationDeadline,
        updatedAt: new Date().toISOString()
      };
      
      onSave(updatedJob);
      setIsLoading(false);
      onClose();
    }, 1500);
  };

  // Handle modal close
  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div className="editjob-tab-content">
            <div className="editjob-form-row">
              <div className="editjob-form-group">
                <label htmlFor="title">Job Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`editjob-form-input ${errors.title ? 'error' : ''}`}
                  placeholder="e.g. Senior Frontend Developer"
                />
                {errors.title && <div className="editjob-error-text">{errors.title}</div>}
              </div>

              <div className="editjob-form-group">
                <label htmlFor="department">Department</label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="editjob-form-input"
                  placeholder="e.g. Engineering"
                />
              </div>
            </div>

            <div className="editjob-form-row">
              <div className="editjob-form-group">
                <label htmlFor="location">Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`editjob-form-input ${errors.location ? 'error' : ''}`}
                  placeholder="Athens, Greece"
                />
                {errors.location && <div className="editjob-error-text">{errors.location}</div>}
              </div>

              <div className="editjob-form-group">
                <label htmlFor="workType">Work Type *</label>
                <select
                  id="workType"
                  name="workType"
                  value={formData.workType}
                  onChange={handleChange}
                  className={`editjob-form-input ${errors.workType ? 'error' : ''}`}
                >
                  <option value="">Select work type</option>
                  <option value="remote">Remote</option>
                  <option value="office">On-site</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                {errors.workType && <div className="editjob-error-text">{errors.workType}</div>}
              </div>
            </div>

            <div className="editjob-form-row">
              <div className="editjob-form-group">
                <label htmlFor="employmentType">Employment Type *</label>
                <select
                  id="employmentType"
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className={`editjob-form-input ${errors.employmentType ? 'error' : ''}`}
                >
                  <option value="">Select employment type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                  <option value="internship">Internship</option>
                </select>
                {errors.employmentType && <div className="editjob-error-text">{errors.employmentType}</div>}
              </div>

              <div className="editjob-form-group">
                <label htmlFor="status">Job Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="editjob-form-input"
                >
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'details':
        return (
          <div className="editjob-tab-content">
            <div className="editjob-form-group">
              <label htmlFor="description">Job Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`editjob-form-input ${errors.description ? 'error' : ''}`}
                rows="5"
                placeholder="Describe the role and responsibilities..."
              />
              {errors.description && <div className="editjob-error-text">{errors.description}</div>}
            </div>

            <div className="editjob-form-group">
              <label htmlFor="requirements">Requirements</label>
              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                className="editjob-form-input"
                rows="4"
                placeholder="List the required skills and qualifications..."
              />
            </div>

            <div className="editjob-form-group">
              <label htmlFor="responsibilities">Key Responsibilities</label>
              <textarea
                id="responsibilities"
                name="responsibilities"
                value={formData.responsibilities}
                onChange={handleChange}
                className="editjob-form-input"
                rows="4"
                placeholder="What will the person be responsible for..."
              />
            </div>

            <div className="editjob-form-group">
              <label htmlFor="skills">Required Skills</label>
              <textarea
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="editjob-form-input"
                rows="3"
                placeholder="JavaScript, React, Node.js..."
              />
            </div>
          </div>
        );

      case 'compensation':
        return (
          <div className="editjob-tab-content">
            <div className="editjob-form-row">
              <div className="editjob-form-group">
                <label htmlFor="salaryMin">Minimum Salary (€/year)</label>
                <input
                  type="number"
                  id="salaryMin"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  className="editjob-form-input"
                  placeholder="30000"
                />
              </div>

              <div className="editjob-form-group">
                <label htmlFor="salaryMax">Maximum Salary (€/year)</label>
                <input
                  type="number"
                  id="salaryMax"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  className="editjob-form-input"
                  placeholder="50000"
                />
              </div>
            </div>

            <div className="editjob-form-group">
              <label htmlFor="experienceLevel">Experience Level</label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="editjob-form-input"
              >
                <option value="">Select experience level</option>
                <option value="entry">Entry Level (0-2 years)</option>
                <option value="mid">Mid Level (2-5 years)</option>
                <option value="senior">Senior Level (5-10 years)</option>
                <option value="lead">Lead/Principal (10+ years)</option>
                <option value="executive">Executive/C-Level</option>
              </select>
            </div>

            <div className="editjob-form-group">
              <label>Benefits & Perks</label>
              <div className="editjob-checkbox-grid">
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
                  <label key={benefit} className="editjob-checkbox-option">
                    <input
                      type="checkbox"
                      name="benefits"
                      value={benefit}
                      checked={formData.benefits.includes(benefit)}
                      onChange={handleChange}
                    />
                    <span>{benefit}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="editjob-form-row">
              <div className="editjob-form-group">
                <label htmlFor="applicationDeadline">Application Deadline</label>
                <input
                  type="date"
                  id="applicationDeadline"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleChange}
                  className="editjob-form-input"
                />
              </div>

              <div className="editjob-form-group">
                <label htmlFor="startDate">Expected Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="editjob-form-input"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="editjob-modal-overlay" onClick={handleClose}>
      <div className="editjob-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="editjob-modal-header">
          <div className="editjob-modal-title">
            <h2>Edit Job</h2>
            <span className="editjob-job-info">
              <MapPin size={16} />
              {job?.title || 'Job Title'}
            </span>
          </div>
          <button 
            onClick={handleClose}
            className="editjob-close-btn"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="editjob-modal-content">
          {/* Tabs */}
          <div className="editjob-modal-tabs">
            <button 
              className={`editjob-modal-tab ${activeTab === 'basic' ? 'editjob-modal-tab-active' : ''}`}
              onClick={() => setActiveTab('basic')}
              type="button"
            >
              Basic Info
            </button>
            <button 
              className={`editjob-modal-tab ${activeTab === 'details' ? 'editjob-modal-tab-active' : ''}`}
              onClick={() => setActiveTab('details')}
              type="button"
            >
              Details
            </button>
            <button 
              className={`editjob-modal-tab ${activeTab === 'compensation' ? 'editjob-modal-tab-active' : ''}`}
              onClick={() => setActiveTab('compensation')}
              type="button"
            >
              Compensation
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="editjob-form">
            {renderTabContent()}
          </form>
        </div>

        {/* Modal Footer */}
        <div className="editjob-modal-footer">
          <button 
            type="button"
            onClick={handleClose}
            className="editjob-btn editjob-btn-outline"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            type="submit"
            onClick={handleSubmit}
            className="editjob-btn editjob-btn-primary"
            disabled={isLoading}
          >
            <Save size={16} />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditJobModal;