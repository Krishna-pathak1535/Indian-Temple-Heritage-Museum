import React, { useState } from 'react';
import { userAPI } from '../services/api';
import './FeedbackForm.css';

interface FeedbackFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSuccess, onCancel }) => {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (message.trim().length === 0) {
      setError('Please enter your feedback');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await userAPI.submitFeedback(rating, message);
      setSubmitted(true);

      // Reset form after 2 seconds
      setTimeout(() => {
        setRating(0);
        setMessage('');
        setSubmitted(false);
        onSuccess?.();
      }, 2000);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="feedback-form">
        <div className="feedback-success">
          <div className="success-icon">✓</div>
          <h3>Thank You!</h3>
          <p>Your feedback has been recorded. We appreciate your input!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="feedback-form">
      <h2>📝 Share Your Feedback</h2>
      <p className="feedback-subtitle">Help us improve your museum experience</p>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Rating Section */}
        <div className="form-group">
          <label className="form-label">Rate your experience</label>
          <div className="rating-container">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-btn ${
                  star <= (hoveredRating || rating) ? 'active' : ''
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                aria-label={`Rate ${star} stars`}
              >
                ★
              </button>
            ))}
          </div>
          {rating > 0 && (
            <div className="rating-label">
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </div>
          )}
        </div>

        {/* Message Section */}
        <div className="form-group">
          <label htmlFor="feedback-message" className="form-label">
            Your feedback
          </label>
          <textarea
            id="feedback-message"
            className="feedback-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what you think about the museum experience, content, or any suggestions for improvement..."
            rows={5}
            maxLength={500}
          ></textarea>
          <div className="character-count">
            {message.length}/500
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
          {onCancel && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

// Modal wrapper for FeedbackForm
export const FeedbackModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <FeedbackForm onCancel={onClose} onSuccess={onClose} />
      </div>
    </div>
  );
};
