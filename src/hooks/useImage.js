import { useImageContext } from '../contexts/ImageContext';

/**
 * Returns the uploaded Supabase URL for a given slot if available,
 * otherwise falls back to the provided local SVG/image path.
 *
 * @param {string} slotId - The image slot identifier (e.g. 'hero', 'story-1', 'gallery-3')
 * @param {string} fallback - The local asset URL to use when no upload exists
 * @returns {string} - The image URL to render
 */
export function useImage(slotId, fallback) {
  const context = useImageContext();
  const images = context?.images || {};
  return (slotId && images[slotId]) || fallback;
}
