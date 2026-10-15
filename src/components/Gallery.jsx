import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { weddingContent } from '../data/content';
import { X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

export default function Gallery() {
  const { gallery, global } = weddingContent;
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filteredPhotos = activeFilter === 'All'
    ? gallery.photos
    : gallery.photos.filter((p) => p.category.toLowerCase() === activeFilter.toLowerCase());

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : filteredPhotos.length - 1));
  };

  const nextPhoto = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev < filteredPhotos.length - 1 ? prev + 1 : 0));
  };

  return (
    <section id="gallery" className="py-24 px-4 bg-[#faf6ee] text-espresso-text relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="font-script text-2xl sm:text-3xl text-[#D4848A] mb-1">
            {gallery.eyebrow}
          </p>
          <h2 className="font-cormorant text-3xl sm:text-5xl font-normal tracking-wide text-espresso-text uppercase">
            Photo <span className="font-cormorant italic text-[#D4848A] font-medium">Gallery</span>
          </h2>
          <p className="font-serif italic text-sm text-espresso-muted mt-1">
            {gallery.subtitle}
          </p>
          <div className="text-gold-500 text-xs tracking-[0.5em] my-4">
            {global.dividerOrnament}
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {gallery.filterChips.map((chip) => {
            const isActive = activeFilter.toLowerCase() === chip.toLowerCase();
            return (
              <button
                key={chip}
                onClick={() => setActiveFilter(chip)}
                className={`px-5 py-2 rounded-full text-xs uppercase tracking-widest font-serif transition-all ${
                  isActive
                    ? 'bg-gold-500 text-white font-bold shadow-md scale-105'
                    : 'bg-white text-espresso-muted border border-gold-400/30 hover:border-gold-500 hover:text-gold-700 shadow-sm'
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>

        {/* Responsive Photo Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                onClick={() => openLightbox(index)}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer bg-white border border-gold-400/30 shadow-md hover:shadow-xl transition-all"
              >
                <img
                  src={photo.url}
                  alt={photo.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Hover overlay with Category Tag & Title */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-gold-500/80 text-white font-serif text-[10px] uppercase tracking-widest w-max mb-1">
                    {photo.category}
                  </span>
                  <h4 className="font-cormorant text-lg font-medium">
                    {photo.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-gold-300 mt-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-light">View photo</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fadeIn"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-2 rounded-full bg-stone-900/80 text-stone-300 hover:text-white border border-gold-500/30 transition-colors z-50"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevPhoto}
            className="absolute left-4 sm:left-8 p-3 rounded-full bg-stone-900/80 text-stone-200 hover:text-gold-300 border border-gold-500/30 transition-all z-50 hover:scale-110"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-4xl max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filteredPhotos[lightboxIndex].url}
              alt={filteredPhotos[lightboxIndex].alt}
              className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain border border-gold-400/40 shadow-2xl"
            />
            <div className="mt-4 text-center">
              <span className="inline-block px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-serif uppercase tracking-widest mb-1">
                {filteredPhotos[lightboxIndex].category}
              </span>
              <h3 className="font-cormorant text-xl text-stone-100 font-medium">
                {filteredPhotos[lightboxIndex].title}
              </h3>
              <p className="text-xs text-stone-400">
                {filteredPhotos[lightboxIndex].alt} · {lightboxIndex + 1} of {filteredPhotos.length}
              </p>
            </div>
          </div>

          <button
            onClick={nextPhoto}
            className="absolute right-4 sm:right-8 p-3 rounded-full bg-stone-900/80 text-stone-200 hover:text-gold-300 border border-gold-500/30 transition-all z-50 hover:scale-110"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </section>
  );
}
