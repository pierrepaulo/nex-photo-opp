import fs from 'fs';
import path from 'path';

import { IStorageService, UploadResult } from '@/application/services/IStorageService';
import { env } from '@/infrastructure/config/env';

const UPLOADS_DIR = path.resolve('uploads');

export class LocalDiskStorageService implements IStorageService {
  constructor() {
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
  }

  async upload(buffer: Buffer, filename: string, _contentType: string): Promise<UploadResult> {
    const filePath = path.join(UPLOADS_DIR, filename);
    const dir = path.dirname(filePath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await fs.promises.writeFile(filePath, buffer);

    return {
      path: filename,
      url: this.getPublicUrl(filename),
    };
  }

  getPublicUrl(filePath: string): string {
    const trimmed = env.SERVER_PUBLIC_URL.trim();
    const baseUrl =
      trimmed.length > 0 ? trimmed.replace(/\/$/, '') : `http://localhost:${env.PORT}`;
    return `${baseUrl}/uploads/${filePath}`;
  }
}
