// DeleteJobModal.jsx - Delete Job Confirmation Modal

import { X, AlertTriangle, Trash2 } from 'lucide-react';
import './DeleteJobModal.css';

function DeleteJobModal({ job, isOpen, onClose, onConfirm, isDeleting = false }) {
  if (!isOpen || !job) return null;

  const handleConfirm = () => {
    onConfirm(job.id);
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  return (
    <div className="deletejob-modal-overlay" onClick={handleClose}>
      <div className="deletejob-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="deletejob-modal-header">
          <div className="deletejob-warning-icon">
            <AlertTriangle size={24} />
          </div>
          <h2 className="deletejob-modal-title">Delete Job Posting</h2>
          <button 
            onClick={handleClose}
            className="deletejob-close-btn"
            disabled={isDeleting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="deletejob-modal-content">
          <div className="deletejob-job-info">
            <div className="deletejob-job-card">
              <h3 className="deletejob-job-title">{job.title}</h3>
              <div className="deletejob-job-meta">
                <span className="deletejob-department">{job.department}</span>
                <span className="deletejob-separator">•</span>
                <span className="deletejob-location">{job.location}</span>
                <span className="deletejob-separator">•</span>
                <span className="deletejob-applicants">{job.applicants} applicants</span>
              </div>
            </div>
          </div>

          <div className="deletejob-warning-content">
            <p className="deletejob-warning-text">
              Are you sure you want to delete this job posting? This action cannot be undone.
            </p>
            
            <div className="deletejob-consequences">
              <h4>This will permanently:</h4>
              <ul className="deletejob-consequences-list">
                <li>Remove the job posting from all listings</li>
                <li>Delete all applicant data for this position</li>
                <li>Remove associated analytics and statistics</li>
                <li>Cancel any pending interviews or communications</li>
              </ul>
            </div>

            {job.applicants > 0 && (
              <div className="deletejob-applicant-warning">
                <AlertTriangle size={16} />
                <span>
                  <strong>Warning:</strong> This job has {job.applicants} applicant{job.applicants !== 1 ? 's' : ''}. 
                  Consider closing the job instead of deleting it.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="deletejob-modal-footer">
          <button 
            type="button"
            onClick={handleClose}
            className="deletejob-btn deletejob-btn-outline"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={handleConfirm}
            className="deletejob-btn deletejob-btn-danger"
            disabled={isDeleting}
          >
            <Trash2 size={16} />
            {isDeleting ? 'Deleting...' : 'Delete Job'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteJobModal;