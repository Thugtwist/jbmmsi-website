import axios from 'axios';
import { API_CONFIG } from './config';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Response received:`, response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export const apiService = {
  // Health check
  checkHealth: () => apiClient.get(API_CONFIG.ENDPOINTS.HEALTH),

  // Inquiries
  submitInquiry: (data) => apiClient.post(API_CONFIG.ENDPOINTS.INQUIRIES, data),
  getInquiries: (page = 1, limit = 10) => 
    apiClient.get(`${API_CONFIG.ENDPOINTS.INQUIRIES}?page=${page}&limit=${limit}`),
  updateInquiryStatus: (id, status) => 
    apiClient.patch(`${API_CONFIG.ENDPOINTS.INQUIRIES}/${id}/status`, { status }),

  // Announcements
  getActiveAnnouncements: () => 
    apiClient.get(`${API_CONFIG.ENDPOINTS.ANNOUNCEMENTS}/active`),
  getAnnouncements: (page = 1, limit = 10) => 
    apiClient.get(`${API_CONFIG.ENDPOINTS.ANNOUNCEMENTS}?page=${page}&limit=${limit}`),
  getAnnouncement: (id) => 
    apiClient.get(`${API_CONFIG.ENDPOINTS.ANNOUNCEMENTS}/${id}`),
  createAnnouncement: (formData) => 
    apiClient.post(API_CONFIG.ENDPOINTS.ANNOUNCEMENTS, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  // Schools
  getActiveSchools: () => 
    apiClient.get(`${API_CONFIG.ENDPOINTS.SCHOOLS}/active`),
  getSchools: () => 
    apiClient.get(API_CONFIG.ENDPOINTS.SCHOOLS),
  getSchool: (id) => 
    apiClient.get(`${API_CONFIG.ENDPOINTS.SCHOOLS}/${id}`),
  createSchool: (formData) => 
    apiClient.post(API_CONFIG.ENDPOINTS.SCHOOLS, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  // Reviews
  getApprovedReviews: () => 
    apiClient.get(`${API_CONFIG.ENDPOINTS.REVIEWS}/approved`),
  getReviews: () => 
    apiClient.get(API_CONFIG.ENDPOINTS.REVIEWS),
  getReview: (id) => 
    apiClient.get(`${API_CONFIG.ENDPOINTS.REVIEWS}/${id}`),
  submitReview: (data) => 
    apiClient.post(API_CONFIG.ENDPOINTS.REVIEWS, data),
  updateReview: (id, data) => 
    apiClient.put(`${API_CONFIG.ENDPOINTS.REVIEWS}/${id}`, data),
  deleteReview: (id) => 
    apiClient.delete(`${API_CONFIG.ENDPOINTS.REVIEWS}/${id}`)
};

export default apiService;