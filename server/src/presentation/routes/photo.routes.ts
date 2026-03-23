import { Router } from 'express';

import { Role } from '@/domain/enums/Role';
import { PhotoController } from '@/presentation/controllers/PhotoController';
import { authMiddleware } from '@/presentation/middleware/authMiddleware';
import { rbacMiddleware } from '@/presentation/middleware/rbacMiddleware';
import { upload } from '@/presentation/middleware/upload';

const router = Router();
const controller = new PhotoController();

router.post('/', authMiddleware, rbacMiddleware([Role.PROMOTER]), upload.single('photo'), controller.upload.bind(controller));

export { router as photoRoutes };

