import { Router } from 'express';

import { container } from '@/container';

const router = Router();
const controller = container.controllers.downloadController;

router.get('/:token', controller.getByToken.bind(controller));

export { router as downloadRoutes };

