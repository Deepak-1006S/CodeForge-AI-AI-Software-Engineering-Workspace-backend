import { useQuery } from '@tanstack/react-query';
import { DashboardStats, getDashboardStats } from '../services/dashboard.service';

export const useDashboard = (organizationId?: string) => {
  return useQuery<DashboardStats, Error>({
    queryKey: ['dashboard', 'overview', organizationId],
    queryFn: () => getDashboardStats(organizationId),
    enabled: Boolean(organizationId),
    staleTime: 1000 * 60 * 5,
  });
};
