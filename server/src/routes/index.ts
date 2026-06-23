import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import organizationRoutes from './organization.routes';
import projectRoutes from './project.routes';
import issueRoutes from './issue.routes';
import dashboardRoutes from './dashboard.routes';
import githubRoutes from './github.routes';
import aiRoutes from './ai.routes';
import notificationRoutes from './notification.routes';

const router = Router();

// Health check
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'CodeForge AI API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Mount routers
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/organizations', organizationRoutes);
router.use('/projects', projectRoutes);
router.use('/issues', issueRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/github', githubRoutes);
router.use('/ai', aiRoutes);
router.use('/notifications', notificationRoutes);

export default router;
