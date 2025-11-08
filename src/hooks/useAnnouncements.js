import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { useSocket } from './useSocket';

export const useAnnouncements = () => {
  const { loading, error, getActiveAnnouncements, clearError } = useApi();
  const { socketService, isConnected } = useSocket();
  const [announcements, setAnnouncements] = useState([]);

  // Load announcements
  const loadAnnouncements = async () => {
    try {
      const response = await getActiveAnnouncements();
      if (response.success) {
        setAnnouncements(response.data);
      }
    } catch (err) {
      console.error('Failed to load announcements:', err);
    }
  };

  // Set data when component mounts
  useEffect(() => {
    loadAnnouncements();
  }, []);

  // Real-time event listeners
  useEffect(() => {
    if (!socketService || !isConnected) return;

    console.log('🔌 Setting up announcement listeners...');

    const handleNew = (newAnnouncement) => {
      console.log('📢 New announcement:', newAnnouncement);
      setAnnouncements(prev => [newAnnouncement, ...prev]);
    };

    const handleUpdate = (updatedAnnouncement) => {
      console.log('📢 Updated announcement:', updatedAnnouncement);
      setAnnouncements(prev => 
        prev.map(item => 
          item._id === updatedAnnouncement._id ? updatedAnnouncement : item
        )
      );
    };

    const handleDelete = (deletedData) => {
      console.log('📢 Deleted announcement:', deletedData.id);
      setAnnouncements(prev => 
        prev.filter(item => item._id !== deletedData.id)
      );
    };

    // Register listeners using socketService
    socketService.on('announcement_created', handleNew);
    socketService.on('announcement_updated', handleUpdate);
    socketService.on('announcement_deleted', handleDelete);

    // Cleanup
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