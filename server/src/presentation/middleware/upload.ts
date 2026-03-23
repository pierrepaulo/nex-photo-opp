import multer from 'multer';

import { AppError } from '@/application/errors/AppError';

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (allowedMimeTypes.has(file.mimetype)) {
      cb(null, true);
      return;
    }
    cb(
      new AppError(
        'BAD_REQUEST',
        'Only JPEG, PNG and WebP images are allowed',
        400,
        'PHOTO_INVALID_TYPE',
      ),
    );
  },
});

