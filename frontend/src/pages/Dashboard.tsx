import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleEnterTemple = () => {
    navigate('/temple-room');
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackError('');
    
    if (feedbackRating === 0) {
      setFeedbackError('Please select a rating');
      return;
    }
    
    if (!feedbackMessage.trim()) {
      setFeedbackError('Please enter your feedback message');
      return;
    }

    try {
      await userAPI.submitFeedback(feedbackRating, feedbackMessage);
      setFeedbackSuccess(true);
      setTimeout(() => {
        setShowFeedback(false);
        setFeedbackSuccess(false);
        setFeedbackRating(0);
        setFeedbackMessage('');
      }, 2000);
    } catch (err) {
      setFeedbackError('Failed to submit feedback. Please try again.');
    }
  };

  const features = [
    {
      icon: '🎨',
      title: '360° 3D Environment',
      description: 'Navigate freely through the virtual temple room with realistic graphics',
      color: '#FF6B6B'
    },
    {
      icon: '🏛️',
      title: 'Dynasty-wise Displays',
      description: 'Temples organized by their ruling dynasties in concentric circles',
      color: '#4ECDC4'
    },
    {
      icon: '🎧',
      title: 'Audio Storytelling',
      description: 'Click on any temple to hear its rich history and significance',
      color: '#FFE66D'
    },
    {
      icon: '📜',
      title: 'Detailed Information',
      description: 'Learn about builders, weapons, architecture, and historical context',
      color: '#95E1D3'
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Animated Background Elements */}
      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
        <div className="shape shape-5"></div>
      </div>

      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <span className="logo-icon">🕉️</span>
            <h1 className="site-title">Temple Heritage Museum</h1>
          </div>
          <div className="user-section">
            <div className="user-info">
              <span className="user-icon">👤</span>
              <span className="user-email">{user?.email}</span>
            </div>
            <button className="btn-logout" onClick={logout}>
              <span>Logout</span>
              <span className="logout-icon">→</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`dashboard-main ${isVisible ? 'visible' : ''}`}>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h2 className="hero-title">
              <span className="title-line">Discover India's</span>
              <span className="title-highlight">Sacred Heritage</span>
            </h2>
            <p className="hero-subtitle">
              Embark on an immersive 3D journey through 2500+ years of temple architecture,
              exploring 65+ magnificent temples, 15 sacred weapons, and 15 divine animals from 15+ royal dynasties
            </p>
            
            <button className="btn-enter-temple" onClick={handleEnterTemple}>
              <span className="btn-bg-effect"></span>
              <span className="btn-content">
                <span className="btn-icon">🕉️</span>
                <span className="btn-text">ENTER TIRUPATI HERITAGE ROOM</span>
                <span className="btn-arrow">→</span>
              </span>
            </button>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card stat-card-1">
              <div className="stat-icon">🏛️</div>
              <div className="stat-content">
                <div className="stat-number">65</div>
                <div className="stat-label">SACRED TEMPLES</div>
              </div>
              <div className="stat-decoration"></div>
            </div>
            
            <div className="stat-card stat-card-2">
              <div className="stat-icon">⚔️</div>
              <div className="stat-content">
                <div className="stat-number">15</div>
                <div className="stat-label">ANCIENT WEAPONS</div>
              </div>
              <div className="stat-decoration"></div>
            </div>
            
            <div className="stat-card stat-card-3">
              <div className="stat-icon">🦁</div>
              <div className="stat-content">
                <div className="stat-number">15</div>
                <div className="stat-label">DIVINE ANIMALS</div>
              </div>
              <div className="stat-decoration"></div>
            </div>
            
            <div className="stat-card stat-card-1">
              <div className="stat-icon">👑</div>
              <div className="stat-content">
                <div className="stat-number">15+</div>
                <div className="stat-label">ROYAL DYNASTIES</div>
              </div>
              <div className="stat-decoration"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h3 className="section-title">
            <span className="title-decoration">✦</span>
            Experience Features
            <span className="title-decoration">✦</span>
          </h3>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="feature-card"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  '--feature-color': feature.color 
                } as React.CSSProperties}
              >
                <div className="feature-icon-wrapper">
                  <div className="feature-icon">{feature.icon}</div>
                </div>
                <h4 className="feature-title">{feature.title}</h4>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-glow" style={{ background: feature.color }}></div>
              </div>
            ))}
          </div>
        </section>

        {/* Highlights Section */}
        <section className="highlights-section">
          <div className="highlights-grid">
            <div className="highlight-card">
              <div className="highlight-header">
                <span className="highlight-icon">🗺️</span>
                <h4>Interactive Navigation</h4>
              </div>
              <p>Use mouse controls to orbit, zoom, and explore every corner of the virtual temple room</p>
            </div>
            
            <div className="highlight-card">
              <div className="highlight-header">
                <span className="highlight-icon">🔊</span>
                <h4>Rich Audio Content</h4>
              </div>
              <p>Immersive storytelling with detailed narrations about each temple's history and significance</p>
            </div>
            
            <div className="highlight-card">
              <div className="highlight-header">
                <span className="highlight-icon">�</span>
                <h4>Visual Documentation</h4>
              </div>
              <p>High-quality images and detailed information panels for comprehensive learning</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>© 2025 Indian Temple Heritage Museum - Preserving Sacred History Through Technology</p>
        <button className="btn-feedback" onClick={() => setShowFeedback(true)}>
          💬 Send Feedback
        </button>
      </footer>

      {/* Feedback Modal */}
      {showFeedback && (
        <div className="feedback-modal-overlay" onClick={() => setShowFeedback(false)}>
          <div className="feedback-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowFeedback(false)}>×</button>
            
            <h2>📝 Share Your Feedback</h2>
            <p className="modal-subtitle">Help us improve your museum experience</p>

            {feedbackSuccess ? (
              <div className="feedback-success">
                <div className="success-icon">✓</div>
                <h3>Thank You!</h3>
                <p>Your feedback has been submitted successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="feedback-form">
                <div className="form-group">
                  <label>Rate Your Experience</label>
                  <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`star-btn ${feedbackRating >= star ? 'active' : ''}`}
                        onClick={() => setFeedbackRating(star)}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Your Feedback</label>
                  <textarea
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    placeholder="Tell us about your experience..."
                    rows={5}
                    required
                  />
                </div>

                {feedbackError && (
                  <div className="feedback-error">{feedbackError}</div>
                )}

                <button type="submit" className="btn-submit-feedback">
                  Submit Feedback
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
