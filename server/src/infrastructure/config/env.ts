import { z } from 'zod';

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().default(3333),
    CLIENT_URL: z.string().default('http://localhost:5173'),
    DATABASE_URL: z.string().min(1),
    JWT_SECRET: z.string().min(1),
    JWT_EXPIRES_IN: z.string().default('8h'),
    STORAGE_PROVIDER: z.enum(['local', 'firebase']).default('local'),
    FIREBASE_PROJECT_ID: z.string().optional().default(''),
    FIREBASE_PRIVATE_KEY: z.string().optional().default(''),
    FIREBASE_CLIENT_EMAIL: z.string().optional().default(''),
    FIREBASE_STORAGE_BUCKET: z.string().optional().default(''),
  })
  .refine(
    (data) => {
      if (data.STORAGE_PROVIDER === 'firebase') {
        return (
          data.FIREBASE_PROJECT_ID.length > 0 &&
          data.FIREBASE_PRIVATE_KEY.length > 0 &&
          data.FIREBASE_CLIENT_EMAIL.length > 0 &&
          data.FIREBASE_STORAGE_BUCKET.length > 0
        );
      }
      return true;
    },
    { message: 'Firebase credentials are required when STORAGE_PROVIDER=firebase' },
  );

export const env = envSchema.parse(process.env);

