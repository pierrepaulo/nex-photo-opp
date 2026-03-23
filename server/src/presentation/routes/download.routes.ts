import { Router } from 'express';

import { DownloadController } from '@/presentation/controllers/DownloadController';

const router = Router();
const controller = new DownloadController();

router.get('/:token', controller.getByToken.bind(controller));

export { router as downloadRoutes };

