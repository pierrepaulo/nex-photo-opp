import { Router } from 'express';

import { container } from '@/container';
import { Role } from '@/domain/enums/Role';
import { authMiddleware } from '@/presentation/middleware/authMiddleware';
import { rbacMiddleware } from '@/presentation/middleware/rbacMiddleware';
import { upload } from '@/presentation/middleware/upload';

const router = Router();
const controller = container.controllers.photoController;

router.post('/', authMiddleware, rbacMiddleware([Role.PROMOTER]), upload.single('photo'), controller.upload.bind(controller));

export { router as photoRoutes };

