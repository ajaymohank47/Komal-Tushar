import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { weddingContent } from '../data/content';
import { useImageContext } from '../contexts/ImageContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// All possible story slots (5 groups × 3 photos)
const STORY_SLOT_IDS = [];
for (let g = 1; g <= 5; g++) {
  for (let p = 1; p <= 3; p++) {
    STORY_SLOT_IDS.push(`story-${g}-${p}`);
  }
}

const SWIPE_THRESHOLD = 80;
const SWIPE_VELOCITY  = 350;

function CardDeck({ images }) {
  // cards[0] = top of deck
  const [cards, setCards]   = useState(images);
  const [leaving, setLeaving] = useState(false);
  const [exitDir, setExitDir] = useState(0); // -1 left, +1 right

  // keep in sync if images change (e.g. uploads)
  useEffect(() => { setCards(images); }, [images.join(',')]);

  const throwCard = (dir) => {
    if (leaving || cards.length <= 1) return;
    setLeaving(true);
    setExitDir(dir);
    setTimeout(() => {
      setCards(prev => {
        const [top, ...rest] = prev;
        return [...rest, top]; // cycle to back
      });
      setLeaving(false);
      setExitDir(0);
    }, 380);
  };

  const handleDragEnd = (_, info) => {
    const big = Math.abs(info.offset.x) > SWIPE_THRESHOLD;
    const fast = Math.abs(info.velocity.x) > SWIPE_VELOCITY;
    if (big || fast) throwCard(info.offset.x > 0 ? 1 : -1);
  };

  const show = cards.slice(0, Math.min(4, cards.length));

  return (
    <div className="relative flex flex-col items-center gap-6">
      {/* Card stack */}
      <div className="relative flex items-center justify-center select-none"
           style={{ width: 280, height: 380 }}>
        {show.map((src, i) => {
          const isTop  = i === 0;
          const depth  = i;
          const rot    = depth === 0 ? 0 : (i % 2 === 0 ? depth * 5 : -depth * 5);
          const scaleV = 1 - depth * 0.045;
          const yV     = depth * 12;

          return (
            <motion.div
              key={src}
              className="absolute rounded-2xl overflow-hidden border border-gold-300/40 shadow-2xl bg-white"
              style={{
                width: 240,
                zIndex: show.length - i,
                cursor: isTop ? 'grab' : 'default',
              }}
              initial={false}
              animate={
                isTop && leaving
                  ? { x: exitDir * 450, rotate: exitDir * 28, opacity: 0, scale: 0.9 }
                  : { rotate: rot, scale: scaleV, y: yV, x: 0, opacity: 1 }
              }
              transition={{ duration: isTop && leaving ? 0.38 : 0.4, ease: 'easeOut' }}
              drag={isTop && !leaving ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.75}
              whileDrag={{ scale: 1.04, boxShadow: '0 24px 48px rgba(0,0,0,0.3)', cursor: 'grabbing' }}
              onDragEnd={isTop ? handleDragEnd : undefined}
            >
              <img
                src={src}
                alt="moment"
                className="w-full object-cover object-top pointer-events-none"
                style={{ aspectRatio: '3/4', display: 'block' }}
                draggable={false}
              />
              {/* Subtle gradient on top card */}
              {isTop && (
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 mt-2">
        <button
          onClick={() => throwCard(-1)}
          disabled={leaving}
          className="p-2.5 rounded-full bg-white border border-gold-400/40 text-gold-700 shadow-sm hover:bg-gold-50 hover:border-gold-500 transition-all disabled:opacity-40"
          aria-label="Previous"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Dot indicators */}
        <div className="flex gap-1.5 items-center">
          {cards.slice(0, Math.min(cards.length, 8)).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === 0
                  ? 'w-3 h-3 bg-gold-500'
                  : 'w-1.5 h-1.5 bg-gold-400/40'
              }`}
            />
          ))}
          {cards.length > 8 && (
            <span className="text-[10px] text-espresso-muted font-serif ml-1">+{cards.length - 8}</span>
          )}
        </div>

        <button
          onClick={() => throwCard(1)}
          disabled={leaving}
          className="p-2.5 rounded-full bg-white border border-gold-400/40 text-gold-700 shadow-sm hover:bg-gold-50 hover:border-gold-500 transition-all disabled:opacity-40"
          aria-label="Next"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <p className="text-[10px] text-espresso-muted font-serif tracking-widest uppercase opacity-70">
        drag or swipe to browse
      </p>
    </div>
  );
}

export default function Story() {
  const { story, global } = weddingContent;
  const { images } = useImageContext();

  // Collect all uploaded story images in slot order
  const storyImages = STORY_SLOT_IDS.map(id => images[id]).filter(Boolean);

  return (
    <section id="story" className="py-20 px-4 bg-[#faf6ee] text-espresso-text relative overflow-hidden">
      <div className="max-w-xl mx-auto flex flex-col items-center">

        {/* Heading */}
        <div className="text-center mb-14">
          <p className="font-script text-2xl sm:text-3xl text-[#D4848A] mb-1">our</p>
          <h2 className="font-cormorant text-4xl sm:text-6xl font-normal tracking-wide text-espresso-text uppercase">
            Mo<span className="italic text-[#D4848A] font-medium">ment</span>s
          </h2>
          <div className="text-gold-500 text-xs tracking-[0.5em] mt-4">{global.dividerOrnament}</div>
        </div>

        {/* Card deck — only shown when photos are uploaded */}
        {storyImages.length > 0 ? (
          <CardDeck images={storyImages} />
        ) : (
          <p className="text-center text-espresso-muted font-serif italic text-sm opacity-60">
            Upload photos from the admin panel to fill this section.
          </p>
        )}

      </div>
    </section>
  );
}
