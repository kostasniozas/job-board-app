// InterviewReview.jsx - Complete Interview Review Dashboard for Employers

import { useState } from 'react';
import { 
  Play, 
  Clock, 
  Star, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  Calendar,
  User,
  Video,
  Filter,
  Search,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Award,
  Timer
} from 'lucide-react';
import VideoReviewModal from './VideoReviewModal';
import './InterviewReview.css';

function InterviewReview({ userInfo }) {
  // Mock interview submissions data
  const [interviews, setInterviews] = useState([
    {
      id: 1,
      candidateInitials: 'M.K.',
      candidateId: 'candidate_001',
      jobTitle: 'Senior Frontend Developer',
      submittedDate: '2024-02-22',
      status: 'submitted', // submitted, reviewed, decided
      totalQuestions: 7,
      answeredQuestions: 7,
      totalDuration: '12:45',
      averageRating: 0, // 0 means not rated yet
      questionsData: [
        {
          id: 1,
          type: 'custom',
          question: 'Tell us about your experience with React and how you handle state management.',
          duration: '2:15',
          rating: 0,
          notes: '',
          videoUrl: 'mock-video-1.mp4'
        },
        {
          id: 2,
          type: 'custom',
          question: 'Describe a challenging project you worked on and how you overcame obstacles.',
          duration: '3:20',
          rating: 0,
          notes: '',
          videoUrl: 'mock-video-2.mp4'
        },
        {
          id: 3,
          type: 'custom',
          question: 'How do you ensure code quality and what tools do you use for testing?',
          duration: '2:45',
          rating: 0,
          notes: '',
          videoUrl: 'mock-video-3.mp4'
        },
        {
          id: 4,
          type: 'custom',
          question: 'Walk us through your approach to debugging complex frontend issues.',
          duration: '1:50',
          rating: 0,
          notes: '',
          videoUrl: 'mock-video-4.mp4'
        },
        {
          id: 5,
          type: 'random',
          question: 'Tell us about a time you had to learn something new quickly.',
          duration: '1:35',
          rating: 0,
          notes: '',
          videoUrl: 'mock-video-5.mp4'
        },
        {
          id: 6,
          type: 'random',
          question: 'How do you handle tight deadlines and pressure?',
          duration: '1:45',
          rating: 0,
          notes: '',
          videoUrl: 'mock-video-6.mp4'
        },
        {
          id: 7,
          type: 'random',
          question: 'Describe your ideal work environment.',
          duration: '1:15',
          rating: 0,
          notes: '',
          videoUrl: 'mock-video-7.mp4'
        }
      ],
      overallNotes: '',
      decision: null // null, 'advance', 'reject', 'schedule_live'
    },
    {
      id: 2,
      candidateInitials: 'J.A.',
      candidateId: 'candidate_002',
      jobTitle: 'Marketing Manager',
      submittedDate: '2024-02-20',
      status: 'reviewed',
      totalQuestions: 7,
      answeredQuestions: 7,
      totalDuration: '15:30',
      averageRating: 4.2,
      questionsData: [
        {
          id: 1,
          type: 'custom',
          question: 'Describe your experience with digital marketing campaigns.',
          duration: '2:45',
          rating: 4,
          notes: 'Good examples, clear strategy understanding',
          videoUrl: 'mock-video-1.mp4'
        },
        {
          id: 2,
          type: 'custom',
          question: 'How do you measure marketing campaign success?',
          duration: '3:10',
          rating: 5,
          notes: 'Excellent knowledge of KPIs and analytics',
          videoUrl: 'mock-video-2.mp4'
        },
        {
          id: 3,
          type: 'random',
          question: 'Tell us about a time you had to learn something new quickly.',
          duration: '2:15',
          rating: 4,
          notes: 'Good adaptability example',
          videoUrl: 'mock-video-3.mp4'
        },
        {
          id: 4,
          type: 'random',
          question: 'How do you handle tight deadlines and pressure?',
          duration: '2:00',
          rating: 4,
          notes: 'Clear examples provided',
          videoUrl: 'mock-video-4.mp4'
        },
        {
          id: 5,
          type: 'custom',
          question: 'What marketing tools and platforms do you prefer?',
          duration: '2:30',
          rating: 5,
          notes: 'Comprehensive knowledge of modern tools',
          videoUrl: 'mock-video-5.mp4'
        },
        {
          id: 6,
          type: 'random',
          question: 'Describe your ideal work environment.',
          duration: '1:45',
          rating: 3,
          notes: 'Standard response',
          videoUrl: 'mock-video-6.mp4'
        },
        {
          id: 7,
          type: 'custom',
          question: 'How do you stay updated with marketing trends?',
          duration: '1:15',
          rating: 4,
          notes: 'Good resources mentioned',
          videoUrl: 'mock-video-7.mp4'
        }
      ],
      overallNotes: 'Excellent communication skills and strategic thinking. Strong cultural fit.',
      decision: 'advance'
    },
    {
      id: 3,
      candidateInitials: 'D.N.',
      candidateId: 'candidate_004',
      jobTitle: 'Senior Frontend Developer',
      submittedDate: '2024-02-21',
      status: 'submitted',
      totalQuestions: 7,
      answeredQuestions: 6,
      totalDuration: '10:20',
      averageRating: 0,
      questionsData: [
        {
          id: 1,
          type: 'custom',
          question: 'Explain your experience with React hooks.',
          duration: '1:45',
          rating: 0,
          notes: '',
          videoUrl: 'mock-video-1.mp4'
        },
        {
          id: 2,
          type: 'custom',
          question: 'How do you handle state management in large applications?',
          duration: '2:20',
          rating: 0,
          notes: '',
          videoUrl: 'mock-video-2.mp4'
        },
        {
          id: 3,
          type: 'random',
          question: 'Tell us about a time you had to learn something new quickly.',
          duration: '1:35',
          rating: 0,
          notes: '',
          videoUrl: 'mock-video-3.mp4'
        },
        {
          id: 4,
          type: 'custom',
          question: 'What testing frameworks do you prefer and why?',
          duration: '2:10',
          rating: 0,
          notes: '',
          videoUrl: 'mock-video-4.mp4'
        },
        {
          id: 5,
          type: 'random',
          question: 'How do you handle tight deadlines and pressure?',
          duration: '1:50',
          rating: 0,
          notes: '',
          videoUrl: 'mock-video-5.mp4'
        },
        {
          id: 6,
          type: 'custom',
          question: 'Describe your approach to code reviews.',
          duration: '0:50',
          rating: 0,
          notes: '',
          videoUrl: 'mock-video-6.mp4'
        },
        {
          id: 7,
          type: 'random',
          question: 'Describe your ideal work environment.',
          duration: '0:00', // Not answered
          rating: 0,
          notes: '',
          videoUrl: null
        }
      ],
      overallNotes: '',
      decision: null
    }
  ]);

  // State management
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter interviews
  const filteredInterviews = interviews.filter(interview => {
    const matchesStatus = statusFilter === 'all' || interview.status === statusFilter;
    const matchesSearch = interview.candidateInitials.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         interview.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Handle interview actions
  const handleReviewInterview = (interview) => {
    setSelectedInterview(interview);
    setShowVideoModal(true);
  };

  const handleMakeDecision = (interviewId, decision) => {
    setInterviews(prev => prev.map(interview =>
      interview.id === interviewId 
        ? { ...interview, decision, status: 'decided' }
        : interview
    ));
  };

  const handleUpdateRating = (interviewId, questionId, rating, notes) => {
    setInterviews(prev => prev.map(interview => {
      if (interview.id === interviewId) {
        const updatedQuestions = interview.questionsData.map(q =>
          q.id === questionId ? { ...q, rating, notes } : q
        );
        const ratedQuestions = updatedQuestions.filter(q => q.rating > 0);
        const avgRating = ratedQuestions.length > 0 
          ? ratedQuestions.reduce((sum, q) => sum + q.rating, 0) / ratedQuestions.length 
          : 0;
        return {
          ...interview,
          questionsData: updatedQuestions,
          averageRating: avgRating,
          status: ratedQuestions.length > 0 ? 'reviewed' : 'submitted'
        };
      }
      return interview;
    }));
  };

  // Get status badge class
  const getStatusBadge = (status, decision) => {
    if (decision === 'advance') return 'interview-status-advanced';
    if (decision === 'reject') return 'interview-status-rejected';
    if (decision === 'schedule_live') return 'interview-status-scheduled';
    
    switch (status) {
      case 'submitted': return 'interview-status-pending';
      case 'reviewed': return 'interview-status-reviewed';
      case 'decided': return 'interview-status-decided';
      default: return 'interview-status-default';
    }
  };

  const getStatusText = (status, decision) => {
    if (decision === 'advance') return 'Advanced to Next Round';
    if (decision === 'reject') return 'Rejected';
    if (decision === 'schedule_live') return 'Live Interview Scheduled';
    
    switch (status) {
      case 'submitted': return 'Awaiting Review';
      case 'reviewed': return 'Reviewed - Pending Decision';
      case 'decided': return 'Decision Made';
      default: return 'Unknown';
    }
  };

  // Get button text based on status
  const getReviewButtonText = (interview) => {
    if (interview.status === 'submitted') {
      return 'Start Review';
    } else if (interview.status === 'reviewed') {
      return 'View Review';
    } else {
      return 'Review Interview';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="interview-review-container">
      {/* Header */}
      <div className="interview-review-header">
        <div className="interview-review-header-content">
          <h1>Interview Reviews</h1>
          <p>Review video interview submissions and make hiring decisions</p>
        </div>
        
        <div className="interview-review-stats">
          <div className="interview-stat-card">
            <span className="interview-stat-number">{interviews.filter(i => i.status === 'submitted').length}</span>
            <span className="interview-stat-label">Pending Review</span>
          </div>
          <div className="interview-stat-card">
            <span className="interview-stat-number">{interviews.filter(i => i.status === 'reviewed').length}</span>
            <span className="interview-stat-label">Reviewed</span>
          </div>
          <div className="interview-stat-card">
            <span className="interview-stat-number">{interviews.filter(i => i.decision === 'advance').length}</span>
            <span className="interview-stat-label">Advanced</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="interview-review-filters">
        <div className="interview-search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by candidate or job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="interview-search-input"
          />
        </div>

        <div className="interview-filter-group">
          <Filter size={20} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="interview-filter-select"
          >
            <option value="all">All Status</option>
            <option value="submitted">Pending Review</option>
            <option value="reviewed">Reviewed</option>
            <option value="decided">Decided</option>
          </select>
        </div>
      </div>

      {/* Interview List */}
      <div className="interview-review-list">
        {filteredInterviews.length > 0 ? (
          filteredInterviews.map(interview => (
            <div key={interview.id} className="interview-review-card">
              {/* Card Header */}
              <div className="interview-card-header">
                <div className="interview-candidate-info">
                  <div className="interview-candidate-avatar">
                    {interview.candidateInitials}
                  </div>
                  <div className="interview-candidate-details">
                    <h3 className="interview-candidate-name">
                      Candidate {interview.candidateInitials}
                    </h3>
                    <p className="interview-job-title">{interview.jobTitle}</p>
                    <div className="interview-submission-info">
                      <Calendar size={14} />
                      <span>Submitted on {formatDate(interview.submittedDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="interview-status-section">
                  <span className={`interview-status-badge ${getStatusBadge(interview.status, interview.decision)}`}>
                    {getStatusText(interview.status, interview.decision)}
                  </span>
                  {interview.averageRating > 0 && (
                    <div className="interview-rating-display">
                      <Star size={16} fill="#fbbf24" color="#fbbf24" />
                      <span>{interview.averageRating.toFixed(1)}/5</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="interview-card-body">
                <div className="interview-metrics">
                  <div className="interview-metric">
                    <Video size={16} />
                    <span>{interview.answeredQuestions}/{interview.totalQuestions} questions answered</span>
                  </div>
                  <div className="interview-metric">
                    <Timer size={16} />
                    <span>{interview.totalDuration} total duration</span>
                  </div>
                  <div className="interview-metric">
                    <User size={16} />
                    <span>Profile ID: {interview.candidateId}</span>
                  </div>
                </div>

                {interview.overallNotes && (
                  <div className="interview-notes-preview">
                    <MessageSquare size={16} />
                    <span>"{interview.overallNotes}"</span>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="interview-card-footer">
                <div className="interview-actions">
                  <button
                    onClick={() => handleReviewInterview(interview)}
                    className="interview-btn interview-btn-primary"
                  >
                    <Play size={16} />
                    {getReviewButtonText(interview)}
                  </button>

                  {/* Show decision buttons only if NOT decided yet and status is reviewed */}
                  {interview.status === 'reviewed' && !interview.decision && (
                    <>
                      <button
                        onClick={() => handleMakeDecision(interview.id, 'advance')}
                        className="interview-btn interview-btn-success"
                      >
                        <ThumbsUp size={16} />
                        Advance
                      </button>
                      <button
                        onClick={() => handleMakeDecision(interview.id, 'schedule_live')}
                        className="interview-btn interview-btn-outline"
                      >
                        <Calendar size={16} />
                        Schedule Live
                      </button>
                      <button
                        onClick={() => handleMakeDecision(interview.id, 'reject')}
                        className="interview-btn interview-btn-danger"
                      >
                        <ThumbsDown size={16} />
                        Reject
                      </button>
                    </>
                  )}

                  {/* Show decision result if already decided */}
                  {interview.decision && (
                    <div className="interview-decision-display">
                      {interview.decision === 'advance' && <Award size={16} color="#28a745" />}
                      {interview.decision === 'reject' && <XCircle size={16} color="#dc3545" />}
                      {interview.decision === 'schedule_live' && <Calendar size={16} color="#007bff" />}
                      <span>{getStatusText(interview.status, interview.decision)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="interview-empty-state">
            <Video size={48} />
            <h3>No interviews found</h3>
            <p>
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No video interviews have been submitted yet'
              }
            </p>
          </div>
        )}
      </div>

      {/* Video Review Modal - ENHANCED with onMakeDecision prop */}
      {showVideoModal && selectedInterview && (
        <VideoReviewModal
          interview={selectedInterview}
          isOpen={showVideoModal}
          onClose={() => {
            setShowVideoModal(false);
            setSelectedInterview(null);
          }}
          onUpdateRating={handleUpdateRating}
          onMakeDecision={handleMakeDecision}
          userInfo={userInfo}
        />
      )}
    </div>
  );
}

export default InterviewReview;