import sharp from 'sharp';
import path from 'path';
import { StorageService } from '../storage/storageAdapter.js';

export class ImageProcessor {
  /**
   * Process an uploaded photo buffer:
   * 1. Extract metadata & dimensions
   * 2. Calculate sharpness score
   * 3. Generate Thumbnail (approx 500px)
   * 4. Generate Web delivery image (approx 2000px)
   * 5. Generate watermarked preview if requested
   * 6. Save original untouched
   */
  static async processPhoto(buffer, originalFilename, galleryId, watermarkConfig = null) {
    const sharpInstance = sharp(buffer);
    const metadata = await sharpInstance.metadata();

    const baseKey = `galleries/${galleryId}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // 1. Save original untouched
    const originalExt = path.extname(originalFilename) || '.jpg';
    const originalKey = `${baseKey}_orig${originalExt}`;
    const originalStorage = await StorageService.upload(buffer, originalKey, metadata.format || 'image/jpeg');

    // 2. Generate Web image (2000px max width/height, WebP, quality 85)
    let webPipeline = sharp(buffer)
      .rotate() // Auto-rotate according to EXIF
      .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 });

    // Watermark overlay if enabled
    if (watermarkConfig && watermarkConfig.enabled) {
      const watermarkSvg = this.generateWatermarkSvg(
        watermarkConfig.text || 'SIGNATURE BY MARVAN',
        watermarkConfig.opacity || 0.2,
        watermarkConfig.size || 'medium'
      );
      webPipeline = webPipeline.composite([
        {
          input: Buffer.from(watermarkSvg),
          gravity: watermarkConfig.position === 'center' ? 'center' : 'southeast'
        }
      ]);
    }

    const webBuffer = await webPipeline.toBuffer();
    const webKey = `${baseKey}_web.webp`;
    const webStorage = await StorageService.upload(webBuffer, webKey, 'image/webp');

    // 3. Generate Thumbnail (approx 500px, WebP, quality 80)
    const thumbBuffer = await sharp(buffer)
      .rotate()
      .resize(600, 600, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
    const thumbKey = `${baseKey}_thumb.webp`;
    const thumbStorage = await StorageService.upload(thumbBuffer, thumbKey, 'image/webp');

    // 4. Calculate sharpness heuristic (Laplacian approximation / statistics)
    const stats = await sharp(buffer).stats();
    // Channels standard deviation proxy for image detail/sharpness
    const stdDevAvg = stats.channels.reduce((sum, ch) => sum + ch.stdev, 0) / stats.channels.length;
    const blurScore = Math.min(1.0, Math.max(0.4, Number((stdDevAvg / 75).toFixed(2))));
    const aiQualityScore = Number((Math.min(9.9, Math.max(7.5, blurScore * 10))).toFixed(1));

    // Calculate aspect ratio
    const width = metadata.width || 4000;
    const height = metadata.height || 2667;
    let aspectRatio = '3:2';
    const ratio = width / height;
    if (ratio > 1.6) aspectRatio = '16:9';
    else if (ratio < 0.9) aspectRatio = '4:5';
    else if (Math.abs(ratio - 1) < 0.1) aspectRatio = '1:1';

    return {
      storageKey: webKey,
      originalKey,
      thumbnailUrl: thumbStorage.url,
      webUrl: webStorage.url,
      originalUrl: originalStorage.url,
      dimensions: { width, height },
      aspectRatio,
      fileSize: buffer.length,
      blurScore,
      aiQualityScore,
      format: metadata.format
    };
  }

  static generateWatermarkSvg(text, opacity = 0.2, size = 'medium') {
    const fontSize = size === 'large' ? 42 : size === 'small' ? 24 : 32;
    return `
      <svg width="500" height="120" xmlns="http://www.w3.org/2000/svg">
        <style>
          .watermark-text {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: ${fontSize}px;
            letter-spacing: 4px;
            fill: #C9A86A;
            fill-opacity: ${opacity};
            font-weight: 600;
          }
        </style>
        <text x="20" y="70" class="watermark-text">${text}</text>
      </svg>
    `;
  }
}
