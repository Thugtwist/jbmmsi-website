import { useState, useCallback } from 'react';
import { apiService } from '../apiService';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = useCallback(async (apiCall, ...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall(...args);
      return response.data; // Return the data from axios response
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = () => setError(null);

  // Specific API methods
  const getActiveAnnouncements = () => callApi(apiService.getActiveAnnouncements);
  const getActiveSchools = () => callApi(apiService.getActiveSchools);
  const getApprovedReviews = () => callApi(apiService.getApprovedReviews);
  const submitInquiry = (data) => callApi(apiService.submitInquiry, data);
  const submitReview = (data) => callApi(apiService.submitReview, data);

  return {
    loading,
    error,
    clearError,
    callApi,
    getActiveAnnouncements,
    getActiveSchools,
    getApprovedReviews,
    submitInquiry,
    submitReview
  };
};

// Enhanced useReviews hook
export const useReviews = () => {
  const { loading, error, callApi, clearError } = useApi();

  const getReviews = () => callApi(apiService.getReviews);
  const getApprovedReviews = () => callApi(apiService.getApprovedReviews);
  const submitReview = (reviewData) => callApi(apiService.submitReview, reviewData);
  const updateReview = (id, reviewData) => callApi(apiService.updateReview, id, reviewData);
  const deleteReview = (id) => callApi(apiService.deleteReview, id);

  return {
    loading,
    error,
    clearError,
    getReviews,
    getApprovedReviews,
    submitReview,
    updateReview,
    deleteReview
  };
};

// Enhanced useInquiries hook
export const useInquiries = () => {
  const { loading, error, callApi, clearError } = useApi();

  const submitInquiry = (inquiryData) => callApi(apiService.submitInquiry, inquiryData);
  const getInquiries = (page = 1, limit = 10) => callApi(apiService.getInquiries, page, limit);
  const updateInquiryStatus = (id, status) => callApi(apiService.updateInquiryStatus, id, status);

  return {
    loading,
    error,
    clearError,
    submitInquiry,
    getInquiries,
    updateInquiryStatus
  };
};