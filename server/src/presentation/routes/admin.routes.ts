import { Router } from 'express';

import { Role } from '@/domain/enums/Role';
import { AdminController } from '@/presentation/controllers/AdminController';
import { authMiddleware } from '@/presentation/middleware/authMiddleware';
import { rbacMiddleware } from '@/presentation/middleware/rbacMiddleware';

const router = Router();
const controller = new AdminController();

router.get('/photos', authMiddleware, rbacMiddleware([Role.ADMIN]), controller.listPhotos.bind(controller));
router.get('/photos/stats', authMiddleware, rbacMiddleware([Role.ADMIN]), controller.getStats.bind(controller));
router.get('/logs', authMiddleware, rbacMiddleware([Role.ADMIN]), controller.listLogs.bind(controller));
router.get('/logs/export', authMiddleware, rbacMiddleware([Role.ADMIN]), controller.exportLogs.bind(controller));

export { router as adminRoutes };

