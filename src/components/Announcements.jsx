import React, { useState, useEffect } from 'react';
import { useAnnouncements } from '../hooks/useAnnouncements';

const Announcements = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { announcements, loading, error, isConnected } = useAnnouncements();

  // Auto-slide effect
  useEffect(() => {
    if (announcements.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % announcements.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [announcements.length]);

  // Simple image URL handler
  const getImageUrl = (announcement) => {
    if (!announcement || !announcement.image) {
      return getPlaceholderUrl();
    }
    return announcement.image;
  };

  const getPlaceholderUrl = () => {
    return '/images/placeholder.jpg';
  };

  const handleImageError = (e, announcement) => {
    console.warn(`❌ Image failed to load for: ${announcement.title}`);
    
    // Set placeholder on error
    if (e.target) {
      e.target.src = getPlaceholderUrl();
      e.target.onerror = null; // Prevent infinite loop
    }
  };

  const showSlide = (index) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <section id="announcements" className="section announcements">
        <div className="container">
          <h2 className="section-title">Recent <span>Announcements</span></h2>
          <div className="loading">Loading announcements...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="announcements" className="section announcements">
        <div className="container">
          <h2 className="section-title">Recent <span>Announcements</span></h2>
          <div className="error-message">
            Error: {error}
            <button 
              onClick={() => window.location.reload()} 
              className="retry-button"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (announcements.length === 0) {
    return (
      <section id="announcements" className="section announcements">
        <div className="container">
          <h2 className="section-title">Recent <span>Announcements</span></h2>
          <div className="no-announcements">
            No announcements available.
            {!isConnected && <div className="connection-note">(Real-time updates offline)</div>}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="announcements" className="section announcements">
      <div className="container">
        <h2 className="section-title">Recent <span>Announcements</span></h2>
        
        <div className="announcement-slider">
          <div className="announcement-track">
            {announcements.map((announcement, index) => {
              const imageUrl = getImageUrl(announcement);
              
              return (
                <div 
                  key={announcement._id} 
                  className="announcement-slide" 
                  style={{ display: index === currentSlide ? 'flex' : 'none' }}
                >
                  <div className="announcement-info">
                    <h3 className="announcement-title">{announcement.title}</h3>
                    <p className="announcement-date">{announcement.date}</p>
                    <p className="announcement-desc">{announcement.description}</p>
                  </div>
                  <div className="announcement-img">
                    <img 
                      src={imageUrl}
                      alt={announcement.title}
                      onError={(e) => handleImageError(e, announcement)}
                      loading="lazy"
                      crossOrigin="anonymous"
                    />
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="slider-nav">
            {announcements.map((_, index) => (
              <div 
                key={index}
                className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => showSlide(index)}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Announcements;
