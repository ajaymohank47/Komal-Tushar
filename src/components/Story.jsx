import React from 'react';
import { motion } from 'framer-motion';
import { weddingContent } from '../data/content';

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

                {/* Row: text + photo side by side */}
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

                  {/* Right: photo card */}
                  {item.image && (
                    <div className="flex-shrink-0 w-28 sm:w-36 rounded-2xl overflow-hidden border border-gold-400/25 shadow-md bg-white">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full aspect-[3/4] object-cover object-top hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
