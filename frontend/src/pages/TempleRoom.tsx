import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { TemplesScene } from '../scenes/TemplesScene';
import { WeaponsScene } from '../scenes/WeaponsScene';
import { FossilsScene } from '../scenes/FossilsScene';
import { SketchfabViewer } from '../components/SketchfabViewer';
import { contentAPI, userAPI } from '../services/api';
import { Temple, Weapon, Fossil } from '../types';
import { useNavigate } from 'react-router-dom';
import './TempleRoom.css';

type CategoryType = 'temples' | 'weapons' | 'fossils' | null;

export const TempleRoom: React.FC = () => {
  const [temples, setTemples] = useState<Temple[]>([]);
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [fossils, setFossils] = useState<Fossil[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(null);
  const [selectedItem, setSelectedItem] = useState<Temple | Weapon | Fossil | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  // Track initial visit to temple room
  useEffect(() => {
    const trackInitialVisit = async () => {
      try {
        await userAPI.trackVisit('temples');
        console.log('Temple room visit tracked');
      } catch (err) {
        console.error('Failed to track visit:', err);
      }
    };
    trackInitialVisit();
  }, []);

  useEffect(() => {
    const fetchAllContent = async () => {
      try {
        // Load all three categories in parallel
        const [templesData, weaponsData, fossilsData] = await Promise.all([
          contentAPI.getAllTemples(),
          contentAPI.getAllWeapons(),
          contentAPI.getAllFossils()
        ]);
        
        setTemples(templesData);
        setWeapons(weaponsData);
        setFossils(fossilsData);
        setLoading(false);
        
        console.log('Loaded content:', {
          temples: templesData.length,
          weapons: weaponsData.length,
          fossils: fossilsData.length
        });
      } catch (err) {
        console.error('Error loading content:', err);
        setError('Failed to load museum content');
        setLoading(false);
      }
    };

    fetchAllContent();
  }, []);

  const playAudio = (category: CategoryType, audioUrl: string) => {
    if (!category) return;
    
    // Stop current audio if playing
    stopAudio();
    
    const fullAudioUrl = contentAPI.getAudioURL(category, audioUrl);
    const audio = new Audio(fullAudioUrl);
    audioRef.current = audio;
    
    audio.play().catch((err) => {
      console.error('Audio play failed:', err);
    });
    
    setAudioPlaying(true);
    
    audio.onended = () => {
      setAudioPlaying(false);
    };
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAudioPlaying(false);
    }
  };

  const handleItemClick = (item: Temple | Weapon | Fossil, category: CategoryType) => {
    setSelectedItem(item);
    if (category) {
      playAudio(category, (item as any).audio_story_url);
    }
  };

  const handleCategorySelect = async (category: CategoryType) => {
    setCategoryLoading(true);
    
    // Track visit to the selected room
    if (category) {
      try {
        await userAPI.trackVisit(category);
        console.log(`${category} room visit tracked`);
      } catch (err) {
        console.error('Failed to track visit:', err);
      }
    }
    
    // Slightly longer delay to ensure smooth scene loading
    setTimeout(() => {
      setSelectedCategory(category);
      setCategoryLoading(false);
    }, 300); // Increased from 100ms to 300ms for better UX
  };

  const closeItemModal = () => {
    setSelectedItem(null);
    stopAudio();
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading Temple Heritage Museum...</p>
        <p className="loading-details">Temples • Weapons • Fossils</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <p>{error}</p>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="temple-room-container">
      {/* Category Loading Overlay */}
      {categoryLoading && (
        <div className="category-loading-overlay">
          <div className="loader-spinner"></div>
          <p>Loading category...</p>
        </div>
      )}

      {/* Category Selection View - Modernized */}
      {!selectedCategory && !categoryLoading && (
        <div className="category-selection-overlay modern-indian-bg">
          <div className="category-header">
            <h1 className="indian-title-gradient">Indian Temple Heritage Museum</h1>
            <p className="indian-subtitle">Select a category to explore</p>
            <button className="btn-back-overlay" onClick={() => navigate('/dashboard')}>
              ← Back to Dashboard
            </button>
          </div>
          <div className="category-grid">
            <div className="category-card modern-card" onClick={() => handleCategorySelect('temples')}>
              <div className="category-icon-svg">
                <img src="/images/temple_icon.svg" alt="Sacred Temples" style={{width:'64px',height:'64px'}} />
              </div>
              <h2 className="modern-card-title">Sacred Temples</h2>
              <p className="modern-card-count">{temples.length} Ancient Temples</p>
              <div className="category-description modern-card-desc">
                Explore magnificent temples from various Indian dynasties
              </div>
            </div>
            <div className="category-card modern-card" onClick={() => handleCategorySelect('weapons')}>
              <div className="category-icon-svg">
                <img src="/images/weapon_icon.svg" alt="Ancient Weapons" style={{width:'64px',height:'64px'}} />
              </div>
              <h2 className="modern-card-title">Ancient Weapons</h2>
              <p className="modern-card-count">{weapons.length} Historical Weapons</p>
              <div className="category-description modern-card-desc">
                Discover the legendary weapons used by warriors
              </div>
            </div>
            <div className="category-card modern-card" onClick={() => handleCategorySelect('fossils')}>
              <div className="category-icon-svg">
                <img src="/images/fossil_icon.svg" alt="Ancient Fossils" style={{width:'64px',height:'64px'}} />
              </div>
              <h2 className="modern-card-title">Ancient Fossils</h2>
              <p className="modern-card-count">{fossils.length} Paleontological Specimens</p>
              <div className="category-description modern-card-desc">
                Explore prehistoric fossils from India's ancient past
              </div>
            </div>
            <div className="category-card modern-card quiz-card" onClick={() => navigate('/game')}>
              <div className="category-icon-svg quiz-icon">
                🎮
              </div>
              <h2 className="modern-card-title">Quiz Challenge</h2>
              <p className="modern-card-count">Test Your Knowledge</p>
              <div className="category-description modern-card-desc">
                Challenge yourself with interactive quizzes about temples, weapons, and fossils
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3D Scene with Category Content */}
      {selectedCategory && (
        <>
          {/* Back Button - Top Right */}
          <button className="btn-back-category-right" onClick={() => {
            setSelectedCategory(null);
            closeItemModal();
          }}>
            ← Back to Categories
          </button>
          
          {/* Category Info - Top Center */}
          <div className="controls-info">
            <div className="current-category">
              {selectedCategory === 'temples' && `🏛️ Sacred Temples (${temples.length})`}
              {selectedCategory === 'weapons' && `⚔️ Ancient Weapons (${weapons.length})`}
              {selectedCategory === 'fossils' && `� Ancient Fossils (${fossils.length})`}
            </div>
            <p>🖱️ Click and drag to look around | 🎯 Click on displays to learn more</p>
          </div>
          
          <Canvas
            camera={{ position: [0, 5, 15], fov: 75 }}
            gl={{ 
              antialias: true, 
              alpha: false, 
              powerPreference: 'high-performance',
              stencil: false,
              depth: true
            }}
            dpr={[1, 1.5]} // Reduced pixel ratio for better performance
            shadows={false} // Disable shadows for better performance
            frameloop="always" // Always render for smooth animations
            performance={{ min: 0.5 }} // Allow frame rate to drop for performance
          >
            <Suspense fallback={null}>
              {selectedCategory === 'temples' && (
                <TemplesScene 
                  temples={temples} 
                  onItemClick={handleItemClick}
                />
              )}
              {selectedCategory === 'weapons' && (
                <WeaponsScene 
                  weapons={weapons} 
                  onItemClick={handleItemClick}
                />
              )}
              {selectedCategory === 'fossils' && (
                <FossilsScene 
                  fossils={fossils} 
                  onItemClick={handleItemClick}
                />
              )}
            </Suspense>
          </Canvas>

          {/* Item Detail Modal */}
          {selectedItem && (
            <div className="temple-modal-overlay" onClick={closeItemModal}>
              <div className={`temple-info-panel ${(selectedCategory === 'temples' || selectedCategory === 'weapons' || selectedCategory === 'fossils') && 'model_3d_embed' in selectedItem && selectedItem.model_3d_embed ? 'temple-info-panel-large' : ''}`} onClick={(e) => e.stopPropagation()}>
                <button className="close-btn-panel" onClick={closeItemModal}>×</button>
                
                {'name' in selectedItem && (
                  <div className="temple-info-content">
                    <h2>{selectedItem.name}</h2>
                    
                    {/* 3D Model or Image for all categories */}
                    {'model_3d_embed' in selectedItem && selectedItem.model_3d_embed ? (
                      <div className="item-3d-container">
                        <SketchfabViewer 
                          modelId={selectedItem.model_3d_embed}
                          title={selectedItem.name}
                        />
                      </div>
                    ) : selectedCategory ? (
                      <div className="item-image-container">
                        <img 
                          src={contentAPI.getImageURL(selectedCategory, 
                            (selectedItem as any).static_image_url || (selectedItem as any).image_url
                          )} 
                          alt={selectedItem.name}
                          className="item-image"
                          loading="lazy"
                          onError={(e) => {
                            console.error('Image failed to load:', e);
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    ) : null}
                    
                    {/* Temple specific fields */}
                    {selectedCategory === 'temples' && 'dynasty' in selectedItem && (
                      <>
                        <div className="info-grid">
                          <div className="info-item">
                            <strong>👑 Dynasty:</strong>
                            <span>{selectedItem.dynasty}</span>
                          </div>
                          <div className="info-item">
                            <strong>🏗️ Builder:</strong>
                            <span>{selectedItem.builder}</span>
                          </div>
                          <div className="info-item">
                            <strong>📅 Period:</strong>
                            <span>{selectedItem.time_period}</span>
                          </div>
                          <div className="info-item">
                            <strong>⚔️ Weapons:</strong>
                            <span>{selectedItem.weapon_used}</span>
                          </div>
                        </div>
                        <div className="significance-section">
                          <strong>📜 Historical Significance:</strong>
                          <p>{selectedItem.historical_significance}</p>
                        </div>
                      </>
                    )}

                    {/* Weapon specific fields */}
                    {selectedCategory === 'weapons' && 'type' in selectedItem && (
                      <>
                        <div className="info-grid">
                          <div className="info-item">
                            <strong>🗡️ Type:</strong>
                            <span>{selectedItem.type}</span>
                          </div>
                          <div className="info-item">
                            <strong>👑 Dynasty Context:</strong>
                            <span>{Array.isArray(selectedItem.dynasty_context) 
                              ? selectedItem.dynasty_context.join(', ') 
                              : selectedItem.dynasty_context}</span>
                          </div>
                        </div>
                        <div className="significance-section">
                          <strong>📜 Description:</strong>
                          <p>{selectedItem.description}</p>
                        </div>
                      </>
                    )}

                    {/* Fossil specific fields */}
                    {selectedCategory === 'fossils' && 'fossil_type' in selectedItem && (
                      <>
                        <div className="info-grid">
                          <div className="info-item">
                            <strong>🦴 Type:</strong>
                            <span>{selectedItem.fossil_type}</span>
                          </div>
                          <div className="info-item">
                            <strong>⏳ Era:</strong>
                            <span>{selectedItem.era}</span>
                          </div>
                          <div className="info-item">
                            <strong>📅 Age:</strong>
                            <span>{selectedItem.age_in_years}</span>
                          </div>
                          <div className="info-item">
                            <strong>📍 Origin:</strong>
                            <span>{selectedItem.origin_location}</span>
                          </div>
                        </div>
                        <div className="significance-section">
                          <strong>� Description:</strong>
                          <p>{selectedItem.description}</p>
                        </div>
                      </>
                    )}

                    <div className="audio-controls">
                      {audioPlaying ? (
                        <button onClick={stopAudio} className="audio-btn playing">
                          🔊 Stop Audio Story
                        </button>
                      ) : (
                        <button onClick={() => selectedCategory && playAudio(
                          selectedCategory, 
                          (selectedItem as any).audio_story_url
                        )} className="audio-btn">
                          🎧 Play Audio Story
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
