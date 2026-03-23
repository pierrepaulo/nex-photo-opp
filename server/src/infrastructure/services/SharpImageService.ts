import sharp from 'sharp';

import { IImageProcessingService, ImageMetadata } from '@/application/services/IImageProcessingService';

export class SharpImageService implements IImageProcessingService {
  async getMetadata(buffer: Buffer): Promise<ImageMetadata> {
    const metadata = await sharp(buffer).metadata();
    if (!metadata.width || !metadata.height) {
      throw new Error('Could not extract image dimensions');
    }

    return {
      width: metadata.width,
      height: metadata.height,
    };
  }

  async applyFrame(photoBuffer: Buffer, frameBuffer: Buffer): Promise<Buffer> {
    const photoMetadata = await this.getMetadata(photoBuffer);
    // Defensive guard for unexpected runtime values.
    if (photoMetadata.width <= 0 || photoMetadata.height <= 0) {
      throw new Error('Invalid photo dimensions');
    }

    // Challenge rule: do not resize the user photo.
    // The frame is resized to fit the photo dimensions, then composited over it.
    const resizedFrame = await sharp(frameBuffer)
      .resize(photoMetadata.width, photoMetadata.height, { fit: 'fill' })
      .png()
      .toBuffer();

    return sharp(photoBuffer)
      .composite([{ input: resizedFrame, top: 0, left: 0 }])
      .png()
      .toBuffer();
  }
}

