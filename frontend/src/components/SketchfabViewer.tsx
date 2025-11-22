import React, { useState } from 'react';
import './SketchfabViewer.css';

interface SketchfabViewerProps {
  modelId: string;
  title: string;
  autospin?: boolean;
}

export const SketchfabViewer: React.FC<SketchfabViewerProps> = ({ 
  modelId, 
  title,
  autospin = false
}) => {
  const [isLoading, setIsLoading] = useState(true);

  // Construct Sketchfab embed URL with all UI elements disabled for faster loading
  const embedUrl = `https://sketchfab.com/models/${modelId}/embed?` + 
    new URLSearchParams({
      autostart: '1',                    // Always autostart for faster perception
      autospin: autospin ? '1' : '0',
      preload: '1',                       // Preload for faster display
      ui_controls: '1',                   // Keep basic controls
      ui_infos: '0',                      // Hide model info (author name)
      ui_inspector: '0',                  // Hide inspector
      ui_stop: '0',                       // Hide stop button
      ui_watermark: '0',                  // Hide Sketchfab logo watermark
      ui_watermark_link: '0',             // Hide watermark link
      ui_help: '0',                       // Hide help
      ui_settings: '0',                   // Hide settings
      ui_vr: '0',                         // Hide VR button
      ui_ar: '0',                         // Hide AR button
      ui_annotations: '0',                // Hide annotations
      ui_theme: 'dark',                   // Dark theme
      ui_hint: '0',                       // Hide hint
      ui_loading: '0',                    // Hide loading screen info
      camera: '0',                        // Disable camera menu
      transparent: '0',
      dnt: '1'                            // Do not track
    }).toString();

  // Add CSS to hide any remaining Sketchfab branding via iframe manipulation
  const handleIframeLoad = () => {
    setIsLoading(false);
    
    try {
      // Try to inject CSS to hide any remaining UI elements (cross-origin safe)
      const style = document.createElement('style');
      style.textContent = `
        .sketchfab-iframe::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 60px;
          background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%);
          pointer-events: none;
        }
      `;
      document.head.appendChild(style);
    } catch (err) {
      // Cross-origin restrictions prevent iframe content access, which is expected
      console.log('Iframe loaded');
    }
  };

  return (
    <div className="sketchfab-viewer-container">
      {isLoading && (
        <div className="sketchfab-loading">
          <div className="sketchfab-loading-spinner"></div>
          <p>Loading 3D model...</p>
        </div>
      )}
      <iframe
        title={title}
        className="sketchfab-iframe"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; fullscreen; xr-spatial-tracking"
        src={embedUrl}
        loading="eager"
        onLoad={handleIframeLoad}
      />
      {!isLoading && (
        <div className="sketchfab-controls-hint">
          <p>🖱️ Drag to rotate | Scroll to zoom | Right-click to pan</p>
        </div>
      )}
    </div>
  );
};
