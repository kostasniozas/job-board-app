// Login.jsx - Login Component με Real API Integration και Fixed Error Handling

import { useState } from 'react';
import { authAPI } from '../../services/api';
import './Login.css';

const Login = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({}); // Clear all previous errors

    try {
      console.log('Login attempt:', formData);
      
      // Call the real backend API
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password
      });

      console.log('Login successful:', response);
      
      // Call success callback με τα user data από το backend
      if (onLoginSuccess) {
        onLoginSuccess({
          ...response.user,
          email: formData.email
        });
      }
      
    } catch (error) {
      console.error('Login error:', error);
      
      // ΔΙΟΡΘΩΣΗ: Απλοποιημένο error handling που θα εμφανίζει το message
      setErrors({ 
        general: error.message || 'Login failed. Please try again.' 
      });
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpClick = () => {
    if (onSwitchToRegister) {
      onSwitchToRegister();
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        
        <div className="login-header">
          <h1>Login</h1>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {/* ΔΙΟΡΘΩΣΗ: Σιγουρευόμαστε ότι το error εμφανίζεται */}
          {errors.general && (
            <div className="error-message" style={{ 
              backgroundColor: '#fee2e2', 
              color: '#dc2626', 
              padding: '12px', 
              borderRadius: '6px', 
              marginBottom: '16px',
              border: '1px solid #fecaca'
            }}>
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
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
              <div className="form-error">
                {errors.email}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Enter your password"
              disabled={isLoading}
            />
            {errors.password && (
              <div className="form-error">
                {errors.password}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account?
          </p>
          <button
            type="button"
            onClick={handleSignUpClick}
            className="signup-button"
            disabled={isLoading}
          >
            Sign up
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;