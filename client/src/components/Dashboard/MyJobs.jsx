// MyJobs.jsx - COMPLETE FINAL VERSION with Backend Integration and Salary Fix
import { useState, useEffect } from 'react';
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
  DollarSign,
  RefreshCw,
  AlertCircle,
  Building,
  Briefcase
} from 'lucide-react';
import { jobsAPI } from '../../services/api';
import EditJobModal from './EditJobModal';
import DeleteJobModal from './DeleteJobModal';
import './MyJobs.css';

function MyJobs({ onCreateJob, userInfo }) {
  // Step 1: STATE για jobs από backend
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Step 2: ΥΠΑΡΧΟΝΤΑ STATES διατηρημένα
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deletingJob, setDeletingJob] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Step 3: ΝΕΕΣ ΣΥΝΑΡΤΗΣΕΙΣ για backend integration
  const fetchMyJobs = async () => {
    try {
      setIsLoading(true);
      setError('');
      console.log('Fetching jobs from backend...');
      
      const response = await jobsAPI.getMyJobs();
      console.log('Jobs response:', response);
      
      if (response.success) {
        setJobs(response.jobs || []);
      } else {
        throw new Error(response.message || 'Failed to fetch jobs');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError(error.message || 'Failed to load jobs');
      setJobs([]); // Fallback σε άδειο array
    } finally {
      setIsLoading(false);
    }
  };

  // Step 4: Load jobs όταν φορτώνει το component
  useEffect(() => {
    fetchMyJobs();
  }, []);

  // Step 5: Refresh function
  const handleRefresh = () => {
    fetchMyJobs();
  };

  // Step 6: ΔΙΑΤΗΡΗΣΗ filter logic
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Step 7: ΔΙΑΤΗΡΗΣΗ όλων των handler functions
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
      job._id === updatedJob._id ? updatedJob : job
    ));
    setShowEditModal(false);
    setEditingJob(null);
    // Refresh jobs to get latest data
    fetchMyJobs();
  };

  const handleDeleteJob = (job) => {
    setDeletingJob(job);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async (jobId) => {
    setIsDeleting(true);
    
    try {
      // Call the delete API
      await jobsAPI.deleteJob(jobId);
      
      // Remove from local state
      setJobs(prev => prev.filter(job => job._id !== jobId));
      setShowDeleteModal(false);
      setDeletingJob(null);
    } catch (error) {
      console.error('Error deleting job:', error);
      // You might want to show an error message here
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setShowDeleteModal(false);
      setDeletingJob(null);
    }
  };

  const handleCloseJob = (jobId) => {
    setJobs(prev => prev.map(job => 
      job._id === jobId ? { ...job, status: 'closed' } : job
    ));
  };

  // Step 8: ΔΙΑΤΗΡΗΣΗ utility functions
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
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Step 9: ΕΝΗΜΕΡΩΜΕΝΗ Job card render function
  const renderJobCard = (job) => (
    <div key={job._id || job.id} className="myjobs-job-card">
      <div className="myjobs-job-header">
        <div className="myjobs-job-title-section">
          <h3 className="myjobs-job-title">{job.title}</h3>
          <div className="myjobs-job-meta">
            <span className="myjobs-department">{job.company}</span>
            <span className="myjobs-separator">•</span>
            <span className="myjobs-location">
              <MapPin size={14} />
              {job.location}
            </span>
            <span className="myjobs-separator">•</span>
            <span className="myjobs-work-type">{job.workType || job.type}</span>
          </div>
        </div>
        
        <div className="myjobs-job-actions">
          <span className={`myjobs-status-badge ${getStatusBadge(job.status || 'active')}`}>
            {job.status || 'active'}
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
              {(!job.status || job.status === 'active') && (
                <button onClick={() => handleCloseJob(job._id || job.id)}>
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
          <span>{job.applicants || 0} applicants</span>
        </div>
        <div className="myjobs-stat">
          <Eye size={16} />
          <span>{job.views || 0} views</span>
        </div>
        <div className="myjobs-stat">
          <DollarSign size={16} />
          <span>{job.salary || 'Competitive'}</span>
        </div>
        <div className="myjobs-stat">
          <Calendar size={16} />
          <span>Posted: {formatDate(job.createdAt || job.datePosted)}</span>
        </div>
      </div>

      <div className="myjobs-job-footer">
        <span className="myjobs-created-date">
          Posted on {formatDate(job.createdAt || job.datePosted)}
        </span>
        <div className="myjobs-quick-actions">
          <button 
            onClick={() => handleViewJob(job)}
            className="myjobs-btn myjobs-btn-outline"
          >
            View Details
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

  // Step 10: ΔΙΟΡΘΩΜΕΝΟ Job details modal με salary fix
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
              {/* Basic Job Information */}
              <div className="myjobs-detail-section">
                <h4>Job Information</h4>
                <div className="myjobs-detail-grid">
                  <div>
                    <strong>Company:</strong> {selectedJob.company || 'N/A'}
                  </div>
                  <div>
                    <strong>Location:</strong> {selectedJob.location}
                  </div>
                  <div>
                    <strong>Work Type:</strong> {selectedJob.workType || 'N/A'}
                  </div>
                  <div>
                    <strong>Employment Type:</strong> {selectedJob.type || 'N/A'}
                  </div>
                  <div>
                    <strong>Experience Level:</strong> {selectedJob.experienceLevel || 'N/A'}
                  </div>
                  <div>
                    <strong>Department:</strong> {selectedJob.department || 'N/A'}
                  </div>
                </div>
              </div>
              
              {/* Job Description */}
              {selectedJob.description && (
                <div className="myjobs-detail-section">
                  <h4>Description</h4>
                  <p className="myjobs-detail-text">{selectedJob.description}</p>
                </div>
              )}
              
              {/* Requirements */}
              {selectedJob.requirements && (
                <div className="myjobs-detail-section">
                  <h4>Requirements</h4>
                  <div className="myjobs-detail-text">
                    {selectedJob.requirements.split('\n').map((req, index) => (
                      <p key={index}>{req}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Responsibilities */}
              {selectedJob.responsibilities && (
                <div className="myjobs-detail-section">
                  <h4>Key Responsibilities</h4>
                  <div className="myjobs-detail-text">
                    {selectedJob.responsibilities.split('\n').map((resp, index) => (
                      <p key={index}>{resp}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {selectedJob.skills && (
                <div className="myjobs-detail-section">
                  <h4>Required Skills</h4>
                  <div className="myjobs-skills-tags">
                    {selectedJob.skills.split(',').map((skill, index) => (
                      <span key={index} className="myjobs-skill-tag">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {selectedJob.benefits && (
                <div className="myjobs-detail-section">
                  <h4>Benefits & Perks</h4>
                  <div className="myjobs-benefits-list">
                    {(typeof selectedJob.benefits === 'string' 
                      ? selectedJob.benefits.split(', ') 
                      : selectedJob.benefits || []
                    ).map((benefit, index) => (
                      <span key={index} className="myjobs-benefit-item">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="myjobs-detail-section">
                <h4>Important Dates</h4>
                <div className="myjobs-detail-grid">
                  <div>
                    <strong>Posted:</strong> {formatDate(selectedJob.createdAt)}
                  </div>
                  <div>
                    <strong>Updated:</strong> {formatDate(selectedJob.updatedAt)}
                  </div>
                  {selectedJob.applicationDeadline && (
                    <div>
                      <strong>Application Deadline:</strong> {formatDate(selectedJob.applicationDeadline)}
                    </div>
                  )}
                  {selectedJob.startDate && (
                    <div>
                      <strong>Expected Start Date:</strong> {formatDate(selectedJob.startDate)}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Statistics - FIXED SALARY DISPLAY */}
              <div className="myjobs-detail-section">
                <h4>Statistics</h4>
                <div className="myjobs-stats-grid">
                  <div className="myjobs-stat-item">
                    <span className="myjobs-stat-number">{selectedJob.applicants || 0}</span>
                    <span className="myjobs-stat-label">Applicants</span>
                  </div>
                  <div className="myjobs-stat-item">
                    <span className="myjobs-stat-number">{selectedJob.views || 0}</span>
                    <span className="myjobs-stat-label">Views</span>
                  </div>
                  <div className="myjobs-stat-item">
                    <span className="myjobs-stat-number" style={{fontSize: '1rem', wordBreak: 'break-word', lineHeight: '1.3'}}>{selectedJob.salary || 'Competitive'}</span>
                    <span className="myjobs-stat-label">Salary</span>
                  </div>
                  <div className="myjobs-stat-item">
                    <span className="myjobs-stat-number" style={{fontSize: '1rem', textTransform: 'capitalize'}}>{selectedJob.status || 'active'}</span>
                    <span className="myjobs-stat-label">Status</span>
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
              <Edit3 size={16} />
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

  // Step 11: ΕΝΗΜΕΡΩΜΕΝΟ main render με loading/error states
  return (
    <div className="myjobs-container">
      {/* Header */}
      <div className="myjobs-header">
        <div className="myjobs-header-content">
          <h1>My Job Postings</h1>
          <p>Manage your job postings and track applications</p>
        </div>
        <div className="myjobs-header-actions">
          <button 
            onClick={handleRefresh}
            className="myjobs-btn myjobs-btn-outline"
            disabled={isLoading}
          >
            <RefreshCw size={20} className={isLoading ? 'spinning' : ''} />
            Refresh
          </button>
          <button 
            onClick={onCreateJob}
            className="myjobs-btn myjobs-btn-primary myjobs-create-btn"
          >
            <Plus size={20} />
            Post New Job
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="myjobs-error-message">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button onClick={handleRefresh} className="myjobs-retry-btn">
            Try Again
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="myjobs-loading">
          <RefreshCw size={24} className="spinning" />
          <p>Loading your job postings...</p>
        </div>
      )}

      {/* Content - εμφανίζεται μόνο αν δεν φορτώνει */}
      {!isLoading && (
        <>
          {/* Filters */}
          <div className="myjobs-filters">
            <div className="myjobs-search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search jobs by title, company or department..."
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

          {/* Jobs Summary */}
          <div className="myjobs-summary">
            <div className="myjobs-summary-card">
              <span className="myjobs-summary-number">{jobs.filter(j => !j.status || j.status === 'active').length}</span>
              <span className="myjobs-summary-label">Active Jobs</span>
            </div>
            <div className="myjobs-summary-card">
              <span className="myjobs-summary-number">{jobs.reduce((sum, job) => sum + (job.applicants || 0), 0)}</span>
              <span className="myjobs-summary-label">Total Applications</span>
            </div>
            <div className="myjobs-summary-card">
              <span className="myjobs-summary-number">{jobs.reduce((sum, job) => sum + (job.views || 0), 0)}</span>
              <span className="myjobs-summary-label">Total Views</span>
            </div>
          </div>

          {/* Jobs List */}
          <div className="myjobs-list">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(renderJobCard)
            ) : (
              <div className="myjobs-empty-state">
                <h3>{jobs.length === 0 ? 'No jobs posted yet' : 'No jobs match your filters'}</h3>
                <p>
                  {jobs.length === 0 
                    ? 'Start by posting your first job to attract candidates'
                    : 'Try adjusting your search or filters to see more results'
                  }
                </p>
                {jobs.length === 0 && (
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
        </>
      )}

      {/* Modals */}
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