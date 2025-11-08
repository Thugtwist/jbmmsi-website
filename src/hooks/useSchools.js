import { useState, useEffect } from 'react';
import { useApi } from './useApi';
import { useSocket } from './useSocket';

export const useSchools = () => {
  const { loading, error, getActiveSchools, clearError } = useApi();
  const { socketService, isConnected } = useSocket();
  const [schools, setSchools] = useState([]);

  // Load schools
  const loadSchools = async () => {
    try {
      const response = await getActiveSchools();
      if (response.success) {
        setSchools(response.data);
      }
    } catch (err) {
      console.error('Failed to load schools:', err);
    }
  };

  // Set data when component mounts
  useEffect(() => {
    loadSchools();
  }, []);

  // Real-time event listeners
  useEffect(() => {
    if (!socketService || !isConnected) return;

    console.log('🔌 Setting up school listeners...');

    const handleNew = (newSchool) => {
      console.log('🏫 New school:', newSchool);
      setSchools(prev => [newSchool, ...prev]);
    };

    const handleUpdate = (updatedSchool) => {
      console.log('🏫 Updated school:', updatedSchool);
      setSchools(prev => 
        prev.map(item => 
          item._id === updatedSchool._id ? updatedSchool : item
        )
      );
    };

    const handleDelete = (deletedData) => {
      console.log('🏫 Deleted school:', deletedData.id);
      setSchools(prev => 
        prev.filter(item => item._id !== deletedData.id)
      );
    };

    // Register listeners using socketService
    socketService.on('school_created', handleNew);
    socketService.on('school_updated', handleUpdate);
    socketService.on('school_deleted', handleDelete);

    // Cleanup
    return () => {
      socketService.off('school_created', handleNew);
      socketService.off('school_updated', handleUpdate);
      socketService.off('school_deleted', handleDelete);
    };
  }, [socketService, isConnected]);

  const refetch = () => {
    loadSchools();
  };

  return {
    schools,
    loading,
    error,
    refetch,
    isConnected
  };
};