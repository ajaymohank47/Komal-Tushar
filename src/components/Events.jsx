import React from 'react';
import { motion } from 'framer-motion';
import { weddingContent } from '../data/content';
import { ExternalLink } from 'lucide-react';

export default function Events() {
  const { events, global } = weddingContent;

  return (
    <section id="events" className="py-24 px-4 bg-[#fcf8f2] text-espresso-text relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="font-script text-2xl sm:text-3xl text-[#D4848A] mb-1">
            {events.eyebrow}
          </p>
          <h2 className="font-cormorant text-3xl sm:text-5xl font-normal tracking-wide text-espresso-text uppercase">
            Our <span className="font-cormorant italic text-[#D4848A] font-medium">Celebrations</span>
          </h2>
          <p className="font-serif italic text-sm text-espresso-muted mt-1">
            {events.subtitle}
          </p>
          <div className="text-gold-500 text-xs tracking-[0.5em] my-4">
            {global.dividerOrnament}
          </div>
        </div>

        {/* 4 Celebration Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.list.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="bg-white rounded-2xl p-6 border border-gold-400/30 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-ivory-100 border border-gold-400/30 flex items-center justify-center text-2xl mb-4 shadow-sm">
                  <span className="select-none">{event.icon}</span>
                </div>

                <h3 className="font-cormorant text-2xl font-medium text-espresso-text mb-5 leading-tight">
                  {event.title}
                </h3>

                {/* Event Details Rows */}
                <div className="space-y-3.5 text-xs text-espresso-muted font-light mb-6">
                  {event.date && (
                    <div className="flex items-start gap-2.5">
                      <span className="text-sm select-none">📅</span>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-gold-700 block font-serif font-semibold">Date</span>
                        <span className="text-espresso-text font-medium">{event.date}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-2.5">
                    <span className="text-sm select-none">🕐</span>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-gold-700 block font-serif font-semibold">Time</span>
                      <span className="text-espresso-text font-medium">{event.time}</span>
                    </div>
                  </div>

                  {event.venue && (
                    <div className="flex items-start gap-2.5">
                      <span className="text-sm select-none">📍</span>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-gold-700 block font-serif font-semibold">Venue</span>
                        <span className="text-espresso-text font-medium">{event.venue}</span>
                      </div>
                    </div>
                  )}

                  {event.dressCode && (
                    <div className="flex items-start gap-2.5">
                      <span className="text-sm select-none">{event.dressCodeIcon || "✨"}</span>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-gold-700 block font-serif font-semibold">
                          {event.dressCodeLabel || "Dress Code / Vibe"}
                        </span>
                        <span className="text-crimson-600 font-medium leading-relaxed block text-[11px] sm:text-xs">
                          {event.dressCode}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* View on Maps Link */}
              <a
                href={event.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl border border-gold-400/40 bg-ivory-50 hover:bg-gold-500/10 text-gold-700 font-serif text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 group-hover:border-gold-500 transition-all mt-auto"
              >
                <span>View on Maps</span>
                <span className="text-sm font-bold">→</span>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
