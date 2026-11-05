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

  // Only render if at least one image is available
  if (!img1 && !img2 && !img3) return null;

  const photos = [img1, img2, img3].filter(Boolean);

  // Three slightly rotated polaroid cards
  const rotations = ['-rotate-3', 'rotate-2', '-rotate-1'];
  const offsets = [
    'translate-x-0 translate-y-0',
    'translate-x-3 translate-y-4',
    'translate-x-1 translate-y-8',
  ];

  return (
    <div className="flex-shrink-0 relative w-28 sm:w-36" style={{ height: 160 }}>
      {photos.map((src, pi) => (
        <div
          key={pi}
          className={`absolute bg-white shadow-md border border-gold-300/40 rounded-sm overflow-hidden
            ${rotations[pi] || ''} ${offsets[pi] || ''}
            transition-transform duration-300 hover:scale-105 hover:z-10`}
          style={{
            width: pi === 0 ? 90 : pi === 1 ? 78 : 70,
            top: pi === 0 ? 0 : pi === 1 ? 18 : 36,
            left: pi === 0 ? 0 : pi === 1 ? 14 : 28,
            zIndex: photos.length - pi,
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
    </div>
  );
}

function StoryItem({ item, index }) {
  return (
    <motion.div
      key={item.year}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      className="relative"
    >
      {/* Dot on spine */}
      <div className="absolute -left-8 sm:-left-10 top-1 w-4 h-4 rounded-full bg-[#faf6ee] border-2 border-gold-500 flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-gold-500" />
      </div>

      {/* Year label */}
      <span className="font-cormorant text-[11px] uppercase tracking-[0.3em] text-[#D4848A] font-semibold block mb-1">
        {item.year}
      </span>

      {/* Row: text + collage side by side */}
      <div className="flex gap-5 items-start">
        {/* Left: text */}
        <div className="flex-1 min-w-0">
          <h3 className="font-cormorant text-xl sm:text-2xl text-espresso-text font-normal mb-1.5 leading-tight">
            {item.title}
          </h3>
          <p className="text-espresso-muted text-[11px] sm:text-xs font-light leading-relaxed">
            {item.text}
          </p>
        </div>

        {/* Right: floating collage (only if images uploaded) */}
        <StoryCollage index={index} />
      </div>
    </motion.div>
  );
}

export default function Story() {
  const { story, global } = weddingContent;

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

        {/* Timeline */}
        <div className="relative">
          {/* Vertical gold spine */}
          <div className="absolute left-0 top-2 bottom-8 w-[1px] bg-gradient-to-b from-gold-500/80 via-gold-400/40 to-transparent" />

          <div className="space-y-14 pl-8 sm:pl-10">
            {story.timeline.map((item, index) => (
              <StoryItem key={item.year} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
