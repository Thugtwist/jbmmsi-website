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

// In your getImageUrl function, update it to this:
const getImageUrl = (announcement) => {
  if (!announcement || !announcement.image) {
    console.log('❌ No image for announcement:', announcement?._id);
    return getPlaceholderUrl();
  }
  
  let imageUrl = announcement.image;
  
  // Handle base64 data that might be incomplete
  if (imageUrl.startsWith('iVBORw') && !imageUrl.startsWith('data:')) {
    console.log('🔄 Converting base64 to data URL for:', announcement.title);
    
    // Check if base64 data is complete enough
    if (imageUrl.length > 1000) {
      imageUrl = `data:image/png;base64,${imageUrl}`;
    } else {
      console.log('❌ Base64 data too short, using placeholder');
      return getPlaceholderUrl();
    }
  }
  
  // Handle data URLs that might be corrupted
  if (imageUrl.startsWith('data:image') && imageUrl.length < 1000) {
    console.log('❌ Data URL too short, likely corrupted');
    return getPlaceholderUrl();
  }
  
  // Handle regular file paths
  if (!imageUrl.startsWith('data:') && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
    imageUrl = `https://web-server-2dis.onrender.com/uploads/${imageUrl}`;
  }
  
  // If it's a relative path, make it absolute
  if (imageUrl.startsWith('/uploads/') && !imageUrl.startsWith('http')) {
    imageUrl = `https://web-server-2dis.onrender.com${imageUrl}`;
  }
  
  console.log('🖼️ Image URL ready for:', announcement.title);
  return imageUrl;
};

// Update the placeholder URL function
const getPlaceholderUrl = () => {
  return 'https://web-server-2dis.onrender.com/images/placeholder.jpg';
};

  const handleImageError = (e, announcement) => {
    console.warn(`❌ Image failed to load for announcement: ${announcement._id}`);
    
    // Set placeholder
    if (e.target) {
      e.target.src = getPlaceholderUrl();
      e.target.onerror = null;
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
              const hasImage = !!imageUrl;
              
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
                    {hasImage ? (
                      <img 
                        src={imageUrl}
                        alt={announcement.title}
                        onError={(e) => handleImageError(e, announcement)}
                        style={{ 
                          maxWidth: '100%',
                          height: 'auto'
                        }}
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="no-image-placeholder">
                        <span>No Image Available</span>
                      </div>
                    )}
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