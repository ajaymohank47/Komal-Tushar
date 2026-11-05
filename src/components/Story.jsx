import React from 'react';
import { motion } from 'framer-motion';
import { weddingContent } from '../data/content';
import { useImage } from '../hooks/useImage';

/** Floating polaroid-style collage of 3 images for a story item */
function StoryCollage({ index }) {
  const i = index + 1;
  const img1 = useImage(`story-${i}-1`, null);
  const img2 = useImage(`story-${i}-2`, null);
  const img3 = useImage(`story-${i}-3`, null);

  const photos = [img1, img2, img3].filter(Boolean);
  if (photos.length === 0) return null;

  const rotations = ['-rotate-3', 'rotate-2', '-rotate-1'];
  const offsets = [
    { top: 0, left: 0, zIndex: 3, width: 90 },
    { top: 18, left: 14, zIndex: 2, width: 78 },
    { top: 36, left: 28, zIndex: 1, width: 70 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative"
      style={{ width: 120, height: 160 }}
    >
      {photos.map((src, pi) => (
        <div
          key={pi}
          className={`absolute bg-white shadow-md border border-gold-300/40 rounded-sm overflow-hidden
            ${rotations[pi] || ''} transition-transform duration-300 hover:scale-105 hover:z-10`}
          style={{
            width: offsets[pi].width,
            top: offsets[pi].top,
            left: offsets[pi].left,
            zIndex: offsets[pi].zIndex,
            padding: 4,
          }}
        >
          <img
            src={src}
            alt={`memory ${pi + 1}`}
            className="w-full object-cover object-top"
            style={{ aspectRatio: '3/4' }}
            loading="lazy"
          />
        </div>
      ))}
    </motion.div>
  );
}

export default function Story() {
  const { story, global } = weddingContent;

  // Only render collages that have at least one uploaded image
  const totalItems = story.timeline.length;

  return (
    <section id="story" className="py-20 px-4 bg-[#faf6ee] text-espresso-text relative overflow-hidden">
      <div className="max-w-2xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-14">
          <p className="font-script text-2xl sm:text-3xl text-[#D4848A] mb-1">{story.eyebrow}</p>
          <h2 className="font-cormorant text-3xl sm:text-5xl font-normal tracking-wide text-espresso-text uppercase">
            Our <span className="italic text-[#D4848A] font-medium">Story</span>
          </h2>
          <p className="font-serif italic text-xs text-espresso-muted mt-1">{story.subtitle}</p>
          <div className="text-gold-500 text-xs tracking-[0.5em] mt-4">{global.dividerOrnament}</div>
        </div>

        {/* Collage grid */}
        <div className="flex flex-wrap justify-center gap-10">
          {Array.from({ length: totalItems }, (_, i) => (
            <StoryCollage key={i} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
