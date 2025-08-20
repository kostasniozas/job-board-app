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
  Send
} from 'lucide-react';
import './MyApplications.css';

const MyApplications = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Mock applications data
  const mockApplications = [
    {
      id: 1,
      jobTitle: 'Senior React Developer',
      company: 'TechCorp Solutions',
      companyLogo: '🏢',
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
      companyLogo: '🎨',
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
      companyLogo: '✨',
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
      companyLogo: '⚡',
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
      companyLogo: '📈',
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
  ];

  const statusOptions = [
    { value: 'all', label: 'All Applications', count: mockApplications.length },
    { value: 'pending', label: 'Pending', count: mockApplications.filter(app => app.status === 'pending').length },
    { value: 'under_review', label: 'Under Review', count: mockApplications.filter(app => app.status === 'under_review').length },
    { value: 'interview', label: 'Interview', count: mockApplications.filter(app => app.status === 'interview').length },
    { value: 'accepted', label: 'Accepted', count: mockApplications.filter(app => app.status === 'accepted').length },
    { value: 'rejected', label: 'Rejected', count: mockApplications.filter(app => app.status === 'rejected').length }
  ];

  const getStatusConfig = (status) => {
    const configs = {
      pending: { icon: Clock, color: '#f39c12', bg: '#fef9e7', text: 'Pending' },
      under_review: { icon: Eye, color: '#3498db', bg: '#ebf3fd', text: 'Under Review' },
      interview: { icon: Calendar, color: '#9b59b6', bg: '#f4ecf7', text: 'Interview' },
      accepted: { icon: CheckCircle, color: '#27ae60', bg: '#eafaf1', text: 'Accepted' },
      rejected: { icon: X, color: '#e74c3c', bg: '#fdedec', text: 'Rejected' }
    };
    return configs[status] || configs.pending;
  };

  // Filter applications
  const filteredApplications = mockApplications.filter(app => {
    const matchesSearch = searchQuery === '' || 
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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

  return (
    <div className="myapps-container">
      {/* Header */}
      <div className="myapps-header">
        <div className="myapps-title">
          <h2>My Applications</h2>
          <p>Track the progress of your job applications</p>
        </div>

        {/* Search and Filter */}
        <div className="myapps-controls">
          <div className="myapps-search">
            <Search className="myapps-search-icon" size={20} />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="myapps-search-input"
            />
          </div>
          
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

      {/* Stats Overview */}
      <div className="myapps-stats">
        {statusOptions.slice(1).map(option => {
          const config = getStatusConfig(option.value);
          const IconComponent = config.icon;
          
          return (
            <div key={option.value} className="myapps-stat-card">
              <div className="myapps-stat-icon" style={{ backgroundColor: config.bg, color: config.color }}>
                <IconComponent size={24} />
              </div>
              <div className="myapps-stat-info">
                <h3>{option.count}</h3>
                <p>{option.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Applications List */}
      <div className="myapps-list">
        {filteredApplications.length === 0 ? (
          <div className="myapps-empty">
            <FileText size={48} />
            <h3>No applications found</h3>
            <p>Try adjusting your search criteria or apply to more jobs.</p>
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
                    <div>
                      <h4 className="myapps-job-title">{app.jobTitle}</h4>
                      <p className="myapps-company-name">{app.company}</p>
                      <div className="myapps-job-meta">
                        <span><MapPin size={14} /> {app.location}</span>
                        <span><Send size={14} /> Applied {getDaysAgo(app.appliedDate)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="myapps-status-section">
                    <div 
                      className="myapps-status-badge"
                      style={{ backgroundColor: statusConfig.bg, color: statusConfig.color }}
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
                  <button className="myapps-withdraw-btn">
                    Withdraw Application
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Application Timeline Modal */}
      {selectedApplication && (
        <div className="myapps-modal-overlay" onClick={() => setSelectedApplication(null)}>
          <div className="myapps-modal" onClick={(e) => e.stopPropagation()}>
            <div className="myapps-modal-header">
              <h3>{selectedApplication.jobTitle}</h3>
              <button 
                onClick={() => setSelectedApplication(null)}
                className="myapps-modal-close"
              >
                <X size={24} />
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
    </div>
  );
};

export default MyApplications;