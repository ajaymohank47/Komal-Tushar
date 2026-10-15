import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { weddingContent } from '../data/content';
import { Gift, Lock, AlertCircle, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Registry() {
  const { registry, global } = weddingContent;
  const { user } = useAuth();

  const [giftsList, setGiftsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    loadGifts();
  }, []);

  const loadGifts = async () => {
    try {
      setLoading(true);
      const data = await api.getGifts();
      const cleaned = (data || []).filter(g => !g.name.includes('TEST_UI_Gift'));
      setGiftsList(cleaned);
    } catch (err) {
      console.error('Error loading gifts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async (gift) => {
    const guestName = window.prompt(`Enter your name to reserve "${gift.name}" for Komal & Tushar:`);
    if (!guestName || !guestName.trim()) return;

    try {
      setProcessingId(gift.id);
      setActionError('');
      const res = await api.reserveGift(gift.id, guestName.trim());

      setGiftsList(prev => prev.map(g => g.id === gift.id ? res.gift : g));

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#d4af37', '#e2c974', '#ffffff']
      });
    } catch (err) {
      setActionError(err.message || 'Unable to reserve gift');
    } finally {
      setProcessingId(null);
    }
  };

  const handleUnreserve = async (gift) => {
    try {
      setProcessingId(gift.id);
      setActionError('');
      const res = await api.unreserveGift(gift.id);
      setGiftsList(prev => prev.map(g => g.id === gift.id ? res.gift : g));
    } catch (err) {
      setActionError(err.message || 'Unable to un-reserve gift');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <section id="registry" className="py-24 px-4 bg-[#faf6ee] text-espresso-text relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="font-script text-2xl sm:text-3xl text-[#D4848A] mb-1">
            {registry.eyebrow}
          </p>
          <h2 className="font-cormorant text-3xl sm:text-5xl font-normal tracking-wide text-espresso-text uppercase">
            Gift <span className="font-cormorant italic text-[#D4848A] font-medium">Registry</span>
          </h2>
          <p className="font-serif italic text-sm text-espresso-muted mt-1">
            {registry.subtitle}
          </p>
          <div className="text-gold-500 text-xs tracking-[0.5em] my-4">
            {global.dividerOrnament}
          </div>
        </div>

        {actionError && (
          <div className="max-w-md mx-auto mb-6 p-3 bg-red-100 border border-red-300 rounded-xl text-xs text-red-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{actionError}</span>
            </div>
            <button onClick={() => setActionError('')} className="text-stone-500 hover:text-stone-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Gift Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {giftsList.map((gift, index) => {
            const isReserved = gift.status === 'Reserved';
            const isReservedByMe = isReserved && user && (gift.reservedBy === user.id || user.isAdmin);
            const isProcessing = processingId === gift.id;

            return (
              <motion.div
                key={gift.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden border border-gold-400/30 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Image & Status Badge */}
                <div className="relative aspect-[4/3] overflow-hidden bg-ivory-100">
                  <img
                    src={gift.image}
                    alt={gift.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    {isReserved ? (
                      <span className="px-3 py-1 rounded-full bg-crimson-600 text-white text-[10px] font-serif uppercase tracking-widest font-semibold shadow-md">
                        Reserved
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-emerald-700 text-white text-[10px] font-serif uppercase tracking-widest font-semibold shadow-md">
                        Available
                      </span>
                    )}
                  </div>

                  {/* Price overlay */}
                  <div className="absolute bottom-3 left-4">
                    <span className="font-cormorant text-xl font-semibold text-white drop-shadow">
                      {gift.price}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="font-cormorant text-2xl font-medium text-espresso-text mb-2">
                      {gift.name}
                    </h3>
                    <p className="text-espresso-muted text-xs sm:text-sm font-light leading-relaxed mb-6">
                      {gift.description}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    {isReserved ? (
                      isReservedByMe ? (
                        <div className="space-y-2">
                          <div className="p-2 rounded-lg bg-ivory-100 border border-gold-400/30 text-center text-[11px] text-gold-800 font-medium">
                            Reserved by you ✦
                          </div>
                          <button
                            onClick={() => handleUnreserve(gift)}
                            disabled={isProcessing}
                            className="w-full py-2 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 text-xs font-serif uppercase tracking-wider transition-colors"
                          >
                            {isProcessing ? 'Updating...' : 'Cancel Reservation'}
                          </button>
                        </div>
                      ) : (
                        <button
                          disabled
                          className="w-full py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-400 font-serif text-xs uppercase tracking-widest cursor-not-allowed flex items-center justify-center gap-1.5"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Already Reserved</span>
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => handleReserve(gift)}
                        disabled={isProcessing}
                        className="w-full py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-serif text-xs uppercase tracking-widest font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <Gift className="w-4 h-4" />
                        <span>{isProcessing ? 'Reserving...' : 'Reserve this gift'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
