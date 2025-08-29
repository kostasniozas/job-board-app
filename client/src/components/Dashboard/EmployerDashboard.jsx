// EmployerDashboard.jsx - Main Employer Dashboard with Real Backend Integration

import { useState, useEffect } from 'react';
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
  Video,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

// Import API
import { jobsAPI } from '../../services/api';

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

  // Step 2: ΝΕΕΣ STATES για real data από backend
  const [dashboardStats, setDashboardStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    todayViews: 0,
    thisMonthHires: 0
  });
  
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState('');
  const [jobs, setJobs] = useState([]);

  // Step 3: Φόρτωση real data από backend
  const fetchDashboardStats = async () => {
    try {
      setIsLoadingStats(true);
      setStatsError('');
      console.log('Fetching dashboard stats...');
      
      // Καλούμε το API για jobs
      const response = await jobsAPI.getMyJobs();
      console.log('Dashboard stats response:', response);
      
      if (response.success) {
        const jobsData = response.jobs || [];
        setJobs(jobsData);
        
        // Υπολογίζουμε τα πραγματικά statistics
        const stats = calculateStats(jobsData);
        setDashboardStats(stats);
        
        console.log('Calculated dashboard stats:', stats);
      } else {
        throw new Error(response.message || 'Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStatsError(error.message || 'Failed to load dashboard data');
      
      // Fallback σε 0 αν αποτύχει
      setDashboardStats({
        activeJobs: 0,
        totalApplications: 0,
        todayViews: 0,
        thisMonthHires: 0
      });
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Step 4: Συνάρτηση για υπολογισμό statistics από τα jobs
  const calculateStats = (jobsData) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return {
      // Active jobs: jobs που δεν έχουν status ή έχουν status 'active'
      activeJobs: jobsData.filter(job => !job.status || job.status === 'active').length,
      
      // Total applications: άθροισμα όλων των applicants
      totalApplications: jobsData.reduce((sum, job) => sum + (job.applicants || 0), 0),
      
      // Today views: άθροισμα views (προς το παρόν όλων, μπορεί να φιλτραριστεί αργότερα)
      todayViews: jobsData.reduce((sum, job) => sum + (job.views || 0), 0),
      
      // This month hires: για τώρα 0, μπορεί να προστεθεί αργότερα από applications data
      thisMonthHires: 0 // Placeholder - θα χρειαστεί applications API
    };
  };

  // Step 5: Φόρτωση data όταν φορτώνει το component ή αλλάζει activeSection
  useEffect(() => {
    if (activeSection === 'overview') {
      fetchDashboardStats();
    }
  }, [activeSection]);

  // Step 6: Navigation items
  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'post-job', label: 'Post Job', icon: Plus },
    { id: 'jobs', label: 'My Jobs', icon: Briefcase },
    { id: 'candidates', label: 'Candidates', icon: Users },
    { id: 'interviews', label: 'Interviews', icon: Video },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'profile', label: 'Edit Profile', icon: User }
  ];

  // Step 7: Handle navigation
  const handleNavigation = (sectionId) => {
    setActiveSection(sectionId);
  };

  // Step 8: Handle going back to dashboard from forms
  const handleBackToDashboard = () => {
    setActiveSection('overview');
    // Refresh stats όταν γυρνάμε στο overview
    if (activeSection !== 'overview') {
      fetchDashboardStats();
    }
  };

  // Step 9: Handle creating new job from MyJobs component
  const handleCreateJob = () => {
    setActiveSection('post-job');
  };

  // Step 10: Handle refreshing stats
  const handleRefreshStats = () => {
    fetchDashboardStats();
  };

  // Step 11: Render main content based on active section
  const renderMainContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="main-content">
            <div className="content-header">
              <div>
                <h1>Welcome back, {userInfo?.companyName || `${userInfo?.firstName || ''} ${userInfo?.lastName || ''}`.trim() || 'Employer'}!</h1>
                <p>Here's what's happening with your job postings today</p>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button 
                  className="btn btn-outline"
                  onClick={handleRefreshStats}
                  disabled={isLoadingStats}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    color: 'white',
                    borderRadius: '12px',
                    cursor: isLoadingStats ? 'not-allowed' : 'pointer'
                  }}
                >
                  <RefreshCw size={16} className={isLoadingStats ? 'spinning' : ''} />
                  Refresh
                </button>
                <button className="btn btn-primary post-job-btn" onClick={() => setActiveSection('post-job')}>
                  <Plus size={20} />
                  Post New Job
                </button>
              </div>
            </div>

            {/* Error Message */}
            {statsError && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#fee',
                color: '#c33',
                padding: '15px 20px',
                borderRadius: '12px',
                border: '2px solid #fcc',
                marginBottom: '20px'
              }}>
                <AlertCircle size={20} />
                <span>{statsError}</span>
                <button 
                  onClick={handleRefreshStats} 
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#c33',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    padding: '0',
                    marginLeft: '10px'
                  }}
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Stats Cards με real data */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <Briefcase size={24} />
                </div>
                <div className="stat-content">
                  <h3>{isLoadingStats ? '...' : dashboardStats.activeJobs}</h3>
                  <p>Active Jobs</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <Users size={24} />
                </div>
                <div className="stat-content">
                  <h3>{isLoadingStats ? '...' : dashboardStats.totalApplications}</h3>
                  <p>Total Applications</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <Eye size={24} />
                </div>
                <div className="stat-content">
                  <h3>{isLoadingStats ? '...' : dashboardStats.todayViews}</h3>
                  <p>Views Today</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">
                  <Star size={24} />
                </div>
                <div className="stat-content">
                  <h3>{isLoadingStats ? '...' : dashboardStats.thisMonthHires}</h3>
                  <p>Hires This Month</p>
                </div>
              </div>
            </div>

            {/* Debug info - μπορεί να αφαιρεθεί αργότερα */}
            {process.env.NODE_ENV === 'development' && (
              <div style={{
                background: '#f0f8ff',
                border: '1px solid #cce7ff',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '20px',
                fontSize: '0.85rem',
                color: '#666'
              }}>
                <strong>Debug Info:</strong> Found {jobs.length} jobs total. 
                Active: {jobs.filter(j => !j.status || j.status === 'active').length}, 
                Closed: {jobs.filter(j => j.status === 'closed').length}
              </div>
            )}

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

      // INTEGRATED COMPONENTS
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