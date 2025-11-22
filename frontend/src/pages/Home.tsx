import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

export const Home: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect admin users to admin dashboard, regular users to user dashboard
      if (user.is_admin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const dynasties = [
    "Chola", "Chandela", "Pallava", "Chalukya", "Vijayanagara", 
    "Hoysala", "Rashtrakuta", "Ganga", "Maratha", "Gupta",
    "Kakatiya", "Solanki", "Maurya", "Sethupathi", "Eastern Ganga",
    "Somavamsi", "Pandya", "Yadava", "Garhwal", "Mewar"
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">Heritage Museum</div>
        <ul className="nav-links">
          <li><a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }}>Home</a></li>
          <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a></li>
          <li><a href="#dynasties" onClick={(e) => { e.preventDefault(); scrollToSection('dynasties'); }}>Dynasties</a></li>
          <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" id="home">
        <div className="hero-content">
          <div className="hero-badge">
            ✨ Explore 2500 Years of Heritage
          </div>
          
          <h1 className="main-title">
            Indian Temple <span>Heritage</span> Museum
          </h1>
          
          <p className="subtitle">
            Explore 65+ Sacred Temples Spanning 2500 Years of Indian History
          </p>
          
          <p className="description">
            Step into an immersive 3D virtual Tirupati temple room and discover the architectural 
            marvels built by legendary dynasties - from the ancient Mauryas to the mighty Marathas. 
            Experience rich audio stories and stunning visuals of India's most sacred temples.
          </p>
          
          <div className="cta-buttons">
            <button className="btn-large btn-login" onClick={() => setShowLogin(true)}>
              Login
            </button>
            <button className="btn-large btn-register" onClick={() => setShowRegister(true)}>
              Register
            </button>
          </div>

          {/* Stats Section */}
          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-number">65+</div>
              <div className="stat-label">Temples</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">20+</div>
              <div className="stat-label">Dynasties</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">2500</div>
              <div className="stat-label">Years</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">3D</div>
              <div className="stat-label">Immersive</div>
            </div>
          </div>
        </div>
        
        <div className="scroll-indicator"></div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-header">
          <h2 className="section-title">Experience the Divine</h2>
          <p className="section-subtitle">Immersive features that bring ancient temples to life</p>
        </div>
        
        <div className="features">
          <div className="feature-card">
            <span className="feature-icon">🏛️</span>
            <h3>65+ Sacred Temples</h3>
            <p>
              Explore a comprehensive collection of India's most iconic temples, 
              from the magnificent Brihadeeswara to the sacred Tirupati Balaji.
            </p>
          </div>
          
          <div className="feature-card">
            <span className="feature-icon">🎨</span>
            <h3>3D Virtual Experience</h3>
            <p>
              Walk through an immersive 3D recreation of the Tirupati temple room 
              with interactive displays and 360° navigation.
            </p>
          </div>
          
          <div className="feature-card">
            <span className="feature-icon">🎧</span>
            <h3>Audio Narratives</h3>
            <p>
              Listen to rich historical stories and legends behind each temple, 
              bringing ancient history to life through sound.
            </p>
          </div>
          
          <div className="feature-card">
            <span className="feature-icon">👑</span>
            <h3>Dynasty Heritage</h3>
            <p>
              Learn about the great dynasties that built these architectural 
              wonders, from Chola to Vijayanagara empires.
            </p>
          </div>
          
          <div className="feature-card">
            <span className="feature-icon">⚔️</span>
            <h3>Historical Weapons</h3>
            <p>
              Discover the weapons and warfare techniques used during each 
              period of temple construction and defense.
            </p>
          </div>
          
          <div className="feature-card">
            <span className="feature-icon">📜</span>
            <h3>Rich Documentation</h3>
            <p>
              Access detailed information about each temple's builder, time period, 
              architectural style, and historical significance.
            </p>
          </div>
        </div>
      </section>

      {/* Dynasties Section */}
      <section className="dynasties-section" id="dynasties">
        <div className="section-header">
          <h2 className="section-title">Legendary Dynasties</h2>
          <p className="section-subtitle">The great empires that shaped India's temple architecture</p>
        </div>
        
        <div className="dynasties-grid">
          {dynasties.map((dynasty, index) => (
            <div key={index} className="dynasty-tag">
              {dynasty}
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="about-container">
          <div className="about-content">
            <div className="about-text">
              <h2 className="section-title">About This Project</h2>
              <p className="about-description">
                The Indian Temple Heritage Museum is a revolutionary digital platform designed to preserve 
                and showcase India's magnificent temple architecture spanning over 2500 years of history.
              </p>
              <p className="about-description">
                Our mission is to make India's rich cultural and architectural heritage accessible to everyone 
                through cutting-edge 3D technology and immersive storytelling. We've meticulously documented 
                over 65 sacred temples built by legendary dynasties from the ancient Mauryas to the mighty Marathas.
              </p>
              
              <div className="about-features">
                <div className="about-feature-item">
                  <div className="about-icon">🎯</div>
                  <div>
                    <h4>Our Mission</h4>
                    <p>To preserve and promote India's temple heritage through innovative digital experiences</p>
                  </div>
                </div>
                
                <div className="about-feature-item">
                  <div className="about-icon">🏗️</div>
                  <div>
                    <h4>Technology</h4>
                    <p>Built with React, Three.js, and FastAPI for immersive 3D virtual experiences</p>
                  </div>
                </div>
                
                <div className="about-feature-item">
                  <div className="about-icon">📚</div>
                  <div>
                    <h4>Content</h4>
                    <p>Comprehensive historical data, audio narratives, and detailed architectural information</p>
                  </div>
                </div>
                
                <div className="about-feature-item">
                  <div className="about-icon">🌍</div>
                  <div>
                    <h4>Accessibility</h4>
                    <p>Free access to India's heritage from anywhere in the world, anytime</p>
                  </div>
                </div>
              </div>
              
              <div className="about-stats">
                <div className="about-stat">
                  <h3>65+</h3>
                  <p>Temples Documented</p>
                </div>
                <div className="about-stat">
                  <h3>20+</h3>
                  <p>Dynasties Covered</p>
                </div>
                <div className="about-stat">
                  <h3>2500</h3>
                  <p>Years of History</p>
                </div>
                <div className="about-stat">
                  <h3>100%</h3>
                  <p>Free Access</p>
                </div>
              </div>
            </div>
            
            <div className="about-image">
              <div className="about-card">
                <h3>What You'll Discover</h3>
                <ul className="discovery-list">
                  <li>🏛️ Architectural marvels from Dravidian to Nagara styles</li>
                  <li>👑 Stories of great emperors and their divine creations</li>
                  <li>⚔️ Weapons and warfare techniques of each era</li>
                  <li>🎨 Intricate sculptures and artistic traditions</li>
                  <li>📜 Historical significance and cultural impact</li>
                  <li>🎧 Audio narratives bringing history to life</li>
                  <li>🌟 3D virtual tours of temple interiors</li>
                  <li>📸 High-quality images of temple architecture</li>
                </ul>
              </div>
              
              <div className="tech-stack">
                <h4>Built With</h4>
                <div className="tech-badges">
                  <span className="tech-badge">React</span>
                  <span className="tech-badge">TypeScript</span>
                  <span className="tech-badge">Three.js</span>
                  <span className="tech-badge">FastAPI</span>
                  <span className="tech-badge">Python</span>
                  <span className="tech-badge">Vite</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Begin Your Journey?</h2>
        <button className="cta-button" onClick={() => setShowRegister(true)}>
          Start Exploring Now
        </button>
      </section>

      {/* Modals */}
      {showLogin && (
        <div className="modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowLogin(false)}>×</button>
            <LoginForm 
              onSwitchToRegister={() => {
                setShowLogin(false);
                setShowRegister(true);
              }}
              onClose={() => setShowLogin(false)}
            />
          </div>
        </div>
      )}

      {showRegister && (
        <div className="modal-overlay" onClick={() => setShowRegister(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowRegister(false)}>×</button>
            <RegisterForm 
              onSwitchToLogin={() => {
                setShowRegister(false);
                setShowLogin(true);
              }}
              onClose={() => setShowRegister(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
