// Candidates.jsx - Real Backend Integration

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle,
  XCircle,
  Clock,
  User,
  Briefcase,
  GraduationCap,
  Mail,
  Calendar,
  Star,
  MessageSquare,
  UserCheck,
  MapPin,
  Video,
  Send,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { applicationsAPI } from '../../services/api';
import './Candidates.css';

function Candidates({ userInfo }) {
  // Real backend states
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // UI states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState('all');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showCandidateDetails, setShowCandidateDetails] = useState(false);
  const [hoveredStar, setHoveredStar] = useState({ candidateId: null, star: 0 });
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewCandidate, setInterviewCandidate] = useState(null);
  const [customQuestions, setCustomQuestions] = useState(['', '', '', '']);

  // Load candidates data from backend
  const loadCandidates = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Loading candidates from backend...');
      
      const response = await applicationsAPI.getEmployerApplications();
      console.log('Candidates response:', response);
      
      if (response.success) {
        setCandidates(response.applications || []);
        console.log(`Loaded ${response.applications?.length || 0} candidates`);
      } else {
        setError(response.message || 'Failed to load candidates');
        setCandidates([]);
      }
    } catch (err) {
      console.error('Error loading candidates:', err);
      setError(err.message || 'Failed to load candidates. Please try again.');
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  // Load candidates on component mount
  useEffect(() => {
    loadCandidates();
  }, []);

  // Backend integration functions
  const handleApproveCandidate = async (candidateId) => {
    try {
      console.log(`Approving candidate ${candidateId}`);
      const response = await applicationsAPI.updateApplicationStatus(candidateId, 'approved');
      
      if (response.success) {
        setCandidates(prev => prev.map(candidate => 
          candidate.id === candidateId ? { ...candidate, status: 'approved' } : candidate
        ));
        console.log('Candidate approved successfully');
      } else {
        alert(response.message || 'Failed to approve candidate');
      }
    } catch (error) {
      console.error('Error approving candidate:', error);
      alert('Failed to approve candidate. Please try again.');
    }
  };

  const handleRejectCandidate = async (candidateId) => {
    try {
      console.log(`Rejecting candidate ${candidateId}`);
      const response = await applicationsAPI.updateApplicationStatus(candidateId, 'rejected');
      
      if (response.success) {
        setCandidates(prev => prev.map(candidate => 
          candidate.id === candidateId ? { ...candidate, status: 'rejected' } : candidate
        ));
        console.log('Candidate rejected successfully');
      } else {
        alert(response.message || 'Failed to reject candidate');
      }
    } catch (error) {
      console.error('Error rejecting candidate:', error);
      alert('Failed to reject candidate. Please try again.');
    }
  };

  const handleRateCandidate = async (candidateId, rating) => {
    try {
      console.log(`Rating candidate ${candidateId} with ${rating} stars`);
      const response = await applicationsAPI.rateCandidate(candidateId, rating);
      
      if (response.success) {
        setCandidates(prev => prev.map(candidate => 
          candidate.id === candidateId ? { ...candidate, rating } : candidate
        ));
        console.log('Candidate rated successfully');
      } else {
        alert(response.message || 'Failed to rate candidate');
      }
    } catch (error) {
      console.error('Error rating candidate:', error);
      alert('Failed to rate candidate. Please try again.');
    }
  };

  const handleSendInterviewQuestions = async () => {
    if (customQuestions.some(q => q.trim() === '')) {
      alert('Please fill in all 4 custom questions.');
      return;
    }

    try {
      const randomQuestions = [
        "Tell us about a challenging project you've worked on recently.",
        "How do you handle tight deadlines and pressure?",
        "Describe your ideal work environment.",
        "What motivates you in your professional life?",
        "How do you stay updated with industry trends?"
      ].slice(0, 3); // Take 3 random questions

      const allQuestions = [...customQuestions, ...randomQuestions];
      
      console.log(`Sending interview questions to candidate ${interviewCandidate.id}`);
      const response = await applicationsAPI.sendInterviewQuestions(interviewCandidate.id, allQuestions);
      
      if (response.success) {
        setCandidates(prev => prev.map(candidate => 
          candidate.id === interviewCandidate.id 
            ? { ...candidate, interviewStatus: 'questions_sent' } 
            : candidate
        ));
        
        alert(`Video interview request sent to ${interviewCandidate.initials}!\n\nQuestions included:\n${allQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`);
        setShowInterviewModal(false);
        setInterviewCandidate(null);
      } else {
        alert(response.message || 'Failed to send interview questions');
      }
    } catch (error) {
      console.error('Error sending interview questions:', error);
      alert('Failed to send interview questions. Please try again.');
    }
  };

  // Utility functions (unchanged)
  const uniqueJobs = [...new Set(candidates.map(c => c.appliedFor))];

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.initials.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.appliedFor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (candidate.skills && candidate.skills.some(skill => 
                           skill.toLowerCase().includes(searchTerm.toLowerCase())
                         ));
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
    const matchesJob = jobFilter === 'all' || candidate.appliedFor === jobFilter;
    return matchesSearch && matchesStatus && matchesJob;
  });

  const handleViewCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setShowCandidateDetails(true);
  };

  const handleRequestInterview = (candidate) => {
    setInterviewCandidate(candidate);
    setCustomQuestions(['', '', '', '']);
    setShowInterviewModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return 'candidates-status-pending';
      case 'approved': return 'candidates-status-approved';
      case 'rejected': return 'candidates-status-rejected';
      default: return 'candidates-status-default';
    }
  };

  const getInterviewStatusDisplay = (interviewStatus) => {
    switch (interviewStatus) {
      case 'not_requested':
        return { text: 'Request Interview', icon: Video, className: 'candidates-interview-request' };
      case 'questions_sent':
        return { text: 'Questions Sent', icon: Send, className: 'candidates-interview-pending' };
      case 'completed':
        return { text: 'Interview Done', icon: CheckCircle, className: 'candidates-interview-completed' };
      case 'reviewed':
        return { text: 'Interview Reviewed', icon: Star, className: 'candidates-interview-reviewed' };
      default:
        return { text: 'Request Interview', icon: Video, className: 'candidates-interview-request' };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderRating = (rating, candidateId, interactive = false) => {
    const isHovering = hoveredStar.candidateId === candidateId;
    const displayRating = isHovering ? hoveredStar.star : rating;

    return (
      <div className="candidates-rating">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            onClick={interactive ? () => handleRateCandidate(candidateId, star) : undefined}
            onMouseEnter={interactive ? () => setHoveredStar({ candidateId, star }) : undefined}
            onMouseLeave={interactive ? () => setHoveredStar({ candidateId: null, star: 0 }) : undefined}
            className={`candidates-star ${
              star <= displayRating ? 'active' : ''
            } ${interactive ? 'interactive' : ''}`}
            disabled={!interactive || loading}
            title={interactive ? `Rate ${star} star${star !== 1 ? 's' : ''}` : ''}
          >
            <Star size={16} />
          </button>
        ))}
        {interactive && rating > 0 && (
          <span className="candidates-rating-text">
            {rating}/5
          </span>
        )}
      </div>
    );
  };

  const renderCandidateCard = (candidate) => {
    const interviewStatus = getInterviewStatusDisplay(candidate.interviewStatus);
    const InterviewIcon = interviewStatus.icon;

    return (
      <div key={candidate.id} className="candidates-card">
        <div className="candidates-card-header">
          <div className="candidates-avatar">
            {candidate.initials}
          </div>
          <div className="candidates-info">
            <h3 className="candidates-name">Candidate {candidate.initials}</h3>
            <p className="candidates-title">Applied for {candidate.appliedFor}</p>
            <div className="candidates-meta">
              <span className="candidates-location">
                <MapPin size={14} />
                {candidate.location}
              </span>
              <span className="candidates-experience">
                <Briefcase size={14} />
                {candidate.experience || 'Experience not specified'}
              </span>
              <span className="candidates-last-active">
                <Clock size={14} />
                Active {candidate.lastActive}
              </span>
            </div>
          </div>
          <div className="candidates-status-section">
            <span className={`candidates-status-badge ${getStatusBadge(candidate.status)}`}>
              {candidate.status}
            </span>
            {renderRating(candidate.rating, candidate.id, true)}
          </div>
        </div>

        <div className="candidates-card-body">
          <div className="candidates-applied-info">
            <div className="candidates-applied-job">
              <strong>Application Date:</strong> {formatDate(candidate.appliedDate)}
            </div>
            <div className="candidates-profile-id">
              <strong>Profile ID:</strong> {candidate.profileId}
            </div>
          </div>

          {candidate.skills && candidate.skills.length > 0 && (
            <div className="candidates-skills">
              <strong>Skills:</strong>
              <div className="candidates-skills-tags">
                {candidate.skills.slice(0, 4).map(skill => (
                  <span key={skill} className="candidates-skill-tag">{skill}</span>
                ))}
                {candidate.skills.length > 4 && (
                  <span className="candidates-skill-more">+{candidate.skills.length - 4} more</span>
                )}
              </div>
            </div>
          )}

          {candidate.summary && (
            <div className="candidates-summary">
              <p>{candidate.summary}</p>
            </div>
          )}

          <div className="candidates-education-info">
            <strong>Education:</strong> {candidate.education || 'Not specified'}
          </div>

          {candidate.coverLetter && (
            <div className="candidates-cover-letter">
              <strong>Cover Letter:</strong>
              <p>{candidate.coverLetter.substring(0, 150)}{candidate.coverLetter.length > 150 ? '...' : ''}</p>
            </div>
          )}
        </div>

        <div className="candidates-card-footer">
          <div className="candidates-actions">
            <button 
              onClick={() => handleViewCandidate(candidate)}
              className="candidates-btn candidates-btn-outline"
              disabled={loading}
            >
              <Eye size={16} />
              View Details
            </button>
            
            {candidate.interviewStatus === 'not_requested' && (
              <button 
                onClick={() => handleRequestInterview(candidate)}
                className={`candidates-btn candidates-interview-btn ${interviewStatus.className}`}
                disabled={loading}
              >
                <InterviewIcon size={16} />
                {interviewStatus.text}
              </button>
            )}
            
            {candidate.interviewStatus !== 'not_requested' && (
              <span className={`candidates-interview-status ${interviewStatus.className}`}>
                <InterviewIcon size={16} />
                {interviewStatus.text}
              </span>
            )}

            {candidate.status === 'pending' && (
              <>
                <button 
                  onClick={() => handleApproveCandidate(candidate.id)}
                  className="candidates-btn candidates-btn-success"
                  disabled={loading}
                >
                  <CheckCircle size={16} />
                  Approve
                </button>
                <button 
                  onClick={() => handleRejectCandidate(candidate.id)}
                  className="candidates-btn candidates-btn-danger"
                  disabled={loading}
                >
                  <XCircle size={16} />
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Interview Modal (unchanged structure, updated handler)
  const renderInterviewModal = () => {
    if (!showInterviewModal || !interviewCandidate) return null;

    return (
      <div className="interview-modal-overlay" onClick={() => setShowInterviewModal(false)}>
        <div className="interview-modal" onClick={(e) => e.stopPropagation()}>
          <div className="interview-modal-header">
            <h2>
              <Video size={24} />
              Video Interview Request
            </h2>
            <button 
              onClick={() => setShowInterviewModal(false)}
              className="interview-close-btn"
            >
              ×
            </button>
          </div>
          
          <div className="interview-modal-content">
            <div className="interview-card">
              <h3>Candidate Information</h3>
              <div className="interview-info-grid">
                <div><strong>Candidate:</strong> {interviewCandidate.initials}</div>
                <div><strong>Position:</strong> {interviewCandidate.appliedFor}</div>
                <div><strong>Experience:</strong> {interviewCandidate.experience || 'Not specified'}</div>
              </div>
            </div>

            <div className="interview-card">
              <h3>How it works:</h3>
              <ul className="interview-steps">
                <li>You provide 4 custom questions specific to this role</li>
                <li>We add 3 random professional questions</li>
                <li>Candidate receives 7 questions total for video response</li>
                <li>You review their video answers when ready</li>
              </ul>
            </div>

            <div className="interview-card">
              <h3>Your 4 Custom Questions:</h3>
              <div className="interview-questions">
                {customQuestions.map((question, index) => (
                  <div key={index} className="interview-question">
                    <label>Question {index + 1}:</label>
                    <textarea
                      value={question}
                      onChange={(e) => {
                        const newQuestions = [...customQuestions];
                        newQuestions[index] = e.target.value;
                        setCustomQuestions(newQuestions);
                      }}
                      placeholder={`Enter your custom question ${index + 1}...`}
                      className="interview-textarea"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="interview-modal-footer">
            <button 
              onClick={() => setShowInterviewModal(false)}
              className="interview-btn interview-btn-cancel"
            >
              Cancel
            </button>
            <button 
              onClick={handleSendInterviewQuestions}
              className="interview-btn interview-btn-primary"
              disabled={customQuestions.some(q => q.trim() === '') || loading}
            >
              <Send size={16} />
              Send Interview Request
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Candidate Details Modal (unchanged structure)
  const renderCandidateDetails = () => {
    if (!selectedCandidate) return null;

    return (
      <div className="candidates-modal-overlay" onClick={() => setShowCandidateDetails(false)}>
        <div className="candidates-modal candidates-details-modal" onClick={(e) => e.stopPropagation()}>
          <div className="candidates-modal-header">
            <div className="candidates-modal-title">
              <h2>Candidate Details</h2>
              <span className={`candidates-status-badge ${getStatusBadge(selectedCandidate.status)}`}>
                {selectedCandidate.status}
              </span>
            </div>
            <button 
              onClick={() => setShowCandidateDetails(false)}
              className="candidates-close-btn"
            >
              ×
            </button>
          </div>
          
          <div className="candidates-modal-content">
            <div className="candidates-detail-header">
              <div className="candidates-detail-avatar">
                {selectedCandidate.initials}
              </div>
              <div className="candidates-detail-info">
                <h3>Candidate {selectedCandidate.initials}</h3>
                <p>{selectedCandidate.appliedFor}</p>
              </div>
            </div>

            <div className="candidates-detail-grid">
              <div className="candidates-detail-section">
                <h4>
                  <Calendar size={16} />
                  Application Info
                </h4>
                <div className="candidates-detail-item">
                  <Calendar size={16} />
                  <span>Applied: {formatDate(selectedCandidate.appliedDate)}</span>
                </div>
                <div className="candidates-detail-item">
                  <Clock size={16} />
                  <span>Last Active: {selectedCandidate.lastActive}</span>
                </div>
              </div>

              <div className="candidates-detail-section">
                <h4>
                  <Briefcase size={16} />
                  Professional Info
                </h4>
                <div className="candidates-detail-item">
                  <Briefcase size={16} />
                  <span>{selectedCandidate.experience || 'Experience not specified'}</span>
                </div>
                <div className="candidates-detail-item">
                  <GraduationCap size={16} />
                  <span>{selectedCandidate.education || 'Education not specified'}</span>
                </div>
                <div className="candidates-detail-item">
                  <MapPin size={16} />
                  <span>{selectedCandidate.location}</span>
                </div>
              </div>
            </div>

            {selectedCandidate.skills && selectedCandidate.skills.length > 0 && (
              <div className="candidates-detail-section">
                <h4>
                  <User size={16} />
                  Skills
                </h4>
                <div className="candidates-skills-full">
                  {selectedCandidate.skills.map(skill => (
                    <span key={skill} className="candidates-skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {selectedCandidate.summary && (
              <div className="candidates-detail-section">
                <h4>
                  <MessageSquare size={16} />
                  Summary
                </h4>
                <p>{selectedCandidate.summary}</p>
              </div>
            )}

            {selectedCandidate.coverLetter && (
              <div className="candidates-detail-section">
                <h4>
                  <Mail size={16} />
                  Cover Letter
                </h4>
                <p>{selectedCandidate.coverLetter}</p>
              </div>
            )}

            <div className="candidates-detail-section">
              <h4>
                <Star size={16} />
                Rating
              </h4>
              {renderRating(selectedCandidate.rating, selectedCandidate.id, true)}
            </div>
          </div>
          
          <div className="candidates-modal-footer">
            <div className="candidates-modal-actions">
              {selectedCandidate.interviewStatus === 'not_requested' && (
                <button 
                  onClick={() => {
                    setShowCandidateDetails(false);
                    handleRequestInterview(selectedCandidate);
                  }}
                  className="candidates-btn candidates-btn-primary"
                  disabled={loading}
                >
                  <Video size={16} />
                  Request Interview
                </button>
              )}
              <button 
                onClick={() => setShowCandidateDetails(false)}
                className="candidates-btn candidates-btn-outline"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div className="candidates-container">
      {/* Header with refresh button */}
      <div className="candidates-header">
        <div className="candidates-header-content">
          <h1>Candidate Applications</h1>
          <p>Review applications while respecting candidate privacy</p>
        </div>
        <button 
          className="btn btn-outline"
          onClick={loadCandidates}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            background: 'rgba(255,255,255,0.1)',
            border: '2px solid rgba(255,255,255,0.3)',
            color: 'white',
            borderRadius: '12px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          <RefreshCw size={16} className={loading ? 'spinning' : ''} />
          Refresh
        </button>
      </div>

      {/* Error message */}
      {error && (
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
          <span>{error}</span>
          <button 
            onClick={loadCandidates} 
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

      {/* Loading state */}
      {loading && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          padding: '40px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          marginBottom: '20px'
        }}>
          <RefreshCw size={20} className="spinning" />
          <span>Loading candidates...</span>
        </div>
      )}

      {/* Filters */}
      <div className="candidates-filters">
        <div className="candidates-search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by initials, skills, or job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="candidates-search-input"
          />
        </div>
        
        <div className="candidates-filter-group">
          <Filter size={20} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="candidates-filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            className="candidates-filter-select"
          >
            <option value="all">All Jobs</option>
            {uniqueJobs.map(job => (
              <option key={job} value={job}>{job}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="candidates-summary">
        <div className="candidates-summary-card">
          <span className="candidates-summary-number">{candidates.filter(c => c.status === 'pending').length}</span>
          <span className="candidates-summary-label">Pending Review</span>
        </div>
        <div className="candidates-summary-card">
          <span className="candidates-summary-number">{candidates.filter(c => c.status === 'approved').length}</span>
          <span className="candidates-summary-label">Approved</span>
        </div>
        <div className="candidates-summary-card">
          <span className="candidates-summary-number">{candidates.filter(c => c.interviewStatus === 'completed').length}</span>
          <span className="candidates-summary-label">Interviews Done</span>
        </div>
        <div className="candidates-summary-card">
          <span className="candidates-summary-number">{candidates.length}</span>
          <span className="candidates-summary-label">Total Applications</span>
        </div>
      </div>

      {/* Candidates list */}
      <div className="candidates-list">
        {!loading && filteredCandidates.length > 0 ? (
          filteredCandidates.map(renderCandidateCard)
        ) : !loading ? (
          <div className="candidates-empty-state">
            <h3>No candidates found</h3>
            <p>
              {candidates.length === 0 
                ? 'No applications received yet. When job seekers apply for your jobs, they will appear here.' 
                : searchTerm || statusFilter !== 'all' || jobFilter !== 'all'
                ? 'Try adjusting your search or filters' 
                : 'No candidates match your criteria'
              }
            </p>
          </div>
        ) : null}
      </div>

      {/* Modals */}
      {renderInterviewModal()}
      {showCandidateDetails && renderCandidateDetails()}
    </div>
  );
}

export default Candidates;