// AuthContainer.jsx - Main Authentication Flow Container

import { useState } from 'react';
import Login from './Login';
import Register from './Register';
import ProfileCompletion from './ProfileCompletion';
import JobSeekerProfile from './JobSeekerProfile';
import EmployerProfile from './EmployerProfile';
import EmployerDashboard from '../Dashboard/EmployerDashboard';
import JobSeekerDashboard from '../Dashboard/JobSeekerDashboard';

function AuthContainer() {
  // Main application state
  const [currentView, setCurrentView] = useState('login');
  const [userInfo, setUserInfo] = useState(null);

  // FIXED: Handle login with real backend data
  const handleLogin = (loginData) => {
    console.log('Login successful:', loginData);
    
    // Use real data from backend instead of mock data
    setUserInfo(loginData);
    
    // Navigate to appropriate dashboard based on real userType
    if (loginData.userType === 'employer') {
      setCurrentView('employer-dashboard');
    } else {
      setCurrentView('jobseeker-dashboard');
    }
  };

  // Handle registration completion
  const handleRegistrationComplete = (registrationData) => {
    console.log('Registration successful:', registrationData);
    setUserInfo(registrationData);
    setCurrentView('profile-completion');
  };

  // Handle profile completion choice
  const handleCompleteProfile = () => {
    if (userInfo.userType === 'employer') {
      setCurrentView('employer-profile');
    } else {
      setCurrentView('job-seeker-profile');
    }
  };

  const handleSkipProfile = () => {
    if (userInfo.userType === 'employer') {
      setCurrentView('employer-dashboard');
    } else {
      setCurrentView('jobseeker-dashboard');
    }
  };

  // Handle profile form completion
  const handleProfileFormComplete = (profileData) => {
    console.log('Profile completed:', profileData);
    setUserInfo(profileData);
    
    if (profileData.userType === 'employer') {
      setCurrentView('employer-dashboard');
    } else {
      setCurrentView('jobseeker-dashboard');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setUserInfo(null);
    setCurrentView('login');
  };

  // Navigation functions
  const goToLogin = () => {
    console.log('goToLogin called');
    setCurrentView('login');
  };
  
  const goToRegister = () => {
    console.log('goToRegister called');
    setCurrentView('register');
  };
  
  const goBackToProfileCompletion = () => setCurrentView('profile-completion');

  // Render current view
  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        console.log('Rendering Login component with callbacks:', { onLoginSuccess: !!handleLogin, onSwitchToRegister: !!goToRegister });
        return (
          <Login 
            onLoginSuccess={handleLogin}
            onSwitchToRegister={goToRegister}
          />
        );

      case 'register':
        return (
          <Register 
            onRegistrationSuccess={handleRegistrationComplete}
            onSwitchToLogin={goToLogin}
          />
        );

      case 'profile-completion':
        return (
          <ProfileCompletion 
            userInfo={userInfo}
            onCompleteProfile={handleCompleteProfile}
            onSkip={handleSkipProfile}
          />
        );

      case 'job-seeker-profile':
        return (
          <JobSeekerProfile 
            userBasicInfo={userInfo}
            onComplete={handleProfileFormComplete}
            onBack={goBackToProfileCompletion}
          />
        );

      case 'employer-profile':
        return (
          <EmployerProfile 
            userBasicInfo={userInfo}
            onComplete={handleProfileFormComplete}
            onBack={goBackToProfileCompletion}
          />
        );

      case 'employer-dashboard':
        return (
          <EmployerDashboard 
            userInfo={userInfo}
            onLogout={handleLogout}
          />
        );

      case 'jobseeker-dashboard':
        return (
          <JobSeekerDashboard 
            userInfo={userInfo}
            onLogout={handleLogout}
          />
        );

      default:
        return (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            fontSize: '18px',
            color: 'var(--gray)'
          }}>
            Unknown view: {currentView}
          </div>
        );
    }
  };

  return (
    <div className="auth-container">
      {renderCurrentView()}
    </div>
  );
}

export default AuthContainer;