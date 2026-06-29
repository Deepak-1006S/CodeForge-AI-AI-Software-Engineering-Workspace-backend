import { useSocket as useSocketContext } from '../context/SocketContext';

/**
 * Hook to access socket context
 */
export const useSocket = () => {
  return useSocketContext();
};
