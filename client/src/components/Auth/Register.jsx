// Register.jsx - Register Component με Real API Integration

import { useState } from 'react';
import { authAPI } from '../../services/api';
import './Register.css';

function Register({ onRegistrationSuccess, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    userType: 'jobSeeker'  // Σωστό format για backend
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is not valid';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ΑΛΛΑΓΗ ΕΔΩ: Real API call αντί για mock
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({}); // Clear any previous errors

    try {
      console.log('Registration attempt:', formData);
      
      // Καλούμε το πραγματικό backend API
      const response = await authAPI.register({
        email: formData.email,
        password: formData.password,
        userType: formData.userType,
        firstName: formData.firstName,
        lastName: formData.lastName
      });

      console.log('Registration successful:', response);
      
      // Call success callback
      onRegistrationSuccess({
        ...formData,
        ...response.user
      });

    } catch (error) {
      console.error('Registration failed:', error);
      
      // Handle errors from backend
      if (error.message.includes('email')) {
        setErrors({ email: 'Email already exists' });
      } else {
        setErrors({ general: error.message || 'Registration failed' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        
        <div className="register-header">
          <h1>Create Account</h1>
          <p>Join our job board platform</p>
        </div>

        {errors.general && (
          <div className="error-text" style={{ marginBottom: '20px', textAlign: 'center' }}>
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          
          <div className="form-group">
            <label>I am a</label>
            <div className="user-type-selector">
              <label className="radio-option">
                <input
                  type="radio"
                  name="userType"
                  value="jobSeeker"
                  checked={formData.userType === 'jobSeeker'}
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
              {errors.lastName && (
                <div className="error-text">{errors.lastName}</div>
              )}
            </div>
          </div>

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
              disabled={isLoading}
            />
            {errors.email && (
              <div className="error-text">{errors.email}</div>
            )}
          </div>

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
              disabled={isLoading}
            />
            {errors.password && (
              <div className="error-text">{errors.password}</div>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary register-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

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