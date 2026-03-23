import frameOverlayUrl from '@/assets/frame-overlay.png';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Falha ao carregar imagem'));
    img.src = src;
  });
}

/**
 * Composição apenas para preview: foto nas dimensões nativas, moldura escalada por cima.
 * O upload deve usar sempre o Blob original da câmera.
 */
export async function composeFramePreview(photoBlob: Blob): Promise<string> {
  const photoObjectUrl = URL.createObjectURL(photoBlob);
  try {
    const [photo, frame] = await Promise.all([loadImage(photoObjectUrl), loadImage(frameOverlayUrl)]);

    const canvas = document.createElement('canvas');
    canvas.width = photo.naturalWidth;
    canvas.height = photo.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas não suportado');
    }

    ctx.drawImage(photo, 0, 0);
    ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/png');
  } finally {
    URL.revokeObjectURL(photoObjectUrl);
  }
}
