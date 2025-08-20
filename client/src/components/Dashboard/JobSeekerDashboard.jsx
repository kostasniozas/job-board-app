// JobSeekerDashboard.jsx - Job Seeker Dashboard with Full Integration

import { useState } from 'react';
import { 
  Search, 
  FileText, 
  Heart, 
  User, 
  LogOut,
  TrendingUp,
  Clock,
  CheckCircle,
  Target,
  Zap,
  Star,
  Award,
  Building
} from 'lucide-react';

// Import the new components we created
import FindJobs from './FindJobs';
import MyApplications from './MyApplications';
import SavedJobs from './SavedJobs';
import JobSeekerEditProfile from './JobSeekerEditProfile';

// Import CSS files
import './JobSeekerDashboard.css';
import './FindJobs.css';
import './MyApplications.css';
import './SavedJobs.css';
import './JobSeekerEditProfile.css';

function JobSeekerDashboard({ userInfo, onLogout }) {
  // Step 1: Navigation state
  const [activeSection, setActiveSection] = useState('overview');

  // Step 2: Mock data for dashboard
  const mockStats = {
    applicationsSent: 12,
    jobsViewed: 35,
    savedJobs: 8,
    profileViews: 23
  };

  // Step 3: Navigation items for job seeker
  const navItems = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'find-jobs', label: 'Find Jobs', icon: Search },
    { id: 'my-applications', label: 'My Applications', icon: FileText },
    { id: 'saved-jobs', label: 'Saved Jobs', icon: Heart },
    { id: 'profile', label: 'Edit Profile', icon: User }
  ];

  // Step 4: Handle navigation
  const handleNavigation = (sectionId) => {
    setActiveSection(sectionId);
  };

  // Step 5: Render main content based on active section
  const renderMainContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="main-content">
            <div className="content-header">
              <div>
                <h1>Welcome back, {userInfo?.firstName || 'Job Seeker'}!</h1>
                <p>Your next career opportunity is just around the corner</p>
              </div>
              <button className="btn btn-primary find-jobs-btn" onClick={() => setActiveSection('find-jobs')}>
                <Search size={20} />
                Find Jobs
              </button>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <FileText size={24} />
                </div>
                <div className="stat-content">
                  <h3>{mockStats.applicationsSent}</h3>
                  <p>Applications Sent</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <Search size={24} />
                </div>
                <div className="stat-content">
                  <h3>{mockStats.jobsViewed}</h3>
                  <p>Jobs Viewed</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <Heart size={24} />
                </div>
                <div className="stat-content">
                  <h3>{mockStats.savedJobs}</h3>
                  <p>Saved Jobs</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <Star size={24} />
                </div>
                <div className="stat-content">
                  <h3>{mockStats.profileViews}</h3>
                  <p>Profile Views</p>
                </div>
              </div>
            </div>

            {/* Tips Section for Job Seekers */}
            <div className="tips-section">
              <h2>💡 Tips to Land Your Dream Job</h2>
              <div className="tips-grid">
                <div className="tip-card">
                  <div className="tip-icon">
                    <Target size={20} />
                  </div>
                  <div className="tip-content">
                    <h4>Optimize Your Profile</h4>
                    <p>Complete profiles get 3x more views. Add skills, experience, and a professional photo</p>
                  </div>
                </div>
                
                <div className="tip-card">
                  <div className="tip-icon">
                    <Zap size={20} />
                  </div>
                  <div className="tip-content">
                    <h4>Apply Early</h4>
                    <p>Applications sent within the first 24 hours get 5x more responses from employers</p>
                  </div>
                </div>
                
                <div className="tip-card">
                  <div className="tip-icon">
                    <Award size={20} />
                  </div>
                  <div className="tip-content">
                    <h4>Customize Your Applications</h4>
                    <p>Tailor your cover letter to each job. Mention specific company details and requirements</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Promotion for Job Seekers */}
            <div className="promo-section">
              <div className="promo-content">
                <h3>🚀 Why Professionals Choose JobBoard</h3>
                <div className="promo-features">
                  <div className="promo-feature">
                    <span className="promo-number">92%</span>
                    <span className="promo-text">Interview success rate</span>
                  </div>
                  <div className="promo-feature">
                    <span className="promo-number">15k+</span>
                    <span className="promo-text">Job opportunities</span>
                  </div>
                  <div className="promo-feature">
                    <span className="promo-number">500+</span>
                    <span className="promo-text">Top companies</span>
                  </div>
                </div>
                <p className="promo-description">
                  Our smart matching algorithm connects you with jobs that truly fit your skills and career goals. 
                  Join thousands of professionals who found their perfect role through our platform.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <h3>⚡ Quick Actions</h3>
              <div className="actions-grid">
                <button className="action-card" onClick={() => setActiveSection('find-jobs')}>
                  <Search size={24} />
                  <span>Browse New Jobs</span>
                </button>
                <button className="action-card" onClick={() => setActiveSection('my-applications')}>
                  <Clock size={24} />
                  <span>Check Application Status</span>
                </button>
                <button className="action-card" onClick={() => setActiveSection('profile')}>
                  <User size={24} />
                  <span>Update Profile</span>
                </button>
                <button className="action-card" onClick={() => setActiveSection('saved-jobs')}>
                  <Heart size={24} />
                  <span>View Saved Jobs</span>
                </button>
              </div>
            </div>
          </div>
        );

      // ✅ NEW: Integrated Components instead of placeholders
      case 'find-jobs':
        return <FindJobs userInfo={userInfo} />;

      case 'my-applications':
        return <MyApplications userInfo={userInfo} />;

      case 'saved-jobs':
        return <SavedJobs userInfo={userInfo} />;

      case 'profile':
        return <JobSeekerEditProfile userInfo={userInfo} />;

      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <div className="jobseeker-dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <Building size={28} />
            <span>JobBoard</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              >
                <IconComponent size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {userInfo?.firstName?.charAt(0) || 'U'}
            </div>
            <div className="user-details">
              <div className="user-name">{userInfo?.firstName} {userInfo?.lastName}</div>
              <div className="user-email">{userInfo?.email}</div>
            </div>
          </div>
          
          <button className="logout-btn" onClick={onLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      {renderMainContent()}
    </div>
  );
}

export default JobSeekerDashboard;