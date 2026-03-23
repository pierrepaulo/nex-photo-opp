export interface UploadResult {
  url: string;
  path: string;
}

export interface IStorageService {
  upload(buffer: Buffer, filename: string, contentType: string): Promise<UploadResult>;
  getPublicUrl(path: string): string;
}

