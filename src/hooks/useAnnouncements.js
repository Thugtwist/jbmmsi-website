import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { useSocket } from './useSocket';

// Updated useAnnouncements hook with better image handling
export const useAnnouncements = () => {
  const { loading, error, getActiveAnnouncements, clearError } = useApi();
  const { socketService, isConnected } = useSocket();
  const [announcements, setAnnouncements] = useState([]);

  // Load announcements with image validation
  const loadAnnouncements = async () => {
    try {
      const response = await getActiveAnnouncements();
      if (response.success) {
        // Validate images before setting state
        const validatedAnnouncements = await Promise.all(
          response.data.map(async (announcement) => {
            const isValidImage = await validateImage(announcement.image);
            return {
              ...announcement,
              image: isValidImage ? announcement.image : getPlaceholderUrl()
            };
          })
        );
        setAnnouncements(validatedAnnouncements);
      }
    } catch (err) {
      console.error('Failed to load announcements:', err);
    }
  };

  // Image validation function
  const validateImage = (imageUrl) => {
    return new Promise((resolve) => {
      if (!imageUrl) {
        resolve(false);
        return;
      }

      // If it's base64, check if it's complete
      if (imageUrl.startsWith('data:image')) {
        const base64Data = imageUrl.split(',')[1];
        // Check if base64 data is reasonably complete
        resolve(base64Data && base64Data.length > 1000);
        return;
      }

      // For URLs, check if image loads
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = imageUrl;
      
      // Timeout after 5 seconds
      setTimeout(() => resolve(false), 5000);
    });
  };

  // Get placeholder URL
  const getPlaceholderUrl = () => {
    return '/images/placeholder.jpg'; // Make sure this exists in your public folder
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  // Real-time updates
  useEffect(() => {
    if (!socketService || !isConnected) return;

    console.log('🔌 Setting up announcement listeners...');

    const handleNew = async (newAnnouncement) => {
      console.log('📢 New announcement:', newAnnouncement);
      const isValidImage = await validateImage(newAnnouncement.image);
      const validatedAnnouncement = {
        ...newAnnouncement,
        image: isValidImage ? newAnnouncement.image : getPlaceholderUrl()
      };
      setAnnouncements(prev => [validatedAnnouncement, ...prev]);
    };

    const handleUpdate = async (updatedAnnouncement) => {
      console.log('📢 Updated announcement:', updatedAnnouncement);
      const isValidImage = await validateImage(updatedAnnouncement.image);
      const validatedAnnouncement = {
        ...updatedAnnouncement,
        image: isValidImage ? updatedAnnouncement.image : getPlaceholderUrl()
      };
      setAnnouncements(prev => 
        prev.map(item => 
          item._id === updatedAnnouncement._id ? validatedAnnouncement : item
        )
      );
    };

    const handleDelete = (deletedData) => {
      console.log('📢 Deleted announcement:', deletedData.id);
      setAnnouncements(prev => 
        prev.filter(item => item._id !== deletedData.id)
      );
    };

    socketService.on('announcement_created', handleNew);
    socketService.on('announcement_updated', handleUpdate);
    socketService.on('announcement_deleted', handleDelete);

    return () => {
      socketService.off('announcement_created', handleNew);
      socketService.off('announcement_updated', handleUpdate);
      socketService.off('announcement_deleted', handleDelete);
    };
  }, [socketService, isConnected]);

  const refetch = () => {
    loadAnnouncements();
  };

  return {
    announcements,
    loading,
    error,
    refetch,
    isConnected
  };
};
