import { Router } from 'express';

import { container } from '@/container';
import { authMiddleware } from '@/presentation/middleware/authMiddleware';
import { validateBody } from '@/presentation/middleware/validateBody';
import { loginSchema } from '@/presentation/validators/authValidators';

const router = Router();
const controller = container.controllers.authController;

router.post('/login', validateBody(loginSchema), controller.login.bind(controller));
router.get('/me', authMiddleware, controller.me.bind(controller));

export { router as authRoutes };
