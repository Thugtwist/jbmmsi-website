// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://web-server-2dis.onrender.com',
  ENDPOINTS: {
    INQUIRIES: '/api/inquiries',
    ANNOUNCEMENTS: '/api/announcements',
    SCHOOLS: '/api/schools',
    REVIEWS: '/api/reviews',
    HEALTH: '/api/health'
  },
  UPLOADS_URL: 'https://web-server-2dis.onrender.com/uploads'
};

// WebSocket configuration
export const SOCKET_CONFIG = {
  URL: 'https://web-server-2dis.onrender.com'
};

// Feature flags
export const FEATURES = {
  REAL_TIME_UPDATES: true,
  FILE_UPLOADS: true,
  NOTIFICATIONS: true
};