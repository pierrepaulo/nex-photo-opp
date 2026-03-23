import { Router } from 'express';

import { adminRoutes } from '@/presentation/routes/admin.routes';
import { authRoutes } from '@/presentation/routes/auth.routes';
import { downloadRoutes } from '@/presentation/routes/download.routes';
import { photoRoutes } from '@/presentation/routes/photo.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/photos', photoRoutes);
router.use('/admin', adminRoutes);
router.use('/download', downloadRoutes);

export { router as apiRoutes };

