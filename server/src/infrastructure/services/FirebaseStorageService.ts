import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

import { IStorageService, UploadResult } from '@/application/services/IStorageService';
import { env } from '@/infrastructure/config/env';

export class FirebaseStorageService implements IStorageService {
  constructor() {
    if (!getApps().length) {
      try {
        initializeApp({
          credential: cert({
            projectId: env.FIREBASE_PROJECT_ID,
            clientEmail: env.FIREBASE_CLIENT_EMAIL,
            privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          }),
          storageBucket: env.FIREBASE_STORAGE_BUCKET,
        });
      } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        throw Object.assign(new Error(`Failed to initialize Firebase Storage service: ${reason}`), {
          cause: error,
        });
      }
    }

    // Note: credential validity and bucket permissions are effectively validated on first I/O call.
  }

  async upload(buffer: Buffer, filename: string, contentType: string): Promise<UploadResult> {
    const bucket = getStorage().bucket();
    const file = bucket.file(filename);
    await file.save(buffer, {
      metadata: { contentType },
      public: true,
      resumable: false,
    });

    return {
      path: filename,
      url: this.getPublicUrl(filename),
    };
  }

  getPublicUrl(path: string): string {
    const bucketName = env.FIREBASE_STORAGE_BUCKET;
    return `https://storage.googleapis.com/${bucketName}/${path}`;
  }
}

