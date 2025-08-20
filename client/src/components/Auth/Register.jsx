// Register.jsx - Register Component

// Step 1: Import React hooks
import { useState } from 'react';
import './Register.css';

// Step 2: Create the Register component
function Register({ onRegistrationSuccess, onSwitchToLogin }) {
  // Step 3: Create state for form data (simplified)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    userType: 'jobseeker'  // jobseeker or employer
  });

  // Step 4: Create state for loading and errors
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Step 5: Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Step 6: Validate form data (simplified)
  const validateForm = () => {
    const newErrors = {};

    // Check first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Check last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Check email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is not valid';
    }

    // Check password
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 7: Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form first
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Simulate registration process
    console.log('Registration attempt:', formData);
    
    // Reset loading after 2 seconds (simulation)
    setTimeout(() => {
      setIsLoading(false);
      // Call the success callback with form data
      onRegistrationSuccess(formData);
    }, 2000);
  };

  // Step 8: Render the component
  return (
    <div className="register-container">
      <div className="register-card">
        
        {/* Header */}
        <div className="register-header">
          <h1>Create Account</h1>
          <p>Join our job board platform</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="register-form">
          
          {/* User Type Selection */}
          <div className="form-group">
            <label>I am a</label>
            <div className="user-type-selector">
              <label className="radio-option">
                <input
                  type="radio"
                  name="userType"
                  value="jobseeker"
                  checked={formData.userType === 'jobseeker'}
                  onChange={handleChange}
                />
                <span>Job Seeker</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="userType"
                  value="employer"
                  checked={formData.userType === 'employer'}
                  onChange={handleChange}
                />
                <span>Employer</span>
              </label>
            </div>
          </div>

          {/* Name Fields Row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`form-input ${errors.firstName ? 'error' : ''}`}
                placeholder="First name"
              />
              {errors.firstName && (
                <div className="error-text">{errors.firstName}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`form-input ${errors.lastName ? 'error' : ''}`}
                placeholder="Last name"
              />
              {errors.lastName && (
                <div className="error-text">{errors.lastName}</div>
              )}
            </div>
          </div>

          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <div className="error-text">{errors.email}</div>
            )}
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Create a password (min 6 characters)"
            />
            {errors.password && (
              <div className="error-text">{errors.password}</div>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn btn-primary register-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Footer */}
        <div className="register-footer">
          <p>
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="link-btn"
              disabled={isLoading}
            >
              Sign in
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Register;