import React from 'react';
import { motion } from 'framer-motion';
import { weddingContent } from '../data/content';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

export default function Venue() {
  const { venue, global } = weddingContent;

  return (
    <section id="venue" className="py-24 px-4 bg-[#fcf8f2] text-espresso-text relative">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="font-script text-2xl sm:text-3xl text-[#D4848A] mb-1">
            {venue.eyebrow}
          </p>
          <h2 className="font-cormorant text-3xl sm:text-5xl font-normal tracking-wide text-espresso-text uppercase">
            The <span className="font-cormorant italic text-[#D4848A] font-medium">Venue</span>
          </h2>
          <div className="text-gold-500 text-xs tracking-[0.5em] my-4">
            {venue.divider}
          </div>
        </div>

        {/* Venue Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl p-8 sm:p-10 text-center mb-8 border border-gold-400/30 shadow-lg relative"
        >
          <div className="w-14 h-14 rounded-full bg-ivory-100 border border-gold-400/40 flex items-center justify-center mx-auto mb-5 text-gold-600">
            <MapPin className="w-6 h-6" />
          </div>

          <a
            href={venue.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 mb-2"
          >
            <h3 className="font-cormorant text-2xl sm:text-4xl font-medium tracking-wide text-espresso-text uppercase group-hover:text-gold-700 transition-colors">
              {venue.name}
            </h3>
            <ExternalLink className="w-4 h-4 text-gold-600 opacity-60 group-hover:opacity-100 transition-opacity" />
          </a>

          <p className="text-espresso-muted text-xs sm:text-sm font-light mb-8 max-w-md mx-auto">
            {venue.address}
          </p>

          <a
            href={venue.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gold-500 hover:bg-gold-600 text-white font-serif text-xs uppercase tracking-widest font-semibold shadow-md hover:shadow-lg transition-all"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Get Directions →</span>
          </a>
        </motion.div>

        {/* Embedded Google Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-3xl overflow-hidden border border-gold-400/30 shadow-lg h-[340px] sm:h-[400px] bg-stone-100"
        >
          <iframe
            title="Venue Map"
            src={venue.embedMapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.div>
      </div>
    </section>
  );
}
