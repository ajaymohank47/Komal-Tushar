/**
 * Client-side image compressor.
 * Compresses file size (e.g. 10 MB -> 450 KB) while maintaining high-resolution
 * display dimensions and crisp visual quality.
 */

export async function compressImage(file, options = {}) {
  const { maxDimension = 2560, quality = 0.85 } = options;

  // Pass through if not an image or if SVG/GIF
  if (
    !file ||
    !file.type.startsWith('image/') ||
    file.type === 'image/svg+xml' ||
    file.type === 'image/gif'
  ) {
    return {
      file,
      originalSize: file?.size || 0,
      compressedSize: file?.size || 0,
      reduction: '0%',
      wasCompressed: false,
    };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onerror = () => {
      resolve({
        file,
        originalSize: file.size,
        compressedSize: file.size,
        reduction: '0%',
        wasCompressed: false,
      });
    };

    reader.onload = (event) => {
      const img = new Image();

      img.onerror = () => {
        resolve({
          file,
          originalSize: file.size,
          compressedSize: file.size,
          reduction: '0%',
          wasCompressed: false,
        });
      };

      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Keep original dimensions unless they exceed ultra-high-res cap
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve({
            file,
            originalSize: file.size,
            compressedSize: file.size,
            reduction: '0%',
            wasCompressed: false,
          });
        }

        // Fill background white to support transparent PNG conversion to JPG
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return resolve({
                file,
                originalSize: file.size,
                compressedSize: file.size,
                reduction: '0%',
                wasCompressed: false,
              });
            }

            // If compressed output is somehow not smaller than original, keep original
            if (blob.size >= file.size) {
              return resolve({
                file,
                originalSize: file.size,
                compressedSize: file.size,
                reduction: '0%',
                wasCompressed: false,
              });
            }

            const cleanName = file.name.replace(/\.[^.]+$/, '') + '.jpg';
            const compressedFile = new File([blob], cleanName, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });

            const reduction =
              Math.round(((file.size - blob.size) / file.size) * 100) + '%';

            resolve({
              file: compressedFile,
              originalSize: file.size,
              compressedSize: blob.size,
              reduction,
              wasCompressed: true,
            });
          },
          'image/jpeg',
          quality
        );
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  });
}

export function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
