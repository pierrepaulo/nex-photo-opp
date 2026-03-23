import { z } from 'zod';

export const uploadPhotoSchema = z.object({
  // Placeholder for phase 4 payload validation.
  photoBase64: z.string().optional(),
});

