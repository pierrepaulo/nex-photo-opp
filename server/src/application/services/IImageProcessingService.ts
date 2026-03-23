export interface ImageMetadata {
  width: number;
  height: number;
}

export interface IImageProcessingService {
  applyFrame(photoBuffer: Buffer, frameBuffer: Buffer): Promise<Buffer>;
  getMetadata(buffer: Buffer): Promise<ImageMetadata>;
}

