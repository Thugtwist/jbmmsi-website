import { useEffect, useState } from 'react';
import { socketService } from '../services/socketService';

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Connect to socket when hook is used
    const socket = socketService.connect();

    const handleConnect = () => {
      setIsConnected(true);
      console.log('✅ Socket connected in hook');
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      console.log('❌ Socket disconnected in hook');
    };

    // Listen for connection events
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    // Set initial connection state
    setIsConnected(socketService.getConnectionStatus());

    // Cleanup
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  return {
    isConnected,
    socketService
  };
};