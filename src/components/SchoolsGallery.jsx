import React from 'react';

const SchoolsGallery = () => {
  // Local schools data with images
  const schools = [
    {
      _id: 1,
      name: "JEM Brilliant Mind Main Campus",
      description: "",
      imageUrl: "/image/a.jpg"
    },
    {
      _id: 2,
      name: "JEM Brilliant Mind Annex Building",
      description: "",
      imageUrl: "/image/b.jpg"
    },
    {
      _id: 3,
      name: "JEM Brilliant Mind Annex Building",
      description: "",
      imageUrl: "/image/d.jpg"
    },
    {
      _id: 4,
      name: "JEM Brilliant Mind Annex Building",
      description: "",
      imageUrl: "/image/e.jpg"
    },
    {
      _id: 5,
      name: "JEM Brilliant Mind Annex Building",
      description: "",
      imageUrl: "/image/f.jpg"
    },
    {
      _id: 6,
      name: "JEM Brilliant Mind Annex Building",
      description: "",
      imageUrl: "/image/g.jpg"
    },
     {
      _id: 7,
      name: "JEM Brilliant Mind Annex Building",
      description: " ",
      imageUrl: "/image/h.jpg"
    },
    {
      _id: 8,
      name: "JEM Brilliant Mind Annex Building",
      description: "",
      imageUrl: "/image/i.jpg"
    },
    {
      _id: 9,
      name: "JEM Brilliant Mind Annex Building",
      description: "",
      imageUrl: "/image/j.jpg"
    }
  ];

  return (
    <section id="gallery" className="section gallery">
      <div className="container">
        <h2 className="section-title">Schools <span>Overview</span></h2>
        
        {/* Mission Container */}
        <div className="mission-container">
          <h2 className="section-description">
            <strong>JEM BRILLIANT MIND MONTESSORI SCHOOL INC.</strong> goes beyond education by nurturing not only your child's academic development but also their character and values. We provide a supportive community where meaningful life lessons are integrated into everyday learning, fostering personal growth and positive behavior.
            <br/><br/>
            Our Montessori approach ensures that your family is actively engaged in this journey, empowering both parents and learners to grow together—building a strong foundation that lasts a lifetime.
          </h2>
        </div>

        {schools.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏫</div>
            <h3>No Schools Available</h3>
            <p>There are no schools to display at the moment.</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {schools.map((school) => (
              <div 
                key={school._id} 
                className="gallery-item"
              >
                <div className="image-container">
                  <img 
                    src={school.imageUrl} 
                    alt={school.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=School+Image';
                    }}
                  />
                  <div className="image-overlay">
                    <h3>{school.name}</h3>
                    {school.description && (
                      <p className="school-description">
                        {school.description.length > 100 
                          ? `${school.description.substring(0, 100)}...` 
                          : school.description
                        }
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .mission-container {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          padding: 2rem;
          border-radius: 12px;
          border-left: 4px solid #4a90e2;
          margin: 2rem 0;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .section-description {
          font-size: 1.5rem;
          line-height: 1.7;
          color: #2d3748;
          text-align: center;
          margin: 0;
          font-weight: 400;
        }
        
        .section-description strong {
          color: #2c5282;
          font-weight: 600;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .gallery-item {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .gallery-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .image-container {
          position: relative;
          width: 100%;
          height: 250px;
          overflow: hidden;
        }

        .image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .gallery-item:hover .image-container img {
          transform: scale(1.02);
        }

        .image-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
          color: white;
          padding: 1.5rem 1rem 1rem;
        }

        .image-overlay h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.2rem;
        }

        .school-description {
          font-size: 0.9rem;
          opacity: 0.9;
          margin: 0;
          line-height: 1.4;
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #718096;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
      `}</style>
    </section>
  );
};

export default SchoolsGallery;