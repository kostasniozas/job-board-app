// Candidates.jsx - UPDATED for Visual Consistency with JobSeeker Dashboard

import { useState } from 'react';
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
  Send
} from 'lucide-react';
import './Candidates.css';

function Candidates({ userInfo }) {
  // Step 1: Privacy-compliant candidates state - PRESERVED EXACTLY
  const [candidates, setCandidates] = useState([
    {
      id: 1,
      initials: 'M.K.',
      profileId: 'candidate_001',
      appliedFor: 'Senior Frontend Developer',
      appliedDate: '2024-02-20',
      status: 'pending',
      interviewStatus: 'not_requested', // not_requested, requested, questions_sent, completed, reviewed
      rating: 0, // Changed to 0 - unrated
      experience: '5 years',
      education: 'Computer Science Degree',
      location: 'Athens, Greece',
      skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'CSS'],
      summary: 'Experienced frontend developer with expertise in React and modern web technologies. Passionate about creating user-friendly interfaces.',
      portfolioPreview: 'Available upon request',
      lastActive: '2 days ago'
    },
    {
      id: 2,
      initials: 'J.A.',
      profileId: 'candidate_002',
      appliedFor: 'Marketing Manager',
      appliedDate: '2024-02-18',
      status: 'approved',
      interviewStatus: 'completed',
      rating: 5,
      experience: '3 years',
      education: 'Marketing Degree',
      location: 'Thessaloniki, Greece',
      skills: ['Digital Marketing', 'SEO', 'Social Media', 'Analytics', 'Content Creation'],
      summary: 'Creative marketing professional with proven track record in digital campaigns and brand growth.',
      portfolioPreview: 'Available upon request',
      lastActive: '1 day ago'
    },
    {
      id: 3,
      initials: 'S.P.',
      profileId: 'candidate_003',
      appliedFor: 'UX Designer',
      appliedDate: '2024-02-15',
      status: 'rejected',
      interviewStatus: 'not_requested',
      rating: 3,
      experience: '2 years',
      education: 'Design Degree',
      location: 'Athens, Greece',
      skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'UI Design'],
      summary: 'Junior UX designer with strong foundation in user-centered design principles and modern design tools.',
      portfolioPreview: 'Available upon request',
      lastActive: '5 days ago'
    },
    {
      id: 4,
      initials: 'D.N.',
      profileId: 'candidate_004',
      appliedFor: 'Senior Frontend Developer',
      appliedDate: '2024-02-22',
      status: 'pending',
      interviewStatus: 'questions_sent',
      rating: 4,
      experience: '4 years',
      education: 'Computer Engineering Degree',
      location: 'Patras, Greece',
      skills: ['React', 'Python', 'Django', 'PostgreSQL', 'AWS'],
      summary: 'Full-stack developer with experience in both frontend and backend technologies. Strong problem-solving skills.',
      portfolioPreview: 'Available upon request',
      lastActive: '12 hours ago'
    }
  ]);

  // Step 2: ALL STATE PRESERVED EXACTLY
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [jobFilter, setJobFilter] = useState('all');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showCandidateDetails, setShowCandidateDetails] = useState(false);
  const [hoveredStar, setHoveredStar] = useState({ candidateId: null, star: 0 });
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewCandidate, setInterviewCandidate] = useState(null);
  const [customQuestions, setCustomQuestions] = useState(['', '', '', '']);

  // Step 3: ALL FUNCTIONALITY PRESERVED EXACTLY
  const randomQuestionsPool = [
    "Tell us about a challenging project you've worked on recently.",
    "How do you handle tight deadlines and pressure?",
    "Describe your ideal work environment.",
    "What motivates you in your professional life?",
    "How do you stay updated with industry trends?",
    "Tell us about a time you had to learn something new quickly.",
    "How do you handle constructive criticism?",
    "What's your approach to teamwork and collaboration?",
    "Describe a mistake you made and how you handled it.",
    "Where do you see yourself in 5 years?",
    "How do you prioritize your work when you have multiple tasks?",
    "Tell us about a time you went above and beyond in your role."
  ];

  const uniqueJobs = [...new Set(candidates.map(c => c.appliedFor))];

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.initials.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.appliedFor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
    const matchesJob = jobFilter === 'all' || candidate.appliedFor === jobFilter;
    return matchesSearch && matchesStatus && matchesJob;
  });

  // Step 4: ALL HANDLER FUNCTIONS PRESERVED EXACTLY
  const handleViewCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setShowCandidateDetails(true);
  };

  const handleApproveCandidate = (candidateId) => {
    setCandidates(prev => prev.map(candidate => 
      candidate.id === candidateId ? { ...candidate, status: 'approved' } : candidate
    ));
  };

  const handleRejectCandidate = (candidateId) => {
    setCandidates(prev => prev.map(candidate => 
      candidate.id === candidateId ? { ...candidate, status: 'rejected' } : candidate
    ));
  };

  const handleRequestInterview = (candidate) => {
    setInterviewCandidate(candidate);
    setCustomQuestions(['', '', '', '']);
    setShowInterviewModal(true);
  };

  const handleSendInterviewQuestions = () => {
    if (customQuestions.some(q => q.trim() === '')) {
      alert('Please fill in all 4 custom questions.');
      return;
    }

    const shuffled = [...randomQuestionsPool].sort(() => 0.5 - Math.random());
    const randomQuestions = shuffled.slice(0, 3);
    
    setCandidates(prev => prev.map(candidate => 
      candidate.id === interviewCandidate.id 
        ? { ...candidate, interviewStatus: 'questions_sent' } 
        : candidate
    ));

    const allQuestions = [...customQuestions, ...randomQuestions];
    console.log('Interview questions sent:', allQuestions);
    
    alert(`Video interview request sent to ${interviewCandidate.initials}!\n\nQuestions included:\n${allQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`);
    
    setShowInterviewModal(false);
    setInterviewCandidate(null);
  };

  const handleRateCandidate = (candidateId, rating) => {
    setCandidates(prev => prev.map(candidate => 
      candidate.id === candidateId ? { ...candidate, rating } : candidate
    ));
  };

  // Step 5: ALL UTILITY FUNCTIONS PRESERVED EXACTLY
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return 'candidates-status-pending';
      case 'approved':
        return 'candidates-status-approved';
      case 'rejected':
        return 'candidates-status-rejected';
      default:
        return 'candidates-status-default';
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

  // Step 6: RATING FUNCTION PRESERVED EXACTLY
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
            disabled={!interactive}
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

  // Step 7: CANDIDATE CARD FUNCTION PRESERVED EXACTLY
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
                {candidate.experience}
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

          <div className="candidates-summary">
            <p>{candidate.summary}</p>
          </div>

          <div className="candidates-education-info">
            <strong>Education:</strong> {candidate.education}
          </div>
        </div>

        <div className="candidates-card-footer">
          <div className="candidates-actions">
            <button 
              onClick={() => handleViewCandidate(candidate)}
              className="candidates-btn candidates-btn-outline"
            >
              <Eye size={16} />
              View Details
            </button>
            
            {candidate.interviewStatus === 'not_requested' && (
              <button 
                onClick={() => handleRequestInterview(candidate)}
                className={`candidates-btn candidates-interview-btn ${interviewStatus.className}`}
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
                >
                  <CheckCircle size={16} />
                  Approve
                </button>
                <button 
                  onClick={() => handleRejectCandidate(candidate.id)}
                  className="candidates-btn candidates-btn-danger"
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

  // Step 8: INTERVIEW MODAL PRESERVED EXACTLY
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
                <div><strong>Experience:</strong> {interviewCandidate.experience}</div>
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

            <div className="interview-card">
              <h3>Sample Random Questions (3 will be selected):</h3>
              <ul className="interview-preview-list">
                {randomQuestionsPool.slice(0, 6).map((question, index) => (
                  <li key={index}>{question}</li>
                ))}
                <li><em>...and {randomQuestionsPool.length - 6} more</em></li>
              </ul>
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
              disabled={customQuestions.some(q => q.trim() === '')}
            >
              <Send size={16} />
              Send Interview Request
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Step 9: CANDIDATE DETAILS MODAL PRESERVED EXACTLY
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
                  <span>{selectedCandidate.experience} experience</span>
                </div>
                <div className="candidates-detail-item">
                  <GraduationCap size={16} />
                  <span>{selectedCandidate.education}</span>
                </div>
                <div className="candidates-detail-item">
                  <MapPin size={16} />
                  <span>{selectedCandidate.location}</span>
                </div>
              </div>
            </div>

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

            <div className="candidates-detail-section">
              <h4>
                <MessageSquare size={16} />
                Summary
              </h4>
              <p>{selectedCandidate.summary}</p>
            </div>

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

  // Step 10: MAIN RENDER - UPDATED HEADER ONLY, EVERYTHING ELSE PRESERVED
  return (
    <div className="candidates-container">
      {/* ✅ UPDATED: Header with gradient background like other components */}
      <div className="candidates-header">
        <div className="candidates-header-content">
          <h1>Candidate Applications</h1>
          <p>Review applications while respecting candidate privacy</p>
        </div>
      </div>

      {/* ✅ PRESERVED: All filters exactly as before */}
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

      {/* ✅ PRESERVED: Summary cards exactly as before */}
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

      {/* ✅ PRESERVED: Candidates list exactly as before */}
      <div className="candidates-list">
        {filteredCandidates.length > 0 ? (
          filteredCandidates.map(renderCandidateCard)
        ) : (
          <div className="candidates-empty-state">
            <h3>No candidates found</h3>
            <p>
              {searchTerm || statusFilter !== 'all' || jobFilter !== 'all'
                ? 'Try adjusting your search or filters' 
                : 'No applications received yet'
              }
            </p>
          </div>
        )}
      </div>

      {/* ✅ PRESERVED: All modals exactly as before */}
      {renderInterviewModal()}
      {showCandidateDetails && renderCandidateDetails()}
    </div>
  );
}

export default Candidates;