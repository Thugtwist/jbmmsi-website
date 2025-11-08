import React, { useState, useEffect, useRef } from 'react';
import { useReviews } from '../hooks/useApi';
import { useSocket } from '../hooks/useSocket';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    comment: ''
  });

  const modalRef = useRef(null);
  const { loading, error, getApprovedReviews, submitReview, clearError } = useReviews();
  const { socketService, isConnected } = useSocket();
  const pendingReviewsRef = useRef(new Set()); // Track pending review IDs

  // Load reviews and setup WebSocket
  useEffect(() => {
    loadReviews();
    setupWebSocket();

    return () => {
      socketService.off('review_created');
      socketService.off('review_updated');
      socketService.off('review_deleted');
    };
  }, []);

  const loadReviews = async () => {
    try {
      const response = await getApprovedReviews();
      if (response.success) {
        setReviews(response.data.reviews);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    }
  };

  const setupWebSocket = () => {
    socketService.joinReviews();

    socketService.onReviewCreated((newReview) => {
      console.log('📨 New review received via WebSocket:', newReview);
      
      setReviews(prev => {
        // Check for duplicates by ID
        const isDuplicate = prev.some(review => 
          review._id === newReview._id || 
          (review._id.startsWith('temp-') && 
           review.name === newReview.name && 
           review.comment === newReview.comment &&
           Math.abs(new Date(review.createdAt) - new Date(newReview.createdAt)) < 5000)
        );
        
        if (isDuplicate) {
          console.log('🔄 Duplicate review detected, replacing optimistic update');
          // Replace optimistic review with real one
          return prev.map(review => 
            (review._id.startsWith('temp-') && 
             review.name === newReview.name && 
             review.comment === newReview.comment) ? newReview : review
          );
        }
        
        // Add new review from other users
        console.log('➕ Adding new review from other user');
        return [newReview, ...prev];
      });
      
      // Remove from pending if it was our review
      pendingReviewsRef.current.forEach(tempId => {
        if (tempId.startsWith('temp-')) {
          pendingReviewsRef.current.delete(tempId);
        }
      });
    });

    socketService.onReviewUpdated((updatedReview) => {
      console.log('📝 Review updated via WebSocket:', updatedReview);
      setReviews(prev => prev.map(review => 
        review._id === updatedReview._id ? updatedReview : review
      ));
    });

    socketService.onReviewDeleted((data) => {
      console.log('🗑️ Review deleted via WebSocket:', data);
      setReviews(prev => prev.filter(review => review._id !== data.id));
    });
  };

  // Submit new review to server
// In your Reviews component, update the submit function:
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    clearError();
    
    const reviewToSubmit = {
      ...newReview,
      date: new Date().toISOString().split('T')[0]
    };
    
    // Submit to server
    const response = await submitReview(reviewToSubmit);
    
    // Check if response indicates success
    if (response && response.success) {
      console.log('Review submitted successfully!', response);
      
      // Clear form and close modal
      setNewReview({ name: '', rating: 5, comment: '' });
      setIsModalOpen(false);
      
      // Reload reviews to get the latest
      loadReviews();
    } else {
      throw new Error(response?.message || 'Failed to submit review');
    }
  } catch (err) {
    console.error('Error submitting review:', err);
    // Error is already set by the useApi hook
  }
};

  const handleChange = (e) => {
    setNewReview({
      ...newReview,
      [e.target.name]: e.target.value
    });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewReview({ name: '', rating: 5, comment: '' });
    clearError();
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.keyCode === 27) closeModal();
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="reviews-container">
      <h2 className="section-title">School <span>Reviews</span></h2>
      
      {/* Add Review Button */}
      <div className="add-review-section">
        <button className="add-review-btn" onClick={openModal}>
          <i className="fas fa-edit"></i>
          Write a Review
        </button>
      </div>

      {/* Modal */}
      <div className={`modal ${isModalOpen ? 'active' : ''}`} onClick={closeModal}>
        <div 
          className="modal-content" 
          onClick={(e) => e.stopPropagation()}
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-modal-title"
        >
          <span className="close" onClick={closeModal}>×</span>
          
          <div className="modal-icon">
            <i className="fas fa-star"></i>
          </div>
          
          <h2 className="modal-title" id="review-modal-title">Add Your Review</h2>
          <p className="modal-subtitle">Share your experience with the school</p>
          
          {error && (
            <div className="error-message active">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="review-form">
            <div className="form-group">
              <label htmlFor="review-name">Your Name</label>
              <div className="input-with-icon">
                <i className="fas fa-user input-icon"></i>
                <input
                  id="review-name"
                  type="text"
                  name="name"
                  value={newReview.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="review-rating">Rating</label>
              <div className="input-with-icon">
                <i className="fas fa-star input-icon"></i>
                <select
                  id="review-rating"
                  name="rating"
                  value={newReview.rating}
                  onChange={handleChange}
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Good</option>
                  <option value={2}>2 Stars - Fair</option>
                  <option value={1}>1 Star - Poor</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="review-comment">Your Review</label>
              <div className="input-with-icon">
                <i className="fas fa-comment input-icon"></i>
                <textarea
                  id="review-comment"
                  name="comment"
                  value={newReview.comment}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Share your thoughts about the school...          
                  minimum of 10 letters"
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              <i className="fas fa-paper-plane"></i>
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      </div>

      {/* Reviews List */}
      <div className="reviews-list">
        <div className="reviews-header">
          <h3>What People Are Saying ({reviews.length})</h3>
        </div>
        
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <i className="fas fa-comments"></i>
            <p>No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="reviews-grid">
            {reviews.map(review => (
              <div 
                key={review._id} 
                className={`review-item ${review._id.startsWith('temp-') ? 'review-pending' : ''}`}
              >
                {review._id.startsWith('temp-') && (
                  <div className="review-pending-indicator">
                    <i className="fas fa-sync fa-spin"></i>
                    Publishing...
                  </div>
                )}
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-name">{review.name}</div>
                    <div className="review-date">
                      {review.date ? new Date(review.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Recently'}
                    </div>
                  </div>
                </div>
                <div className="review-rating">
                  <span className="stars">
                    {'★'.repeat(review.rating)}
                    {'☆'.repeat(5 - review.rating)}
                  </span>
                  <span className="rating-text">({review.rating}/5)</span>
                </div>
                <div className="review-comment">{review.comment}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;