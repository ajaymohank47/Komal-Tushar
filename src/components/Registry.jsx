import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { weddingContent } from '../data/content';
import { Gift, Lock, AlertCircle, X, Check, Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabase';

export default function Registry() {
  const { registry = {}, global = {} } = weddingContent;
  const { user } = useAuth();

  const [giftsList, setGiftsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState('');
  const [processingId, setProcessingId] = useState(null);

  // Reservation modal state
  const [modalGift, setModalGift] = useState(null);
  const [guestName, setGuestName] = useState('');
  const [guestNote, setGuestNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadGifts();

    // Realtime Supabase synchronization so all visitors see reservations live
    if (!supabase) return;

    const channel = supabase
      .channel('wedding_gifts_realtime_channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'wedding_gifts' },
        (payload) => {
          if (payload.eventType === 'UPDATE' && payload.new) {
            setGiftsList((prev) =>
              prev.map((g) =>
                g.id === payload.new.id
                  ? {
                      ...g,
                      name: payload.new.name,
                      price: payload.new.price,
                      description: payload.new.description,
                      image: payload.new.image,
                      status: payload.new.status,
                      reservedBy: payload.new.reserved_by,
                      reservedByName: payload.new.reserved_by_name,
                      reservedAt: payload.new.reserved_at,
                    }
                  : g
              )
            );
          } else {
            loadGifts();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadGifts = async () => {
    try {
      setLoading(true);
      const data = await api.getGifts();
      const cleaned = (data || []).filter((g) => !g.name?.includes('TEST_UI_Gift'));
      setGiftsList(cleaned);
    } catch (err) {
      console.error('Error loading gifts:', err);
    } finally {
      setLoading(false);
    }
  };

  const openReserveModal = (gift) => {
    if (gift.status === 'Reserved') return;
    setModalGift(gift);
    setGuestName(user?.name || '');
    setGuestNote('');
    setActionError('');
  };

  const closeReserveModal = () => {
    if (submitting) return;
    setModalGift(null);
    setGuestName('');
    setGuestNote('');
  };

  const handleConfirmReservation = async (e) => {
    e.preventDefault();
    if (!modalGift || !guestName.trim()) return;

    try {
      setSubmitting(true);
      setActionError('');
      const res = await api.reserveGift(modalGift.id, guestName.trim());

      setGiftsList((prev) =>
        prev.map((g) => (g.id === modalGift.id ? res.gift : g))
      );

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#f3e5ab', '#8b2635', '#ffffff'],
      });

      setModalGift(null);
    } catch (err) {
      setActionError(err.message || 'Unable to reserve gift.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnreserve = async (gift) => {
    if (!window.confirm(`Cancel your reservation for "${gift.name}"?`)) return;

    try {
      setProcessingId(gift.id);
      setActionError('');
      const res = await api.unreserveGift(gift.id);
      setGiftsList((prev) =>
        prev.map((g) => (g.id === gift.id ? res.gift : g))
      );
    } catch (err) {
      setActionError(err.message || 'Unable to cancel reservation.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <section id="registry" className="py-24 px-4 bg-[#faf6ee] text-espresso-text relative scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="font-script text-2xl sm:text-3xl text-[#D4848A] mb-1">
            {registry.eyebrow || 'Bless our new beginnings'}
          </p>
          <h2 className="font-cormorant text-3xl sm:text-5xl font-normal tracking-wide text-espresso-text uppercase">
            Reserve a <span className="font-cormorant italic text-[#D4848A] font-medium">Gift</span>
          </h2>
          <p className="font-serif italic text-sm text-espresso-muted mt-2 max-w-md mx-auto">
            {registry.subtitle || 'Reserve a wedding gift below so we do not receive duplicates. Once reserved, an item cannot be reserved by anyone else.'}
          </p>
          <div className="text-gold-500 text-xs tracking-[0.5em] my-4">
            {global.dividerOrnament || '✦ ✦ ✦'}
          </div>
        </div>

        {/* Action Error Banner */}
        {actionError && (
          <div className="max-w-md mx-auto mb-8 p-3.5 bg-red-100 border border-red-300 rounded-xl text-xs text-red-800 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{actionError}</span>
            </div>
            <button
              onClick={() => setActionError('')}
              className="text-stone-500 hover:text-stone-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Gift Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {giftsList.map((gift, index) => {
            const isReserved = gift.status === 'Reserved';
            const isReservedByMe =
              isReserved && user && (gift.reservedBy === user.id || user.isAdmin);
            const isProcessing = processingId === gift.id;

            return (
              <motion.div
                key={gift.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className={`bg-white rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between group ${
                  isReserved
                    ? 'border-gold-300/30 opacity-95 shadow-sm'
                    : 'border-gold-400/40 shadow-md hover:shadow-xl hover:border-gold-500'
                }`}
              >
                {/* Image & Status Badge */}
                <div className="relative aspect-[4/3] overflow-hidden bg-ivory-100">
                  <img
                    src={gift.image}
                    alt={gift.name}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      !isReserved ? 'group-hover:scale-105' : 'grayscale-[15%]'
                    }`}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    {isReserved ? (
                      <span className="px-3 py-1 rounded-full bg-[#8b2635] text-white text-[10px] font-serif uppercase tracking-widest font-semibold shadow-md flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>Reserved</span>
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-emerald-700 text-white text-[10px] font-serif uppercase tracking-widest font-semibold shadow-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Available</span>
                      </span>
                    )}
                  </div>


                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="font-cormorant text-2xl font-medium text-espresso-text mb-2 leading-snug">
                      {gift.name}
                    </h3>
                    <p className="text-espresso-muted text-xs sm:text-sm font-light leading-relaxed mb-6">
                      {gift.description}
                    </p>
                  </div>

                  {/* Action Button & Reservation Info */}
                  <div className="pt-2 border-t border-gold-400/15">
                    {isReserved ? (
                      isReservedByMe ? (
                        <div className="space-y-2">
                          <div className="p-2 rounded-lg bg-gold-50 border border-gold-400/40 text-center text-[11px] text-gold-900 font-medium">
                            ✦ Reserved by you
                          </div>
                          <button
                            onClick={() => handleUnreserve(gift)}
                            disabled={isProcessing}
                            className="w-full py-2 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 text-xs font-serif uppercase tracking-wider transition-colors"
                          >
                            {isProcessing ? 'Updating…' : 'Cancel Reservation'}
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <button
                            disabled
                            className="w-full py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-stone-400 font-serif text-xs uppercase tracking-widest cursor-not-allowed flex items-center justify-center gap-1.5"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            <span>Already Reserved</span>
                          </button>
                          <p className="text-[10px] text-center text-stone-400 italic">
                            Reserved by {gift.reservedByName || 'a wedding guest'}
                          </p>
                        </div>
                      )
                    ) : (
                      <button
                        onClick={() => openReserveModal(gift)}
                        disabled={isProcessing}
                        className="w-full py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 active:scale-[0.99] text-white font-serif text-xs uppercase tracking-widest font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <Gift className="w-4 h-4" />
                        <span>Reserve this gift</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Reservation Confirmation Modal */}
      <AnimatePresence>
        {modalGift && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
            onClick={closeReserveModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-[#140c06] text-stone-100 rounded-3xl border border-gold-400/40 p-6 sm:p-8 shadow-2xl overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={closeReserveModal}
                disabled={submitting}
                className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-400 flex items-center justify-center text-gold-400 flex-shrink-0">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-cormorant text-2xl font-bold gold-gradient-text uppercase">
                    Reserve Wedding Gift
                  </h3>
                  <p className="text-xs text-stone-400 font-serif">
                    Komal &amp; Tushar · December 13, 2026
                  </p>
                </div>
              </div>

              {/* Selected Gift Preview */}
              <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-black/50 border border-gold-400/20 mb-6">
                <img
                  src={modalGift.image}
                  alt={modalGift.name}
                  className="w-16 h-16 rounded-xl object-cover border border-gold-400/30 flex-shrink-0"
                />
                <div>
                  <h4 className="font-cormorant text-lg font-medium text-stone-200 leading-tight">
                    {modalGift.name}
                  </h4>

                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleConfirmReservation} className="space-y-4">
                <div>
                  <label className="block text-xs font-serif uppercase tracking-widest text-gold-300 font-semibold mb-1.5">
                    Your Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. Priya &amp; Rahul Sharma"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-gold-500/30 text-stone-100 text-sm focus:border-gold-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-serif uppercase tracking-widest text-gold-300 font-semibold mb-1.5">
                    Blessing / Warm Note (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Wishing you both a lifetime of happiness..."
                    value={guestNote}
                    onChange={(e) => setGuestNote(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-obsidian-950 border border-gold-500/30 text-stone-100 text-xs focus:border-gold-400 focus:outline-none resize-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-gold-500/10 border border-gold-500/20 text-[11px] text-gold-200/90 leading-relaxed">
                  ✦ <strong>Note:</strong> Once confirmed, this gift will be permanently marked as <strong>Reserved</strong> under your name so no one else can reserve it.
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeReserveModal}
                    disabled={submitting}
                    className="flex-1 py-2.5 rounded-xl border border-stone-700 hover:border-stone-500 text-stone-300 font-serif text-xs uppercase tracking-wider transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !guestName.trim()}
                    className="flex-1 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 disabled:bg-stone-800 disabled:text-stone-500 text-white font-serif text-xs uppercase tracking-widest font-semibold shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    {submitting ? (
                      <span>Reserving…</span>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Confirm Reservation</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
