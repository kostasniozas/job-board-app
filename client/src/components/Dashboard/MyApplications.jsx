// MyApplications.jsx - UPDATED for Visual Consistency with MyJobs Dashboard

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Building2, 
  MapPin, 
  Clock, 
  Eye, 
  X, 
  CheckCircle, 
  AlertCircle, 
  FileText,
  Send,
  Check
} from 'lucide-react';
import './MyApplications.css';

const MyApplications = () => {
  // Step 1: ALL STATE PRESERVED EXACTLY
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [applicationToWithdraw, setApplicationToWithdraw] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Step 2: ALL MOCK DATA PRESERVED EXACTLY
  const [applications, setApplications] = useState([
    {
      id: 1,
      jobTitle: 'Senior React Developer',
      company: 'TechCorp Solutions',
      companyLogo: 'TC',
      location: 'Athens, Greece',
      appliedDate: '2025-08-15',
      status: 'under_review',
      statusDate: '2025-08-16',
      salary: '€45,000 - €65,000',
      jobType: 'Full-time',
      description: 'We are looking for an experienced React developer to join our growing team.',
      applicationNotes: 'Application submitted with portfolio and cover letter.',
      nextStep: 'Technical interview scheduled for next week',
      timeline: [
        { date: '2025-08-15', event: 'Application Submitted', status: 'completed' },
        { date: '2025-08-16', event: 'Application Under Review', status: 'current' },
        { date: 'TBD', event: 'Technical Interview', status: 'pending' },
        { date: 'TBD', event: 'Final Decision', status: 'pending' }
      ]
    },
    {
      id: 2,
      jobTitle: 'Digital Marketing Manager',
      company: 'CreativeMedia Inc',
      companyLogo: 'CM',
      location: 'Thessaloniki, Greece',
      appliedDate: '2025-08-10',
      status: 'accepted',
      statusDate: '2025-08-18',
      salary: '€35,000 - €45,000',
      jobType: 'Full-time',
      description: 'Join our marketing team to drive digital campaigns and grow our online presence.',
      applicationNotes: 'Great interview, they loved my previous campaign results.',
      nextStep: 'Contract negotiation in progress',
      timeline: [
        { date: '2025-08-10', event: 'Application Submitted', status: 'completed' },
        { date: '2025-08-12', event: 'Phone Screening', status: 'completed' },
        { date: '2025-08-15', event: 'In-Person Interview', status: 'completed' },
        { date: '2025-08-18', event: 'Job Offer Received', status: 'completed' }
      ]
    },
    {
      id: 3,
      jobTitle: 'UX/UI Designer',
      company: 'DesignStudio Pro',
      companyLogo: 'DS',
      location: 'Remote',
      appliedDate: '2025-08-12',
      status: 'rejected',
      statusDate: '2025-08-17',
      salary: '€40,000 - €55,000',
      jobType: 'Remote',
      description: 'Create exceptional user experiences for our clients.',
      applicationNotes: 'Portfolio reviewed, but they went with more senior candidate.',
      nextStep: 'Consider reapplying in 6 months',
      timeline: [
        { date: '2025-08-12', event: 'Application Submitted', status: 'completed' },
        { date: '2025-08-14', event: 'Portfolio Review', status: 'completed' },
        { date: '2025-08-17', event: 'Application Rejected', status: 'completed' }
      ]
    },
    {
      id: 4,
      jobTitle: 'Python Backend Developer',
      company: 'DataFlow Systems',
      companyLogo: 'DF',
      location: 'Athens, Greece',
      appliedDate: '2025-08-18',
      status: 'pending',
      statusDate: '2025-08-18',
      salary: '€50,000 - €70,000',
      jobType: 'Full-time',
      description: 'Build scalable backend systems using Python and modern frameworks.',
      applicationNotes: 'Just submitted, waiting for initial review.',
      nextStep: 'Waiting for HR response',
      timeline: [
        { date: '2025-08-18', event: 'Application Submitted', status: 'completed' },
        { date: 'TBD', event: 'Initial Review', status: 'pending' },
        { date: 'TBD', event: 'Technical Assessment', status: 'pending' },
        { date: 'TBD', event: 'Final Decision', status: 'pending' }
      ]
    },
    {
      id: 5,
      jobTitle: 'Sales Representative',
      company: 'SalesForce Greece',
      companyLogo: 'SF',
      location: 'Athens, Greece',
      appliedDate: '2025-08-08',
      status: 'interview',
      statusDate: '2025-08-14',
      salary: '€25,000 - €40,000 + Commission',
      jobType: 'Full-time',
      description: 'Drive revenue growth by building relationships with new clients.',
      applicationNotes: 'Second round interview coming up this Friday.',
      nextStep: 'Final interview with Sales Director',
      timeline: [
        { date: '2025-08-08', event: 'Application Submitted', status: 'completed' },
        { date: '2025-08-11', event: 'Phone Interview', status: 'completed' },
        { date: '2025-08-14', event: 'First Interview', status: 'completed' },
        { date: '2025-08-22', event: 'Final Interview', status: 'current' }
      ]
    }
  ]);

  // Step 3: ALL STATUS CONFIGURATION PRESERVED EXACTLY
  const statusOptions = [
    { value: 'all', label: 'All Applications', count: applications.length },
    { value: 'pending', label: 'Pending', count: applications.filter(app => app.status === 'pending').length },
    { value: 'under_review', label: 'Under Review', count: applications.filter(app => app.status === 'under_review').length },
    { value: 'interview', label: 'Interview', count: applications.filter(app => app.status === 'interview').length },
    { value: 'accepted', label: 'Accepted', count: applications.filter(app => app.status === 'accepted').length },
    { value: 'rejected', label: 'Rejected', count: applications.filter(app => app.status === 'rejected').length }
  ];

  const getStatusConfig = (status) => {
    const configs = {
      pending: { icon: Clock, color: '#f39c12', bg: 'rgba(243, 156, 18, 0.15)', text: 'Pending' },
      under_review: { icon: Eye, color: '#3498db', bg: 'rgba(52, 152, 219, 0.15)', text: 'Under Review' },
      interview: { icon: Calendar, color: '#9b59b6', bg: 'rgba(155, 89, 182, 0.15)', text: 'Interview' },
      accepted: { icon: CheckCircle, color: '#27ae60', bg: 'rgba(39, 174, 96, 0.15)', text: 'Accepted' },
      rejected: { icon: X, color: '#e74c3c', bg: 'rgba(231, 76, 60, 0.15)', text: 'Rejected' }
    };
    return configs[status] || configs.pending;
  };

  // Step 4: ALL HANDLER FUNCTIONS PRESERVED EXACTLY
  const handleWithdraw = (app) => {
    console.log('Opening withdraw modal for:', app.jobTitle);
    setApplicationToWithdraw(app);
    setShowWithdrawModal(true);
  };

  const confirmWithdraw = () => {
    if (applicationToWithdraw) {
      console.log('Withdrawing application:', applicationToWithdraw.jobTitle);
      
      setApplications(prevApps => 
        prevApps.filter(app => app.id !== applicationToWithdraw.id)
      );
      
      setShowWithdrawModal(false);
      setApplicationToWithdraw(null);
      
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    }
  };

  const cancelWithdraw = () => {
    console.log('Withdraw cancelled');
    setShowWithdrawModal(false);
    setApplicationToWithdraw(null);
  };

  // Step 5: ALL FILTER LOGIC PRESERVED EXACTLY
  const filteredApplications = applications.filter(app => {
    const matchesSearch = searchQuery === '' || 
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Step 6: ALL UTILITY FUNCTIONS PRESERVED EXACTLY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysAgo = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Step 7: MAIN RENDER - UPDATED LAYOUT TO MATCH MYJOBS EXACTLY
  return (
    <div className="myapps-container">
      {/* Success Message - PRESERVED EXACTLY */}
      {showSuccessMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#27ae60',
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: 10000,
          boxShadow: '0 4px 12px rgba(39, 174, 96, 0.3)'
        }}>
          <Check size={20} />
          Application withdrawn successfully!
        </div>
      )}

      {/* ✅ UPDATED: Header to match MyJobs structure exactly */}
      <div className="myapps-header">
        <div className="myapps-hero">
          <h1>My Applications</h1>
          <p>Track the progress of your job applications and manage your career journey</p>
        </div>

        <div className="myapps-search-section">
          <div className="myapps-search-row">
            <div className="myapps-search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="myapps-search-input"
              />
            </div>
            
            <div className="myapps-filter-group">
              <Filter size={20} />
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="myapps-status-filter"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label} ({option.count})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ UPDATED: Stats to match MyJobs summary cards exactly */}
      <div className="myapps-stats">
        {statusOptions.slice(1).map(option => (
          <div key={option.value} className="myapps-stat-card">
            <div className="myapps-stat-info">
              <h3>{option.count}</h3>
              <p>{option.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ PRESERVED: Applications List exactly as before */}
      <div className="myapps-list">
        {filteredApplications.length === 0 ? (
          <div className="myapps-empty">
            <FileText size={48} />
            <h3>No applications found</h3>
            <p>
              {searchQuery || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Start by applying to your first job'
              }
            </p>
          </div>
        ) : (
          filteredApplications.map(app => {
            const statusConfig = getStatusConfig(app.status);
            const StatusIcon = statusConfig.icon;
            
            return (
              <div key={app.id} className="myapps-card">
                <div className="myapps-card-header">
                  <div className="myapps-company-info">
                    <div className="myapps-company-logo">{app.companyLogo}</div>
                    <div className="myapps-job-details">
                      <h3 className="myapps-job-title">{app.jobTitle}</h3>
                      <p className="myapps-company-name">{app.company}</p>
                      <div className="myapps-job-meta">
                        <span className="myapps-meta-item">
                          <MapPin size={14} />
                          {app.location}
                        </span>
                        <span className="myapps-separator">•</span>
                        <span className="myapps-meta-item">
                          <Send size={14} />
                          Applied {getDaysAgo(app.appliedDate)}
                        </span>
                        <span className="myapps-separator">•</span>
                        <span className="myapps-meta-item">
                          <Building2 size={14} />
                          {app.jobType}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="myapps-status-section">
                    <div 
                      className="myapps-status-badge"
                      style={{ 
                        backgroundColor: statusConfig.bg, 
                        color: statusConfig.color,
                        borderColor: statusConfig.color + '50'
                      }}
                    >
                      <StatusIcon size={16} />
                      {statusConfig.text}
                    </div>
                    <p className="myapps-status-date">
                      Updated {formatDate(app.statusDate)}
                    </p>
                  </div>
                </div>

                <div className="myapps-card-body">
                  <p className="myapps-job-description">{app.description}</p>
                  
                  <div className="myapps-details">
                    <div className="myapps-detail-item">
                      <strong>Salary:</strong> {app.salary}
                    </div>
                    <div className="myapps-detail-item">
                      <strong>Type:</strong> {app.jobType}
                    </div>
                    <div className="myapps-detail-item">
                      <strong>Next Step:</strong> {app.nextStep}
                    </div>
                  </div>
                </div>

                <div className="myapps-card-actions">
                  <button 
                    onClick={() => setSelectedApplication(app)}
                    className="myapps-view-btn"
                  >
                    <Eye size={16} />
                    View Timeline
                  </button>
                  
                  {app.status !== 'accepted' && app.status !== 'rejected' && (
                    <button 
                      onClick={() => handleWithdraw(app)}
                      className="myapps-withdraw-btn"
                    >
                      Withdraw Application
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ✅ PRESERVED: Application Timeline Modal exactly as before */}
      {selectedApplication && (
        <div className="myapps-modal-overlay" onClick={() => setSelectedApplication(null)}>
          <div className="myapps-modal" onClick={(e) => e.stopPropagation()}>
            <div className="myapps-modal-header">
              <h3>{selectedApplication.jobTitle}</h3>
              <button 
                onClick={() => setSelectedApplication(null)}
                className="myapps-modal-close"
              >
                ×
              </button>
            </div>
            
            <div className="myapps-modal-body">
              <div className="myapps-application-info">
                <div className="myapps-company-details">
                  <div className="myapps-company-logo large">{selectedApplication.companyLogo}</div>
                  <div>
                    <h4>{selectedApplication.company}</h4>
                    <p>{selectedApplication.location}</p>
                  </div>
                </div>
                
                <div className="myapps-application-notes">
                  <h5>Application Notes:</h5>
                  <p>{selectedApplication.applicationNotes}</p>
                </div>
              </div>
              
              <div className="myapps-timeline">
                <h5>Application Timeline</h5>
                <div className="myapps-timeline-items">
                  {selectedApplication.timeline.map((item, index) => (
                    <div key={index} className={`myapps-timeline-item ${item.status}`}>
                      <div className="myapps-timeline-marker"></div>
                      <div className="myapps-timeline-content">
                        <h6>{item.event}</h6>
                        <p>{item.date === 'TBD' ? 'To be determined' : formatDate(item.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ PRESERVED: Withdraw Confirmation Modal exactly as before */}
      {showWithdrawModal && applicationToWithdraw && (
        <div className="myapps-withdraw-modal-overlay" onClick={cancelWithdraw}>
          <div className="myapps-withdraw-modal" onClick={(e) => e.stopPropagation()}>
            <div className="myapps-withdraw-modal-header">
              <h3>Withdraw Application</h3>
              <button 
                onClick={cancelWithdraw}
                className="myapps-modal-close"
              >
                ×
              </button>
            </div>
            
            <div className="myapps-withdraw-modal-body">
              <p>Are you sure you want to withdraw your application for:</p>
              <div className="myapps-withdraw-job-info">
                <h4>{applicationToWithdraw.jobTitle}</h4>
                <p>{applicationToWithdraw.company}</p>
              </div>
              <p className="myapps-withdraw-warning">This action cannot be undone.</p>
              
              <div className="myapps-withdraw-actions">
                <button 
                  onClick={cancelWithdraw}
                  className="myapps-withdraw-cancel-btn"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmWithdraw}
                  className="myapps-withdraw-confirm-btn"
                >
                  Yes, Withdraw
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplications;