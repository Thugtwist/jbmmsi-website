import { io } from 'socket.io-client';
import { SOCKET_CONFIG } from '../config';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    console.log('🔌 Connecting to WebSocket...');
    this.socket = io(SOCKET_CONFIG.URL, {
      transports: ['websocket', 'polling'],
      timeout: 10000
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to server via WebSocket');
      this.isConnected = true;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from server:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
      this.isConnected = false;
    });

    this.socket.on('connected', (data) => {
      console.log('Server connection confirmed:', data.message);
    });

    return this.socket;
  }

  // Join specific rooms
  joinAnnouncements() {
    if (this.socket) {
      this.socket.emit('join_announcements');
    }
  }

  joinSchools() {
    if (this.socket) {
      this.socket.emit('join_schools');
    }
  }

  joinReviews() {
    if (this.socket) {
      this.socket.emit('join_reviews');
    }
  }

  // Event listeners management
  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
      
      // Track listeners for cleanup
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event).push(callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Specific event listeners
  onAnnouncementCreated(callback) {
    this.on('announcement_created', callback);
  }

  onAnnouncementUpdated(callback) {
    this.on('announcement_updated', callback);
  }

  onAnnouncementDeleted(callback) {
    this.on('announcement_deleted', callback);
  }

  onSchoolCreated(callback) {
    this.on('school_created', callback);
  }

  onSchoolUpdated(callback) {
    this.on('school_updated', callback);
  }

  onSchoolDeleted(callback) {
    this.on('school_deleted', callback);
  }

  onReviewCreated(callback) {
    this.on('review_created', callback);
  }

  onReviewUpdated(callback) {
    this.on('review_updated', callback);
  }

  onReviewDeleted(callback) {
    this.on('review_deleted', callback);
  }

  onInquiryCreated(callback) {
    this.on('inquiry_created', callback);
  }

  // Remove all listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
    this.listeners.clear();
  }

  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting WebSocket...');
      this.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

export const socketService = new SocketService();