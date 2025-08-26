// MyJobs.jsx - UPDATED for Visual Consistency with JobSeeker Dashboard

import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Eye, 
  Users, 
  Calendar,
  MapPin,
  Clock,
  DollarSign
} from 'lucide-react';
import EditJobModal from './EditJobModal';
import DeleteJobModal from './DeleteJobModal';
import './MyJobs.css';

function MyJobs({ onCreateJob, userInfo }) {
  // Step 1: ALL STATE PRESERVED EXACTLY
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Athens, Greece',
      workType: 'hybrid',
      employmentType: 'full-time',
      status: 'active',
      applicants: 23,
      views: 156,
      salary: '€45,000 - €60,000',
      salaryMin: '45000',
      salaryMax: '60000',
      createdAt: '2024-02-15',
      deadline: '2024-03-15',
      description: 'We are looking for an experienced Frontend Developer to join our team and help us build amazing user interfaces.',
      requirements: 'Bachelor\'s degree in Computer Science or related field\n3+ years of experience with React\nStrong JavaScript and TypeScript skills\nExperience with modern CSS frameworks',
      responsibilities: 'Develop new user-facing features\nBuild reusable components and front-end libraries\nOptimize applications for maximum speed and scalability\nCollaborate with design and backend teams',
      skills: 'React, JavaScript, TypeScript, CSS, HTML, Git',
      benefits: ['Health Insurance', 'Remote Work', 'Flexible Hours', 'Professional Development'],
      experienceLevel: 'senior'
    },
    {
      id: 2,
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'Remote',
      workType: 'remote',
      employmentType: 'full-time',
      status: 'active',
      applicants: 18,
      views: 89,
      salary: '€35,000 - €50,000',
      salaryMin: '35000',
      salaryMax: '50000',
      createdAt: '2024-02-10',
      deadline: '2024-03-10',
      description: 'Join our marketing team and help us grow our brand presence across multiple channels.',
      requirements: 'Bachelor\'s degree in Marketing or Business\n5+ years of marketing experience\nStrong analytical and communication skills\nExperience with digital marketing platforms',
      responsibilities: 'Develop and execute marketing strategies\nManage social media campaigns\nAnalyze market trends and customer behavior\nCollaborate with sales and product teams',
      skills: 'Digital Marketing, SEO, Social Media, Analytics, Content Creation',
      benefits: ['Health Insurance', 'Paid Time Off', 'Remote Work', 'Free Meals'],
      experienceLevel: 'mid'
    },
    {
      id: 3,
      title: 'UX Designer',
      department: 'Design',
      location: 'Thessaloniki, Greece',
      workType: 'office',
      employmentType: 'contract',
      status: 'closed',
      applicants: 31,
      views: 203,
      salary: '€30,000 - €40,000',
      salaryMin: '30000',
      salaryMax: '40000',
      createdAt: '2024-01-20',
      deadline: '2024-02-20',
      description: 'We need a creative UX Designer to improve our user experience and design intuitive interfaces.',
      requirements: 'Bachelor\'s degree in Design or related field\n3+ years of UX design experience\nProficiency in design tools (Figma, Sketch)\nStrong portfolio demonstrating UX skills',
      responsibilities: 'Conduct user research and usability testing\nCreate wireframes and prototypes\nDesign user interfaces and experiences\nCollaborate with developers and product managers',
      skills: 'Figma, Sketch, User Research, Prototyping, UI Design',
      benefits: ['Health Insurance', 'Professional Development', 'Gym Membership'],
      experienceLevel: 'mid'
    }
  ]);

  // Step 2: ALL FILTER AND MODAL STATES PRESERVED EXACTLY
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deletingJob, setDeletingJob] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Step 3: ALL FILTER LOGIC PRESERVED EXACTLY
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Step 4: ALL HANDLER FUNCTIONS PRESERVED EXACTLY
  const handleViewJob = (job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setShowEditModal(true);
  };

  const handleSaveEditedJob = (updatedJob) => {
    setJobs(prev => prev.map(job => 
      job.id === updatedJob.id ? updatedJob : job
    ));
    setShowEditModal(false);
    setEditingJob(null);
  };

  const handleDeleteJob = (job) => {
    setDeletingJob(job);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = (jobId) => {
    setIsDeleting(true);
    
    setTimeout(() => {
      setJobs(prev => prev.filter(job => job.id !== jobId));
      setIsDeleting(false);
      setShowDeleteModal(false);
      setDeletingJob(null);
    }, 1500);
  };

  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setShowDeleteModal(false);
      setDeletingJob(null);
    }
  };

  const handleCloseJob = (jobId) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, status: 'closed' } : job
    ));
  };

  // Step 5: ALL UTILITY FUNCTIONS PRESERVED EXACTLY
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return 'myjobs-status-active';
      case 'closed':
        return 'myjobs-status-closed';
      case 'draft':
        return 'myjobs-status-draft';
      default:
        return 'myjobs-status-default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Step 6: JOB CARD RENDER FUNCTION PRESERVED EXACTLY
  const renderJobCard = (job) => (
    <div key={job.id} className="myjobs-job-card">
      <div className="myjobs-job-header">
        <div className="myjobs-job-title-section">
          <h3 className="myjobs-job-title">{job.title}</h3>
          <div className="myjobs-job-meta">
            <span className="myjobs-department">{job.department}</span>
            <span className="myjobs-separator">•</span>
            <span className="myjobs-location">
              <MapPin size={14} />
              {job.location}
            </span>
            <span className="myjobs-separator">•</span>
            <span className="myjobs-work-type">{job.workType}</span>
          </div>
        </div>
        
        <div className="myjobs-job-actions">
          <span className={`myjobs-status-badge ${getStatusBadge(job.status)}`}>
            {job.status}
          </span>
          <div className="myjobs-actions-dropdown">
            <button className="myjobs-more-btn">
              <MoreVertical size={20} />
            </button>
            <div className="myjobs-dropdown-menu">
              <button onClick={() => handleViewJob(job)}>
                <Eye size={16} />
                View Details
              </button>
              <button onClick={() => handleEditJob(job)}>
                <Edit3 size={16} />
                Edit Job
              </button>
              {job.status === 'active' && (
                <button onClick={() => handleCloseJob(job.id)}>
                  <Clock size={16} />
                  Close Job
                </button>
              )}
              <button 
                onClick={() => handleDeleteJob(job)}
                className="myjobs-delete-action"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="myjobs-job-stats">
        <div className="myjobs-stat">
          <Users size={16} />
          <span>{job.applicants} applicants</span>
        </div>
        <div className="myjobs-stat">
          <Eye size={16} />
          <span>{job.views} views</span>
        </div>
        <div className="myjobs-stat">
          <DollarSign size={16} />
          <span>{job.salary}</span>
        </div>
        <div className="myjobs-stat">
          <Calendar size={16} />
          <span>Deadline: {formatDate(job.deadline)}</span>
        </div>
      </div>

      <div className="myjobs-job-footer">
        <span className="myjobs-created-date">
          Posted on {formatDate(job.createdAt)}
        </span>
        <div className="myjobs-quick-actions">
          <button 
            onClick={() => handleViewJob(job)}
            className="myjobs-btn myjobs-btn-outline"
          >
            View Applications
          </button>
          <button 
            onClick={() => handleEditJob(job)}
            className="myjobs-btn myjobs-btn-primary"
          >
            Edit Job
          </button>
        </div>
      </div>
    </div>
  );

  // Step 7: JOB DETAILS MODAL PRESERVED EXACTLY
  const renderJobDetails = () => {
    if (!selectedJob) return null;

    return (
      <div className="myjobs-modal-overlay" onClick={() => setShowJobDetails(false)}>
        <div className="myjobs-modal" onClick={(e) => e.stopPropagation()}>
          <div className="myjobs-modal-header">
            <h2>{selectedJob.title}</h2>
            <button 
              onClick={() => setShowJobDetails(false)}
              className="myjobs-close-btn"
            >
              ×
            </button>
          </div>
          
          <div className="myjobs-modal-content">
            <div className="myjobs-job-details">
              <div className="myjobs-detail-section">
                <h4>Job Information</h4>
                <div className="myjobs-detail-grid">
                  <div>
                    <strong>Department:</strong> {selectedJob.department}
                  </div>
                  <div>
                    <strong>Location:</strong> {selectedJob.location}
                  </div>
                  <div>
                    <strong>Work Type:</strong> {selectedJob.workType}
                  </div>
                  <div>
                    <strong>Employment:</strong> {selectedJob.employmentType}
                  </div>
                </div>
              </div>
              
              <div className="myjobs-detail-section">
                <h4>Description</h4>
                <p>{selectedJob.description}</p>
              </div>
              
              <div className="myjobs-detail-section">
                <h4>Statistics</h4>
                <div className="myjobs-stats-grid">
                  <div className="myjobs-stat-item">
                    <span className="myjobs-stat-number">{selectedJob.applicants}</span>
                    <span className="myjobs-stat-label">Applicants</span>
                  </div>
                  <div className="myjobs-stat-item">
                    <span className="myjobs-stat-number">{selectedJob.views}</span>
                    <span className="myjobs-stat-label">Views</span>
                  </div>
                  <div className="myjobs-stat-item">
                    <span className="myjobs-stat-number">{selectedJob.salary}</span>
                    <span className="myjobs-stat-label">Salary Range</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="myjobs-modal-footer">
            <button 
              onClick={() => handleEditJob(selectedJob)}
              className="myjobs-btn myjobs-btn-primary"
            >
              Edit Job
            </button>
            <button 
              onClick={() => setShowJobDetails(false)}
              className="myjobs-btn myjobs-btn-outline"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Step 8: MAIN RENDER - UPDATED HEADER ONLY, EVERYTHING ELSE PRESERVED
  return (
    <div className="myjobs-container">
      {/* ✅ UPDATED: Header with gradient background like other components */}
      <div className="myjobs-header">
        <div className="myjobs-header-content">
          <h1>My Job Postings</h1>
          <p>Manage your job postings and track applications</p>
        </div>
        <button 
          onClick={onCreateJob}
          className="myjobs-btn myjobs-btn-primary myjobs-create-btn"
        >
          <Plus size={20} />
          Post New Job
        </button>
      </div>

      {/* ✅ PRESERVED: All filters exactly as before */}
      <div className="myjobs-filters">
        <div className="myjobs-search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search jobs by title or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="myjobs-search-input"
          />
        </div>
        
        <div className="myjobs-filter-group">
          <Filter size={20} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="myjobs-filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* ✅ PRESERVED: Jobs summary exactly as before */}
      <div className="myjobs-summary">
        <div className="myjobs-summary-card">
          <span className="myjobs-summary-number">{jobs.filter(j => j.status === 'active').length}</span>
          <span className="myjobs-summary-label">Active Jobs</span>
        </div>
        <div className="myjobs-summary-card">
          <span className="myjobs-summary-number">{jobs.reduce((sum, job) => sum + job.applicants, 0)}</span>
          <span className="myjobs-summary-label">Total Applications</span>
        </div>
        <div className="myjobs-summary-card">
          <span className="myjobs-summary-number">{jobs.reduce((sum, job) => sum + job.views, 0)}</span>
          <span className="myjobs-summary-label">Total Views</span>
        </div>
      </div>

      {/* ✅ PRESERVED: Jobs list exactly as before */}
      <div className="myjobs-list">
        {filteredJobs.length > 0 ? (
          filteredJobs.map(renderJobCard)
        ) : (
          <div className="myjobs-empty-state">
            <h3>No jobs found</h3>
            <p>
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Start by posting your first job'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button 
                onClick={onCreateJob}
                className="myjobs-btn myjobs-btn-primary"
              >
                <Plus size={20} />
                Post Your First Job
              </button>
            )}
          </div>
        )}
      </div>

      {/* ✅ PRESERVED: All modals exactly as before */}
      {showJobDetails && renderJobDetails()}

      <EditJobModal
        job={editingJob}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingJob(null);
        }}
        onSave={handleSaveEditedJob}
        userInfo={userInfo}
      />

      <DeleteJobModal
        job={deletingJob}
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default MyJobs;