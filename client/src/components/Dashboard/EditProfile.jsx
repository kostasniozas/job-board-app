// EditProfile.jsx - UPDATED for Visual Consistency with JobSeeker Dashboard

import { useState } from 'react';
import { User, Save, Camera } from 'lucide-react';
import './EditProfile.css';

function EditProfile({ userInfo }) {
  // Step 1: ALL STATE PRESERVED EXACTLY
  const [profileData, setProfileData] = useState({
    // Personal Info
    firstName: userInfo?.firstName || '',
    lastName: userInfo?.lastName || '',
    email: userInfo?.email || '',
    phone: '',
    
    // Company Info (for employers)
    companyName: '',
    companySize: '',
    industry: '',
    website: '',
    location: '',
    description: '',
    
    // Account Settings
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('personal');

  // Step 2: ALL HANDLER FUNCTIONS PRESERVED EXACTLY
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Step 3: ALL VALIDATION LOGIC PRESERVED EXACTLY
  const validateForm = () => {
    const newErrors = {};
    
    if (activeTab === 'personal') {
      if (!profileData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!profileData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!profileData.email.trim()) newErrors.email = 'Email is required';
    }
    
    if (activeTab === 'password') {
      if (profileData.newPassword && profileData.newPassword.length < 6) {
        newErrors.newPassword = 'Password must be at least 6 characters';
      }
      if (profileData.newPassword !== profileData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 4: FORM SUBMISSION LOGIC PRESERVED EXACTLY
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Profile updated:', profileData);
      setIsLoading(false);
      alert('Profile updated successfully!');
    }, 1500);
  };

  // Step 5: MAIN RENDER - UPDATED HEADER ONLY, EVERYTHING ELSE PRESERVED
  return (
    <div className="editprofile-container">
      {/* ✅ UPDATED: Header with gradient background like other components */}
      <div className="editprofile-header">
        <div className="editprofile-header-content">
          <h1>Edit Profile</h1>
          <p>Update your account information and settings</p>
        </div>
      </div>

      {/* ✅ PRESERVED: Profile Avatar Section exactly as before */}
      <div className="editprofile-avatar-section">
        <div className="editprofile-avatar">
          {profileData.firstName ? profileData.firstName.charAt(0) : <User size={32} />}
        </div>
        <div className="editprofile-avatar-info">
          <h3>{profileData.firstName} {profileData.lastName}</h3>
          <p>{profileData.email}</p>
          <button className="editprofile-btn-outline">
            <Camera size={16} />
            Change Photo
          </button>
        </div>
      </div>

      {/* ✅ PRESERVED: Tabs exactly as before */}
      <div className="editprofile-tabs">
        <button 
          className={`editprofile-tab ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          Personal Info
        </button>
        <button 
          className={`editprofile-tab ${activeTab === 'company' ? 'active' : ''}`}
          onClick={() => setActiveTab('company')}
        >
          Company Info
        </button>
        <button 
          className={`editprofile-tab ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          Password
        </button>
      </div>

      {/* ✅ PRESERVED: Form Content exactly as before */}
      <form onSubmit={handleSubmit} className="editprofile-form">
        
        {/* Personal Info Tab */}
        {activeTab === 'personal' && (
          <div className="editprofile-tab-content">
            <div className="editprofile-form-row">
              <div className="editprofile-form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleChange}
                  className={`editprofile-input ${errors.firstName ? 'error' : ''}`}
                />
                {errors.firstName && <span className="editprofile-error">{errors.firstName}</span>}
              </div>
              
              <div className="editprofile-form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleChange}
                  className={`editprofile-input ${errors.lastName ? 'error' : ''}`}
                />
                {errors.lastName && <span className="editprofile-error">{errors.lastName}</span>}
              </div>
            </div>

            <div className="editprofile-form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                className={`editprofile-input ${errors.email ? 'error' : ''}`}
              />
              {errors.email && <span className="editprofile-error">{errors.email}</span>}
            </div>

            <div className="editprofile-form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleChange}
                className="editprofile-input"
                placeholder="+30 123 456 7890"
              />
            </div>
          </div>
        )}

        {/* Company Info Tab */}
        {activeTab === 'company' && (
          <div className="editprofile-tab-content">
            <div className="editprofile-form-group">
              <label>Company Name</label>
              <input
                type="text"
                name="companyName"
                value={profileData.companyName}
                onChange={handleChange}
                className="editprofile-input"
                placeholder="Your Company Name"
              />
            </div>

            <div className="editprofile-form-row">
              <div className="editprofile-form-group">
                <label>Company Size</label>
                <select
                  name="companySize"
                  value={profileData.companySize}
                  onChange={handleChange}
                  className="editprofile-input"
                >
                  <option value="">Select size</option>
                  <option value="startup">Startup (1-10)</option>
                  <option value="small">Small (11-50)</option>
                  <option value="medium">Medium (51-200)</option>
                  <option value="large">Large (201-1000)</option>
                  <option value="enterprise">Enterprise (1000+)</option>
                </select>
              </div>

              <div className="editprofile-form-group">
                <label>Industry</label>
                <select
                  name="industry"
                  value={profileData.industry}
                  onChange={handleChange}
                  className="editprofile-input"
                >
                  <option value="">Select industry</option>
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="marketing">Marketing</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="editprofile-form-row">
              <div className="editprofile-form-group">
                <label>Website</label>
                <input
                  type="url"
                  name="website"
                  value={profileData.website}
                  onChange={handleChange}
                  className="editprofile-input"
                  placeholder="https://yourcompany.com"
                />
              </div>

              <div className="editprofile-form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={profileData.location}
                  onChange={handleChange}
                  className="editprofile-input"
                  placeholder="Athens, Greece"
                />
              </div>
            </div>

            <div className="editprofile-form-group">
              <label>Company Description</label>
              <textarea
                name="description"
                value={profileData.description}
                onChange={handleChange}
                className="editprofile-input"
                rows="4"
                placeholder="Tell us about your company..."
              />
            </div>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="editprofile-tab-content">
            <div className="editprofile-form-group">
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={profileData.currentPassword}
                onChange={handleChange}
                className="editprofile-input"
                placeholder="Enter current password"
              />
            </div>

            <div className="editprofile-form-group">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={profileData.newPassword}
                onChange={handleChange}
                className={`editprofile-input ${errors.newPassword ? 'error' : ''}`}
                placeholder="Enter new password"
              />
              {errors.newPassword && <span className="editprofile-error">{errors.newPassword}</span>}
            </div>

            <div className="editprofile-form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={profileData.confirmPassword}
                onChange={handleChange}
                className={`editprofile-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Confirm new password"
              />
              {errors.confirmPassword && <span className="editprofile-error">{errors.confirmPassword}</span>}
            </div>

            <div className="editprofile-password-note">
              <p>Password must be at least 6 characters long</p>
            </div>
          </div>
        )}

        {/* ✅ PRESERVED: Submit Button exactly as before */}
        <div className="editprofile-form-footer">
          <button 
            type="submit" 
            className="editprofile-btn-primary"
            disabled={isLoading}
          >
            <Save size={16} />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;