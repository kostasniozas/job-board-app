// VideoReviewModal.jsx - Advanced Video Review Interface

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
  Maximize2,
  RotateCcw
} from 'lucide-react';
import './VideoReviewModal.css';

function VideoReviewModal({ interview, isOpen, onClose, onUpdateRating, userInfo }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  // Rating and notes for current question
  const [currentRating, setCurrentRating] = useState(0);
  const [currentNotes, setCurrentNotes] = useState('');
  const [overallNotes, setOverallNotes] = useState(interview.overallNotes || '');

  const currentQuestion = interview?.questionsData?.[currentQuestionIndex];

  // Initialize with existing data
  useEffect(() => {
    if (currentQuestion) {
      setCurrentRating(currentQuestion.rating || 0);
      setCurrentNotes(currentQuestion.notes || '');
    }
  }, [currentQuestionIndex, currentQuestion]);

  // Early return if no valid data
  if (!interview || !interview.questionsData || interview.questionsData.length === 0) {
    return null;
  }

  // Mock video player handlers (in real app, these would control actual video)
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In real implementation: videoRef.current.play() or pause()
  };

  const handleSeek = (time) => {
    setCurrentTime(time);
    // In real implementation: videoRef.current.currentTime = time
  };

  const handleNextQuestion = () => {
    saveCurrentRating();
    if (currentQuestionIndex < interview.questionsData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    saveCurrentRating();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const saveCurrentRating = () => {
    if (currentRating > 0 || currentNotes.trim()) {
      onUpdateRating(interview.id, currentQuestion.id, currentRating, currentNotes);
    }
  };

  const handleStarClick = (rating) => {
    setCurrentRating(rating);
  };

  const handleNotesChange = (notes) => {
    setCurrentNotes(notes);
  };

  const handleFinishReview = () => {
    saveCurrentRating();
    // Save overall notes and close
    onClose();
  };

// Calculate review progress - ΔΙΟΡΘΩΜΕΝΟ
const reviewProgress = interview?.questionsData?.filter(q => q.rating > 0).length || 0;
const totalQuestions = interview?.questionsData?.length || 7;
const progressPercentage = totalQuestions > 0 ? (reviewProgress / totalQuestions) * 100 : 0;
  if (!isOpen) return null;

  return (
    <div className="video-review-overlay">
      <div className="video-review-modal">
        {/* Modal Header */}
        <div className="video-review-header">
          <div className="video-review-title">
            <h2>Interview Review: {interview.candidateInitials}</h2>
         
          </div>
          <button onClick={onClose} className="video-review-close">
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="video-review-content">
          {/* Left Side - Video Player */}
          <div className="video-player-section">
            <div className="video-question-header">
              <div className="video-question-info">
                <span className="video-question-number">Question {currentQuestionIndex + 1} of {totalQuestions}</span>
                <span className={`video-question-type ${currentQuestion.type}`}>
                  {currentQuestion.type === 'custom' ? 'Custom' : 'Standard'}
                </span>
              </div>
              <div className="video-question-duration">
                <Timer size={16} />
                <span>{currentQuestion.duration}</span>
              </div>
            </div>

            <div className="video-question-text">
              <h3>"{currentQuestion.question}"</h3>
            </div>

            {/* Mock Video Player */}
            <div className="video-player">
              <div className="video-screen">
                <div className="video-placeholder">
                  <div className="video-candidate-avatar">
                    {interview.candidateInitials}
                  </div>
                  <p>Video Response</p>
                  <div className="video-duration-display">
                    {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')} / 
                    {currentQuestion.duration}
                  </div>
                </div>
              </div>

              {/* Video Controls */}
              <div className="video-controls">
                <div className="video-controls-main">
                  <button onClick={handlePlayPause} className="video-control-btn video-play-btn">
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  
                  <button onClick={handlePrevQuestion} className="video-control-btn" disabled={currentQuestionIndex === 0}>
                    <SkipBack size={16} />
                  </button>
                  
                  <button onClick={handleNextQuestion} className="video-control-btn" disabled={currentQuestionIndex === totalQuestions - 1}>
                    <SkipForward size={16} />
                  </button>

                  <div className="video-seek-bar">
                    <input
                      type="range"
                      min="0"
                      max="180"
                      value={currentTime}
                      onChange={(e) => handleSeek(parseInt(e.target.value))}
                      className="video-seek-input"
                    />
                  </div>

                  <div className="video-volume-control">
                    <Volume2 size={16} />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="video-volume-input"
                    />
                  </div>

                  <select 
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                    className="video-speed-select"
                  >
                    <option value="0.5">0.5x</option>
                    <option value="0.75">0.75x</option>
                    <option value="1">1x</option>
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.5x</option>
                    <option value="2">2x</option>
                  </select>

                  <button className="video-control-btn">
                    <Maximize2 size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="video-navigation">
              <button 
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                className="video-nav-btn video-nav-prev"
              >
                <SkipBack size={16} />
                Previous Question
              </button>
              <button 
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === totalQuestions - 1}
                className="video-nav-btn video-nav-next"
              >
                Next Question
                <SkipForward size={16} />
              </button>
            </div>
          </div>

          {/* Right Side - Review Panel */}
          <div className="video-review-panel">
            <div className="video-review-section">
              <h4>Rate This Answer</h4>
              <div className="video-rating-stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => handleStarClick(star)}
                    className={`video-star ${star <= currentRating ? 'video-star-active' : ''}`}
                  >
                    <Star size={24} />
                  </button>
                ))}
              </div>
              {currentRating > 0 && (
                <div className="video-rating-text">
                  <span>{currentRating}/5 stars - </span>
                  <span className="video-rating-description">
                    {currentRating >= 5 ? 'Excellent' : 
                     currentRating >= 4 ? 'Good' : 
                     currentRating >= 3 ? 'Average' : 
                     currentRating >= 2 ? 'Below Average' : 'Poor'}
                  </span>
                </div>
              )}
            </div>

            <div className="video-review-section">
              <h4>Notes for this answer</h4>
              <textarea
                value={currentNotes}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Add your thoughts about this answer..."
                className="video-notes-textarea"
                rows="4"
              />
            </div>

            <div className="video-review-section">
              <h4>Quick Assessment</h4>
              <div className="video-quick-tags">
                <button className="video-tag">Clear Communication</button>
                <button className="video-tag">Technical Knowledge</button>
                <button className="video-tag">Problem Solving</button>
                <button className="video-tag">Cultural Fit</button>
                <button className="video-tag">Leadership Potential</button>
                <button className="video-tag">Experience Relevant</button>
              </div>
            </div>

            <div className="video-review-section">
              <h4>All Questions Overview</h4>
              <div className="video-questions-overview">
                {interview.questionsData.map((question, index) => (
                  <div 
                    key={question.id}
                    className={`video-question-item ${index === currentQuestionIndex ? 'active' : ''}`}
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    <div className="video-question-item-header">
                      <span className="video-question-item-number">Q{index + 1}</span>
                      <div className="video-question-item-status">
                        {question.rating > 0 ? (
                          <CheckCircle size={16} color="#28a745" />
                        ) : (
                          <AlertCircle size={16} color="#ffc107" />
                        )}
                      </div>
                    </div>
                    <p className="video-question-item-text">
                      {question.question.length > 50 
                        ? question.question.substring(0, 50) + '...'
                        : question.question
                      }
                    </p>
                    {question.rating > 0 && (
                      <div className="video-question-item-rating">
                        <Star size={12} fill="#fbbf24" color="#fbbf24" />
                        <span>{question.rating}/5</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="video-review-section">
              <h4>Overall Interview Notes</h4>
              <textarea
                value={overallNotes}
                onChange={(e) => setOverallNotes(e.target.value)}
                placeholder="Overall assessment of the candidate..."
                className="video-notes-textarea"
                rows="3"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="video-review-footer">
          <div className="video-review-stats">
         <span>Interview Review Session</span>
          </div>
          
          <div className="video-review-actions">
            <button onClick={onClose} className="video-btn video-btn-outline">
              Save & Continue Later
            </button>
            <button 
              onClick={handleFinishReview}
              className="video-btn video-btn-primary"
         disabled={false}
            >
              <CheckCircle size={16} />
              Complete Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoReviewModal;