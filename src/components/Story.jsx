import React from 'react';
import { motion } from 'framer-motion';
import { weddingContent } from '../data/content';
import { useImage } from '../hooks/useImage';

/** Three side-by-side images for a story group */
function StoryCollage({ groupIndex }) {
  const g = groupIndex + 1;
  const img1 = useImage(`story-${g}-1`, null);
  const img2 = useImage(`story-${g}-2`, null);
  const img3 = useImage(`story-${g}-3`, null);

  const photos = [img1, img2, img3].filter(Boolean);
  if (photos.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: groupIndex * 0.1 }}
      className="flex gap-3 items-stretch justify-center"
    >
      {photos.map((src, pi) => (
        <div
          key={pi}
          className="rounded-xl overflow-hidden border border-gold-300/40 shadow-md bg-white flex-1 max-w-[160px]"
        >
          <img
            src={src}
            alt={`memory ${pi + 1}`}
            className="w-full h-full object-cover object-top"
            style={{ aspectRatio: '3/4' }}
            loading="lazy"
          />
        </div>
      ))}
    </motion.div>
  );
}

export default function Story() {
  const { story } = weddingContent;
  const totalGroups = story.timeline.length;

  // Collect groups that have at least one uploaded image
  return (
    <section id="story" className="py-16 px-4 bg-[#faf6ee] text-espresso-text relative overflow-hidden">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-wrap justify-center gap-6">
          {Array.from({ length: totalGroups }, (_, i) => (
            <StoryCollage key={i} groupIndex={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
