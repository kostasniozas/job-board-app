// EmployerDashboard.jsx - Main Employer Dashboard with Full Integration

import { useState } from 'react';
import { 
  Plus, 
  Briefcase, 
  Users, 
  BarChart3, 
  User, 
  LogOut,
  TrendingUp,
  Calendar,
  Eye,
  Star,
  Target,
  Building,
  Video
} from 'lucide-react';

// Import the new components
import PostJobForm from './PostJobForm';
import MyJobs from './MyJobs';
import Candidates from './Candidates';
import Analytics from './Analytics';
import EditProfile from './EditProfile';
import InterviewReview from './InterviewReview';

// Import CSS files
import './EmployerDashboard.css';
import './PostJobForm.css';
import './MyJobs.css';
import './Candidates.css';
import './Analytics.css';
import './EditProfile.css';
import './InterviewReview.css';
import './VideoReviewModal.css';

function EmployerDashboard({ userInfo, onLogout }) {
  // Step 1: Navigation state
  const [activeSection, setActiveSection] = useState('overview');

  // Step 2: Mock data for dashboard
  const mockStats = {
    activeJobs: 5,
    totalApplications: 43,
    todayViews: 12,
    thisMonthHires: 3
  };

  // Step 3: Navigation items
  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'post-job', label: 'Post Job', icon: Plus },
    { id: 'jobs', label: 'My Jobs', icon: Briefcase },
    { id: 'candidates', label: 'Candidates', icon: Users },
    { id: 'interviews', label: 'Interviews', icon: Video },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'profile', label: 'Edit Profile', icon: User }
  ];

  // Step 4: Handle navigation
  const handleNavigation = (sectionId) => {
    setActiveSection(sectionId);
  };

  // Step 5: Handle going back to dashboard from forms
  const handleBackToDashboard = () => {
    setActiveSection('overview');
  };

  // Step 6: Handle creating new job from MyJobs component
  const handleCreateJob = () => {
    setActiveSection('post-job');
  };

  // Step 7: Render main content based on active section
  const renderMainContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="main-content">
            <div className="content-header">
              <div>
                <h1>Welcome back, {userInfo?.firstName || 'Employer'}!</h1>
                <p>Here's what's happening with your job postings today</p>
              </div>
              <button className="btn btn-primary post-job-btn" onClick={() => setActiveSection('post-job')}>
                <Plus size={20} />
                Post New Job
              </button>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <Briefcase size={24} />
                </div>
                <div className="stat-content">
                  <h3>{mockStats.activeJobs}</h3>
                  <p>Active Jobs</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <Users size={24} />
                </div>
                <div className="stat-content">
                  <h3>{mockStats.totalApplications}</h3>
                  <p>Total Applications</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <Eye size={24} />
                </div>
                <div className="stat-content">
                  <h3>{mockStats.todayViews}</h3>
                  <p>Views Today</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <Star size={24} />
                </div>
                <div className="stat-content">
                  <h3>{mockStats.thisMonthHires}</h3>
                  <p>Hires This Month</p>
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="tips-section">
              <h2>💡 Tips to Attract Better Candidates</h2>
              <div className="tips-grid">
                <div className="tip-card">
                  <div className="tip-icon">
                    <Target size={20} />
                  </div>
                  <div className="tip-content">
                    <h4>Write Clear Job Titles</h4>
                    <p>Use specific, industry-standard titles like "Senior React Developer" instead of "Coding Ninja"</p>
                  </div>
                </div>
                
                <div className="tip-card">
                  <div className="tip-icon">
                    <Calendar size={20} />
                  </div>
                  <div className="tip-content">
                    <h4>Post at the Right Time</h4>
                    <p>Tuesdays and Wednesdays get 30% more applications than other days</p>
                  </div>
                </div>
                
                <div className="tip-card">
                  <div className="tip-icon">
                    <Building size={20} />
                  </div>
                  <div className="tip-content">
                    <h4>Showcase Your Company</h4>
                    <p>Complete your company profile with photos and culture details to attract top talent</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Promotion */}
            <div className="promo-section">
              <div className="promo-content">
                <h3>🚀 Why Companies Love JobBoard</h3>
                <div className="promo-features">
                  <div className="promo-feature">
                    <span className="promo-number">85%</span>
                    <span className="promo-text">Better candidate quality</span>
                  </div>
                  <div className="promo-feature">
                    <span className="promo-number">60%</span>
                    <span className="promo-text">Faster hiring process</span>
                  </div>
                  <div className="promo-feature">
                    <span className="promo-number">10k+</span>
                    <span className="promo-text">Active professionals</span>
                  </div>
                </div>
                <p className="promo-description">
                  Our AI-powered matching system connects you with candidates who actually fit your requirements. 
                  Save time, reduce costs, and find your next great hire faster than ever.
                </p>
              </div>
            </div>
          </div>
        );

      // ✅ INTEGRATED COMPONENTS
      case 'post-job':
        return <PostJobForm onBack={handleBackToDashboard} userInfo={userInfo} />;

      case 'jobs':
        return <MyJobs onCreateJob={handleCreateJob} userInfo={userInfo} />;

      case 'candidates':
        return <Candidates userInfo={userInfo} />;

      case 'interviews':
        return <InterviewReview userInfo={userInfo} />;

      case 'analytics':
        return <Analytics userInfo={userInfo} />;

      case 'profile':
        return <EditProfile userInfo={userInfo} />;

      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <Briefcase size={28} />
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

export default EmployerDashboard;