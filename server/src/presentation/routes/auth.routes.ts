import { Router } from 'express';

import { AuthController } from '@/presentation/controllers/AuthController';
import { authMiddleware } from '@/presentation/middleware/authMiddleware';

const router = Router();
const controller = new AuthController();

router.post('/login', controller.login.bind(controller));
router.get('/me', authMiddleware, controller.me.bind(controller));

export { router as authRoutes };

