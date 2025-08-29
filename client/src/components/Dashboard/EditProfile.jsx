// EditProfile.jsx - Real Backend Integration

import { useState, useEffect } from 'react';
import { User, Save, Camera, RefreshCw, AlertCircle } from 'lucide-react';
import { authAPI } from '../../services/api';
import './EditProfile.css';

function EditProfile({ userInfo, onProfileUpdate }) {
  // Real data states
  const [profileData, setProfileData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
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
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('personal');
  const [successMessage, setSuccessMessage] = useState('');
  const [loadError, setLoadError] = useState('');

  // Load user data from backend
  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      setLoadError('');
      console.log('Loading user profile from backend...');
      
      const response = await authAPI.getCurrentUser(); // We need to create this
      console.log('User profile response:', response);
      
      if (response.success) {
        const user = response.user;
        setProfileData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phone || '',
          companyName: user.profile?.companyName || '',
          companySize: user.profile?.companySize || '',
          industry: user.profile?.industry || '',
          website: user.profile?.website || '',
          location: user.profile?.location || '',
          description: user.profile?.description || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setLoadError(response.message || 'Failed to load profile');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setLoadError('Failed to load profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize with userInfo prop if available
  useEffect(() => {
    if (userInfo) {
      setProfileData({
        firstName: userInfo.firstName || '',
        lastName: userInfo.lastName || '',
        email: userInfo.email || '',
        phone: userInfo.phone || '',
        companyName: userInfo.profile?.companyName || '',
        companySize: userInfo.profile?.companySize || '',
        industry: userInfo.profile?.industry || '',
        website: userInfo.profile?.website || '',
        location: userInfo.profile?.location || '',
        description: userInfo.profile?.description || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } else {
      loadUserProfile();
    }
  }, [userInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear success message when editing
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (activeTab === 'personal') {
      if (!profileData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!profileData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!profileData.email.trim()) newErrors.email = 'Email is required';
      
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (profileData.email && !emailRegex.test(profileData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      
      // Phone validation (if provided)
      if (profileData.phone && profileData.phone.length < 10) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }
    
    if (activeTab === 'company') {
      // Company validations are optional for most fields
      if (profileData.website && !profileData.website.startsWith('http')) {
        newErrors.website = 'Website must start with http:// or https://';
      }
    }
    
    if (activeTab === 'password') {
      if (profileData.newPassword || profileData.currentPassword || profileData.confirmPassword) {
        if (!profileData.currentPassword.trim()) {
          newErrors.currentPassword = 'Current password is required to change password';
        }
        if (!profileData.newPassword.trim()) {
          newErrors.newPassword = 'New password is required';
        }
        if (profileData.newPassword && profileData.newPassword.length < 6) {
          newErrors.newPassword = 'Password must be at least 6 characters';
        }
        if (profileData.newPassword !== profileData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSaving(true);
    setErrors({});
    setSuccessMessage('');
    
    try {
      let updateData = {};
      
      if (activeTab === 'personal') {
        updateData = {
          firstName: profileData.firstName.trim(),
          lastName: profileData.lastName.trim(),
          email: profileData.email.trim(),
          phone: profileData.phone.trim()
        };
      } else if (activeTab === 'company') {
        updateData = {
          profile: {
            companyName: profileData.companyName.trim(),
            companySize: profileData.companySize,
            industry: profileData.industry,
            website: profileData.website.trim(),
            location: profileData.location.trim(),
            description: profileData.description.trim()
          }
        };
      } else if (activeTab === 'password') {
        updateData = {
          currentPassword: profileData.currentPassword,
          newPassword: profileData.newPassword
        };
      }
      
      console.log('Updating profile with data:', updateData);
      
      // We need to create this API endpoint
      const response = await authAPI.updateProfile(updateData);
      
      if (response.success) {
        setSuccessMessage('Profile updated successfully!');
        
        // Clear password fields after successful password change
        if (activeTab === 'password') {
          setProfileData(prev => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          }));
        }
        
        // Call onProfileUpdate callback if provided (to refresh parent component)
        if (onProfileUpdate) {
          onProfileUpdate(response.user);
        }
        
        console.log('Profile updated successfully');
      } else {
        setErrors({ submit: response.message || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ submit: error.message || 'Failed to update profile. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="editprofile-container">
        <div className="editprofile-loading">
          <RefreshCw size={24} className="spinning" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (loadError) {
    return (
      <div className="editprofile-container">
        <div className="editprofile-error">
          <AlertCircle size={24} />
          <span>{loadError}</span>
          <button onClick={loadUserProfile} className="btn btn-outline">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="editprofile-container">
      {/* Header */}
      <div className="editprofile-header">
        <div className="editprofile-header-content">
          <h1>Edit Profile</h1>
          <p>Update your account information and settings</p>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="editprofile-success-message">
          <span>{successMessage}</span>
        </div>
      )}

      {/* General Error Message */}
      {errors.submit && (
        <div className="editprofile-error-message">
          <AlertCircle size={16} />
          <span>{errors.submit}</span>
        </div>
      )}

      {/* Profile Avatar Section */}
      <div className="editprofile-avatar-section">
        <div className="editprofile-avatar">
          {profileData.firstName ? profileData.firstName.charAt(0).toUpperCase() : <User size={32} />}
        </div>
        <div className="editprofile-avatar-info">
          <h3>{profileData.firstName} {profileData.lastName}</h3>
          <p>{profileData.email}</p>
          <button className="editprofile-btn-outline" disabled>
            <Camera size={16} />
            Change Photo (Coming Soon)
          </button>
        </div>
      </div>

      {/* Tabs */}
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

      {/* Form Content */}
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
                  disabled={isSaving}
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
                  disabled={isSaving}
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
                disabled={isSaving}
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
                className={`editprofile-input ${errors.phone ? 'error' : ''}`}
                placeholder="+30 123 456 7890"
                disabled={isSaving}
              />
              {errors.phone && <span className="editprofile-error">{errors.phone}</span>}
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
                disabled={isSaving}
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
                  disabled={isSaving}
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
                  disabled={isSaving}
                >
                  <option value="">Select industry</option>
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="marketing">Marketing</option>
                  <option value="retail">Retail</option>
                  <option value="manufacturing">Manufacturing</option>
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
                  className={`editprofile-input ${errors.website ? 'error' : ''}`}
                  placeholder="https://yourcompany.com"
                  disabled={isSaving}
                />
                {errors.website && <span className="editprofile-error">{errors.website}</span>}
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
                  disabled={isSaving}
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
                disabled={isSaving}
              />
            </div>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="editprofile-tab-content">
            <div className="editprofile-form-group">
              <label>Current Password *</label>
              <input
                type="password"
                name="currentPassword"
                value={profileData.currentPassword}
                onChange={handleChange}
                className={`editprofile-input ${errors.currentPassword ? 'error' : ''}`}
                placeholder="Enter current password"
                disabled={isSaving}
              />
              {errors.currentPassword && <span className="editprofile-error">{errors.currentPassword}</span>}
            </div>

            <div className="editprofile-form-group">
              <label>New Password *</label>
              <input
                type="password"
                name="newPassword"
                value={profileData.newPassword}
                onChange={handleChange}
                className={`editprofile-input ${errors.newPassword ? 'error' : ''}`}
                placeholder="Enter new password"
                disabled={isSaving}
              />
              {errors.newPassword && <span className="editprofile-error">{errors.newPassword}</span>}
            </div>

            <div className="editprofile-form-group">
              <label>Confirm New Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={profileData.confirmPassword}
                onChange={handleChange}
                className={`editprofile-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Confirm new password"
                disabled={isSaving}
              />
              {errors.confirmPassword && <span className="editprofile-error">{errors.confirmPassword}</span>}
            </div>

            <div className="editprofile-password-note">
              <p>Password must be at least 6 characters long</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="editprofile-form-footer">
          <button 
            type="submit" 
            className="editprofile-btn-primary"
            disabled={isSaving}
          >
            {isSaving ? <RefreshCw size={16} className="spinning" /> : <Save size={16} />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfile;