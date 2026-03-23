import { z } from 'zod';

const booleanFlagSchema = z
  .enum(['true', 'false'])
  .optional()
  .default('false')
  .transform((value) => value === 'true');

const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().default(3333),
    CLIENT_URL: z.string().default('http://localhost:5173'),
    ALLOW_VERCEL_PREVIEWS: booleanFlagSchema,
    /** Origens extras permitidas no CORS, separadas por vírgula (ex.: http://192.168.0.10:5173). */
    CORS_EXTRA_ORIGINS: z.string().optional().default(''),
    /** Base pública da API para URLs de /uploads (ex.: http://192.168.0.10:3333). Vazio = http://localhost:PORT. */
    SERVER_PUBLIC_URL: z.string().optional().default(''),
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

function parseCommaSeparatedOrigins(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/** Lista única: CLIENT_URL + CORS_EXTRA_ORIGINS (para testes na LAN com o celular). */
export const corsAllowedOrigins = [
  ...new Set([env.CLIENT_URL, ...parseCommaSeparatedOrigins(env.CORS_EXTRA_ORIGINS)]),
];

function isVercelPreviewOrigin(origin: string): boolean {
  try {
    const { protocol, hostname } = new URL(origin);
    return protocol === 'https:' && (hostname === 'vercel.app' || hostname.endsWith('.vercel.app'));
  } catch {
    return false;
  }
}

export function isCorsOriginAllowed(origin: string): boolean {
  if (corsAllowedOrigins.includes(origin)) {
    return true;
  }

  return env.ALLOW_VERCEL_PREVIEWS && isVercelPreviewOrigin(origin);
}

