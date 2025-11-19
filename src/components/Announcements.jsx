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

  // Simple image handler - trust the server to send proper URLs
  const getImageUrl = (announcement) => {
    if (!announcement) {
      return getPlaceholderUrl();
    }
    
    // Use whatever image field the server provides
    const imageUrl = announcement.image || announcement.Photo;
    
    if (!imageUrl || imageUrl.includes('placeholder')) {
      return getPlaceholderUrl();
    }
    
    return imageUrl;
  };

  const getPlaceholderUrl = () => {
    return 'https://web-server-2dis.onrender.com/images/placeholder.svg';
  };

  const handleImageError = (e, announcement) => {
    console.log(`Image failed for: ${announcement.Title || announcement.title}`);
    e.target.src = getPlaceholderUrl();
  };

  const handleImageLoad = (e, announcement) => {
    console.log(`✅ Image loaded successfully for: ${announcement.Title || announcement.title}`);
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
            <button onClick={() => window.location.reload()} className="retry-button">
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!announcements || announcements.length === 0) {
    return (
      <section id="announcements" className="section announcements">
        <div className="container">
          <h2 className="section-title">Recent <span>Announcements</span></h2>
          <div className="no-announcements">
            No announcements available.
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
              const title = announcement.Title || announcement.title || "Announcement";
              const description = announcement.Description || announcement.description || "";
              const date = announcement.Date || announcement.date || "";
              
              return (
                <div 
                  key={announcement._id} 
                  className="announcement-slide" 
                  style={{ display: index === currentSlide ? 'flex' : 'none' }}
                >
                  <div className="announcement-info">
                    <h3 className="announcement-title">{title}</h3>
                    <p className="announcement-date">{date}</p>
                    <p className="announcement-desc">{description}</p>
                  </div>
                  <div className="announcement-img">
                    <img 
                      src={imageUrl}
                      alt={title}
                      onError={(e) => handleImageError(e, announcement)}
                      onLoad={(e) => handleImageLoad(e, announcement)}
                      style={{ 
                        maxWidth: '100%',
                        height: 'auto',
                        objectFit: 'cover'
                      }}
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
