// VideoReviewModal.jsx - Fixed version με instant state updates

import { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Star, 
  MessageSquare, 
  Timer,
  CheckCircle,
  AlertCircle,
  Volume2,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Calendar
} from 'lucide-react';
import './VideoReviewModal.css';

function VideoReviewModal({ interview, isOpen, onClose, onUpdateRating, onMakeDecision, userInfo }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  // Rating and notes for current question
  const [currentRating, setCurrentRating] = useState(0);
  const [currentNotes, setCurrentNotes] = useState('');
  const [overallNotes, setOverallNotes] = useState('');

  // Early return if no valid data
  if (!interview || !interview.questionsData || interview.questionsData.length === 0) {
    return null;
  }

  const currentQuestion = interview.questionsData[currentQuestionIndex];

  // Initialize with existing data when question changes
  useEffect(() => {
    if (currentQuestion) {
      setCurrentRating(currentQuestion.rating || 0);
      setCurrentNotes(currentQuestion.notes || '');
    }
  }, [currentQuestionIndex, currentQuestion]);

  // Initialize overall notes
  useEffect(() => {
    setOverallNotes(interview.overallNotes || '');
  }, [interview]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // FIXED: Star click handler που ενημερώνει αμέσως το state
  const handleStarClick = (rating) => {
    setCurrentRating(rating);
    // INSTANT UPDATE - ενημέρωσε το κύριο state αμέσως!
    if (onUpdateRating) {
      onUpdateRating(interview.id, currentQuestion.id, rating, currentNotes);
    }
  };

  // FIXED: Notes change handler που ενημερώνει το state
  const handleNotesChange = (notes) => {
    setCurrentNotes(notes);
    // Ενημέρωσε το state αν υπάρχει rating
    if (currentRating > 0 && onUpdateRating) {
      onUpdateRating(interview.id, currentQuestion.id, currentRating, notes);
    }
  };

  // Mock video player handlers
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (time) => {
    setCurrentTime(time);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < interview.questionsData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinishReview = () => {
    onClose();
  };

<<<<<<< HEAD
  const handleDecision = (decision) => {
    if (onMakeDecision) {
      onMakeDecision(interview.id, decision);
    }
    onClose();
  };

  // FIXED: Calculate review progress από το actual interview state
  const reviewProgress = interview.questionsData.filter(q => q.rating > 0).length;
  const totalQuestions = interview.questionsData.length;
  const progressPercentage = (reviewProgress / totalQuestions) * 100;
  const isReviewComplete = reviewProgress === totalQuestions;

=======
// Calculate review progress - ΔΙΟΡΘΩΜΕΝΟ
const reviewProgress = interview?.questionsData?.filter(q => q.rating > 0).length || 0;
const totalQuestions = interview?.questionsData?.length || 7;
const progressPercentage = totalQuestions > 0 ? (reviewProgress / totalQuestions) * 100 : 0;
>>>>>>> 99959e553ce885295c3350d5d386c282bdbd9cbb
  if (!isOpen) return null;

  return (
    <div className="video-interview-overlay">
      <div className="video-interview-modal">
        {/* Modal Header */}
        <div className="video-interview-header">
          <div className="video-interview-title">
            <h2>Interview Review: {interview.candidateInitials}</h2>
<<<<<<< HEAD
            <div className="video-interview-progress">
              <span>{reviewProgress}/{totalQuestions} questions reviewed</span>
              <div className="video-interview-progress-bar">
                <div 
                  className="video-interview-progress-fill"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
=======
         
>>>>>>> 99959e553ce885295c3350d5d386c282bdbd9cbb
          </div>
          <button onClick={onClose} className="video-interview-close">
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="video-interview-content">
          {/* Left Side - Video Player */}
          <div className="video-interview-player-section">
            <div className="video-interview-question-header">
              <div className="video-interview-question-info">
                <span className="video-interview-question-number">Question {currentQuestionIndex + 1} of {totalQuestions}</span>
                <span className={`video-interview-question-type ${currentQuestion.type}`}>
                  {currentQuestion.type === 'custom' ? 'Custom' : currentQuestion.type === 'random' ? 'Random' : 'Standard'}
                </span>
              </div>
              <div className="video-interview-question-duration">
                <Timer size={16} />
                <span>{currentQuestion.duration}</span>
              </div>
            </div>

            <div className="video-interview-question-text">
              <h3>"{currentQuestion.question}"</h3>
            </div>

            {/* Mock Video Player */}
            <div className="video-interview-player">
              <div className="video-interview-screen">
                <div className="video-interview-placeholder">
                  <div className="video-interview-candidate-avatar">
                    {interview.candidateInitials}
                  </div>
                  <p>Video Response</p>
                  <div className="video-interview-duration-display">
                    {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')} / 
                    {currentQuestion.duration}
                  </div>
                </div>
              </div>

              {/* Video Controls */}
              <div className="video-interview-controls">
                <div className="video-interview-controls-main">
                  <button onClick={handlePlayPause} className="video-interview-control-btn video-interview-play-btn">
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  
                  <button 
                    onClick={() => setCurrentTime(Math.max(0, currentTime - 10))} 
                    className="video-interview-control-btn"
                  >
                    <SkipBack size={16} />
                  </button>
                  
                  <button 
                    onClick={() => setCurrentTime(currentTime + 10)} 
                    className="video-interview-control-btn"
                  >
                    <SkipForward size={16} />
                  </button>

                  <div className="video-interview-seek-bar">
                    <input
                      type="range"
                      min="0"
                      max="180"
                      value={currentTime}
                      onChange={(e) => handleSeek(parseInt(e.target.value))}
                      className="video-interview-seek-input"
                    />
                  </div>

                  <div className="video-interview-volume-control">
                    <Volume2 size={16} />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="video-interview-volume-input"
                    />
                  </div>

                  <select 
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                    className="video-interview-speed-select"
                  >
                    <option value="0.5">0.5x</option>
                    <option value="0.75">0.75x</option>
                    <option value="1">1x</option>
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="video-interview-navigation">
              <button 
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                className="video-interview-nav-btn"
              >
                <ChevronLeft size={16} />
                Previous Question
              </button>
              <button 
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === totalQuestions - 1}
                className="video-interview-nav-btn"
              >
                Next Question
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Right Side - Review Panel */}
          <div className="video-interview-review-panel">
            <div className="video-interview-review-section">
              <h4>Rate This Answer</h4>
              <div className="video-interview-rating-stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => handleStarClick(star)}
                    className={`video-interview-star ${star <= currentRating ? 'video-interview-star-active' : ''}`}
                  >
                    <Star size={24} />
                  </button>
                ))}
              </div>
              {currentRating > 0 && (
                <div className="video-interview-rating-text">
                  <span>{currentRating}/5 stars - </span>
                  <span className="video-interview-rating-description">
                    {currentRating >= 5 ? 'Excellent' : 
                     currentRating >= 4 ? 'Good' : 
                     currentRating >= 3 ? 'Average' : 
                     currentRating >= 2 ? 'Below Average' : 'Poor'}
                  </span>
                </div>
              )}
            </div>

            <div className="video-interview-review-section">
              <h4>Notes for this answer</h4>
              <textarea
                value={currentNotes}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Add your thoughts about this answer..."
                className="video-interview-notes-textarea"
                rows="4"
              />
            </div>

            <div className="video-interview-review-section">
              <h4>Quick Assessment</h4>
              <div className="video-interview-quick-tags">
                <button className="video-interview-tag">Clear Communication</button>
                <button className="video-interview-tag">Technical Knowledge</button>
                <button className="video-interview-tag">Problem Solving</button>
                <button className="video-interview-tag">Cultural Fit</button>
                <button className="video-interview-tag">Leadership Potential</button>
                <button className="video-interview-tag">Experience Relevant</button>
              </div>
            </div>

            <div className="video-interview-review-section">
              <h4>All Questions Overview</h4>
              <div className="video-interview-questions-overview">
                {interview.questionsData.map((question, index) => (
                  <div 
                    key={question.id}
                    className={`video-interview-question-item ${index === currentQuestionIndex ? 'active' : ''}`}
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    <div className="video-interview-question-item-header">
                      <span className="video-interview-question-item-number">Q{index + 1}</span>
                      <div className="video-interview-question-item-status">
                        {question.rating > 0 ? (
                          <CheckCircle size={16} color="#28a745" />
                        ) : (
                          <AlertCircle size={16} color="#ffc107" />
                        )}
                      </div>
                    </div>
                    <p className="video-interview-question-item-text">
                      {question.question.length > 50 
                        ? question.question.substring(0, 50) + '...'
                        : question.question
                      }
                    </p>
                    {question.rating > 0 && (
                      <div className="video-interview-question-item-rating">
                        <Star size={12} fill="#fbbf24" color="#fbbf24" />
                        <span>{question.rating}/5</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="video-interview-review-section">
              <h4>Overall Interview Notes</h4>
              <textarea
                value={overallNotes}
                onChange={(e) => setOverallNotes(e.target.value)}
                placeholder="Overall assessment of the candidate..."
                className="video-interview-notes-textarea"
                rows="3"
              />
            </div>
          </div>
        </div>

<<<<<<< HEAD
        {/* Modal Footer - FIXED με working decision buttons */}
        <div className="video-interview-footer">
          <div className="video-interview-stats">
            <span>{reviewProgress}/{totalQuestions} questions reviewed</span>
            {isReviewComplete && (
              <span className="video-interview-complete">
                <CheckCircle size={16} />
                Review Complete
              </span>
            )}
=======
        {/* Modal Footer */}
        <div className="video-review-footer">
          <div className="video-review-stats">
         <span>Interview Review Session</span>
>>>>>>> 99959e553ce885295c3350d5d386c282bdbd9cbb
          </div>
          
          <div className="video-interview-actions">
            <button onClick={onClose} className="video-interview-btn video-interview-btn-outline">
              Save & Continue Later
            </button>
            
            {/* FIXED: Show decision buttons αν έχει progress */}
            {reviewProgress > 0 && (
              <>
                <button 
                  onClick={() => handleDecision('reject')}
                  className="video-interview-btn video-interview-btn-danger"
                >
                  <ThumbsDown size={16} />
                  Reject
                </button>
                <button 
                  onClick={() => handleDecision('schedule_live')}
                  className="video-interview-btn video-interview-btn-warning"
                >
                  <Calendar size={16} />
                  Schedule Live
                </button>
                <button 
                  onClick={() => handleDecision('advance')}
                  className="video-interview-btn video-interview-btn-success"
                >
                  <ThumbsUp size={16} />
                  Advance
                </button>
              </>
            )}
            
            {/* FIXED: Complete Review Button */}
            <button 
              onClick={handleFinishReview}
<<<<<<< HEAD
              className="video-interview-btn video-interview-btn-primary"
              disabled={reviewProgress === 0}
=======
              className="video-btn video-btn-primary"
         disabled={false}
>>>>>>> 99959e553ce885295c3350d5d386c282bdbd9cbb
            >
              <CheckCircle size={16} />
              {isReviewComplete ? 'Complete Review' : `Complete Review (${reviewProgress}/${totalQuestions})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoReviewModal;