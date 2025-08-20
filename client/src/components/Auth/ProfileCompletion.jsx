// ProfileCompletion.jsx - Profile completion prompt after registration

import { useState } from 'react';
import { CheckCircle, Target, Zap, Eye, Search, FileText, BarChart3 } from 'lucide-react';
import './ProfileCompletion.css';

function ProfileCompletion({ userInfo, onCompleteProfile, onSkip }) {
  const [showForm, setShowForm] = useState(false);

  const isJobSeeker = userInfo.userType === 'jobseeker';

  const handleCompleteProfile = () => {
    setShowForm(true);
    onCompleteProfile();
  };

  const handleSkipForNow = () => {
    onSkip();
  };

  return (
    <div className="completion-container">
      <div className="completion-card">
        
        {/* Welcome Message */}
        <div className="completion-header">
          <div className="success-icon">
            <CheckCircle size={64} color="var(--medium-blue)" />
          </div>
          <h1>Welcome, {userInfo.firstName}!</h1>
          <p className="success-message">
            Your account has been created successfully as a {isJobSeeker ? 'Job Seeker' : 'Employer'}.
          </p>
        </div>

        {/* Profile Completion Prompt */}
        <div className="completion-content">
          <div className="completion-benefits">
            <h3>Complete your profile to get better matches</h3>
            
            {isJobSeeker ? (
              // Job Seeker Benefits
              <div className="benefits-list">
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <Target size={32} color="var(--medium-blue)" />
                  </div>
                  <div>
                    <strong>Better Job Matches</strong>
                    <p>Get jobs that match your skills and preferences</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <Zap size={32} color="var(--medium-blue)" />
                  </div>
                  <div>
                    <strong>Faster Applications</strong>
                    <p>Apply to jobs with one click using your complete profile</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <Eye size={32} color="var(--medium-blue)" />
                  </div>
                  <div>
                    <strong>Stand Out</strong>
                    <p>Employers can find you based on your detailed profile</p>
                  </div>
                </div>
              </div>
            ) : (
              // Employer Benefits
              <div className="benefits-list">
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <Search size={32} color="var(--medium-blue)" />
                  </div>
                  <div>
                    <strong>Find Better Candidates</strong>
                    <p>Our algorithm matches you with qualified candidates</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <FileText size={32} color="var(--medium-blue)" />
                  </div>
                  <div>
                    <strong>Easy Job Posting</strong>
                    <p>Post jobs quickly with your company information</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-icon">
                    <BarChart3 size={32} color="var(--medium-blue)" />
                  </div>
                  <div>
                    <strong>Analytics</strong>
                    <p>Track your job postings and candidate applications</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="completion-actions">
          <button 
            onClick={handleCompleteProfile}
            className="btn btn-primary complete-btn"
          >
            Complete My Profile
          </button>
          
          <button 
            onClick={handleSkipForNow}
            className="btn-skip"
          >
            Skip for now
          </button>
        </div>

        {/* Additional Info */}
        <div className="completion-footer">
          <p>
            Don't worry! You can always complete your profile later from your dashboard.
          </p>
        </div>

      </div>
    </div>
  );
}

export default ProfileCompletion;