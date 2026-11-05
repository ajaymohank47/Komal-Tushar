import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { weddingContent } from '../data/content';
import { X, ChevronLeft, ChevronRight, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { useImage } from '../hooks/useImage';
import { useImageContext } from '../contexts/ImageContext';

/** Inner component so useImage hook can be called per photo */
function GalleryPhoto({ photo, index, onClick }) {
  const slotNum = photo.id ? photo.id.replace(/^gal-/, '') : String(index + 1);
  const slotId = `gallery-${slotNum}`;
  // For custom photos, photo.url is already their uploaded URL
  const src = photo.isCustom ? photo.url : useImage(slotId, photo.url);

  return (
    <motion.div
      key={photo.id}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      onClick={() => onClick(index)}
      className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer bg-white border border-gold-400/30 shadow-md hover:shadow-xl transition-all"
    >
      <img
        src={src}
        alt={photo.alt || photo.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      {/* Hover overlay — eye icon only */}
      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="flex items-center gap-1.5 text-white">
          <Eye className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
}

/** Lightbox image — shows uploaded or fallback photo */
function LightboxImage({ photo }) {
  const slotNum = photo.id ? photo.id.replace(/^gal-/, '') : '1';
  const slotId = `gallery-${slotNum}`;
  const src = photo.isCustom ? photo.url : useImage(slotId, photo.url);
  return (
    <img
      src={src}
      alt={photo.alt || photo.title}
      className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain border border-gold-400/40 shadow-2xl"
    />
  );
}

export default function Gallery() {
  const { gallery, global } = weddingContent;
  const { galleryPhotos = [] } = useImageContext();

  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Combine default 9 photos with any custom photos added via Supabase
  const allPhotos = [
    ...gallery.photos,
    ...galleryPhotos.map((p) => ({
      id: p.id,
      category: p.category,
      title: p.title,
      alt: p.title,
      url: p.image_url,
      isCustom: true
    }))
  ];

  // Dynamically compute category chips (standard + any added custom categories)
  const standardChips = ["All", "prewedding", "engagement", "family", "travel"];
  const customCategories = Array.from(
    new Set(
      galleryPhotos
        .map((p) => (p.category || '').trim().toLowerCase())
        .filter((cat) => cat && !standardChips.map(c => c.toLowerCase()).includes(cat))
    )
  );
  const filterChips = [...standardChips, ...customCategories];

  // Filter photos
  const filteredPhotos = activeFilter.toLowerCase() === 'all'
    ? allPhotos
    : allPhotos.filter((p) => (p.category || '').toLowerCase() === activeFilter.toLowerCase());

  // Show only first 9 if not expanded
  const INITIAL_LIMIT = 9;
  const hasMore = filteredPhotos.length > INITIAL_LIMIT;
  const displayedPhotos = isExpanded || !hasMore
    ? filteredPhotos
    : filteredPhotos.slice(0, INITIAL_LIMIT);

  const handleFilterChange = (chip) => {
    setActiveFilter(chip);
    setIsExpanded(false); // Reset expansion on filter change
  };

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
          {filterChips.map((chip) => {
            const isActive = activeFilter.toLowerCase() === chip.toLowerCase();
            return (
              <button
                key={chip}
                onClick={() => handleFilterChange(chip)}
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
            {displayedPhotos.map((photo, index) => (
              <GalleryPhoto
                key={photo.id}
                photo={photo}
                index={index}
                onClick={openLightbox}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Expand / Collapse Button if more than 9 pictures */}
        {hasMore && (
          <div className="mt-12 text-center">
            {!isExpanded ? (
              <button
                onClick={() => setIsExpanded(true)}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border-2 border-gold-500/60 bg-gradient-to-r from-gold-500/10 via-gold-500/20 to-gold-500/10 hover:from-gold-500 hover:to-gold-600 hover:text-white text-gold-900 font-serif text-xs uppercase tracking-widest font-bold shadow-md hover:shadow-xl transition-all duration-300 group"
              >
                <span>View More Moments ({filteredPhotos.length - INITIAL_LIMIT} more)</span>
                <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5 text-gold-700 group-hover:text-white" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsExpanded(false);
                  document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full border border-gold-400/40 bg-white hover:bg-gold-50 text-espresso-muted hover:text-gold-800 font-serif text-xs uppercase tracking-widest font-medium transition-all shadow-sm"
              >
                <span>Show Less</span>
                <ChevronUp className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
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
            <LightboxImage
              photo={filteredPhotos[lightboxIndex]}
            />
            <div className="mt-4 text-center">
              <p className="text-xs text-stone-400">
                {lightboxIndex + 1} of {filteredPhotos.length}
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
