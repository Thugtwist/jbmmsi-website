import React, { useState, useEffect } from 'react';
import { useInquiries } from '../hooks/useApi';

const Modal = ({ isOpen, onClose, selectedProgram }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    grade: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  
  const { loading, error, submitInquiry, clearError } = useInquiries();

  // Check if current program has grade choices
  const hasGradeChoices = selectedProgram === "Elementary" || selectedProgram === "One On One Tutorial";

  // Grade options for Elementary and Junior Highschool
  const gradeOptions = {
    "Elementary": [
      { value: "Grade 1", label: "Grade 1" },
      { value: "Grade 2", label: "Grade 2" },
      { value: "Grade 3", label: "Grade 3" },
      { value: "Grade 4", label: "Grade 4" },
      { value: "Grade 5", label: "Grade 5" },
      { value: "Grade 6", label: "Grade 6" }
    ],
    "One On One Tutorial": [
      { value: "Online", label: "Online" },
      { value: "Face to Face", label: "Face to Face" }
    ]
  };

  // Get the appropriate grade options based on selected program
  const getGradeOptions = () => {
    return gradeOptions[selectedProgram] || [];
  };

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        grade: ''
      });
      setShowSuccess(false);
      setShowError(false);
      clearError();
    }
  }, [isOpen, selectedProgram]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate grade selection for programs that require it
    if (hasGradeChoices && !formData.grade) {
      alert(`Please select a grade level for ${selectedProgram}.`);
      return;
    }

    // Prepare the data to send
    const submissionData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      program: selectedProgram,
      grade: hasGradeChoices ? formData.grade : 'N/A'
    };

    try {
      const response = await submitInquiry(submissionData);
      
      if (response.success) {
        setShowSuccess(true);
        setShowError(false);
        setFormData({ 
          name: '', 
          email: '', 
          phone: '', 
          message: '',
          grade: ''
        });
        
        setTimeout(() => {
          setShowSuccess(false);
          onClose();
        }, 2000);
      } else {
        throw new Error('Failed to save inquiry');
      }
    } catch (err) {
      setShowError(true);
      setShowSuccess(false);
      console.error('Error submitting inquiry:', err);
    }
  };

  const handleClose = () => {
    setFormData({ 
      name: '', 
      email: '', 
      phone: '', 
      message: '',
      grade: ''
    });
    setShowSuccess(false);
    setShowError(false);
    clearError();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal active" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={handleClose}>&times;</span>
        <div className="modal-icon">
          <i className="fas fa-envelope"></i>
        </div>
         
        <h2 className="modal-title">Inquiry Form - {selectedProgram}</h2>
        <p className="modal-subtitle">We'll get back to you within 24 hours</p>
        
        <form id="inquiryForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <div className="input-with-icon">
              <div className="input-icon"><i className="fas fa-user"></i></div>
              <input 
                type="text" 
                id="name" 
                name="name" 
                placeholder="Your full name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <div className="input-with-icon">
              <div className="input-icon"><i className="fas fa-envelope"></i></div>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="Your email address" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone:</label>
            <div className="input-with-icon">
              <div className="input-icon"><i className="fas fa-phone"></i></div>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                placeholder="Your phone number" 
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          
          {/* Fixed Program Display */}
          <div className="form-group">
            <label htmlFor="program">Program of Interest:</label>
            <div className="input-with-icon">
              <div className="input-icon"><i className="fas fa-graduation-cap"></i></div>
              <input 
                type="text" 
                id="program" 
                name="program" 
                value={selectedProgram}
                readOnly 
                className="read-only-input"
              />
            </div>
          </div>
          
          {/* Grade Selection - for Elementary and Junior Highschool */}
          {hasGradeChoices && (
            <div className="form-group grade-selection">
              <label htmlFor="grade">Grade Level: *</label>
              <div className="input-with-icon">
                <div className="input-icon">
                  <i className={selectedProgram === "Elementary" ? "fas fa-star" : "fas fa-chalkboard"}></i>
                </div>
                <select
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a grade level...</option>
                  {getGradeOptions().map(grade => (
                    <option key={grade.value} value={grade.value}>
                      {grade.label}
                    </option>
                  ))}
                </select>
              </div>
              <small className="grade-help">
                {selectedProgram === "Elementary" 
                  ? "Please select the specific grade level (1-6)"
                  : "Please select between Online and Face to Face"
                }
              </small>
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <div className="input-with-icon">
              <div className="input-icon" style={{alignItems: 'flex-start', paddingTop: '16px'}}>
                <i className="fas fa-comment"></i>
              </div>
              <textarea 
                id="message" 
                name="message" 
                rows="4" 
                placeholder="Tell us about your inquiry" 
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Inquiry'}
          </button>
        </form>
        
        {error && (
          <div className="error-message active">
            <i className="fas fa-exclamation-circle"></i> 
            {error}
          </div>
        )}
        
        <div className={`success-message ${showSuccess ? 'active' : ''}`}>
          <i className="fas fa-check-circle"></i> Thank you for your inquiry! We'll get back to you soon.
        </div>
        
        <div className="modal-footer">
          <p>We value your privacy. Your information will not be shared with third parties.</p>
        </div>
      </div>
    </div>
  );
};

export default Modal;