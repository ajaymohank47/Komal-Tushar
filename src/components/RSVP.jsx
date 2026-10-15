import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { weddingContent } from '../data/content';
import { CheckCircle2, Edit3, User, Phone } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RSVP() {
  const { rsvp, global } = weddingContent;

  const [guestName, setGuestName] = useState('');
  const [guestContact, setGuestContact] = useState('');
  const [attending, setAttending] = useState(true);
  const [guestCount, setGuestCount] = useState(1);
  const [events, setEvents] = useState({
    haldi: true,
    wedding: true,
    reception: true
  });
  const [mealPreference, setMealPreference] = useState('Vegetarian');
  const [message, setMessage] = useState('');

  const [submittedRsvp, setSubmittedRsvp] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    loadMyRsvp();
  }, []);

  const loadMyRsvp = async () => {
    try {
      setLoading(true);
      const data = await api.getMyRsvp();
      if (data) {
        setSubmittedRsvp(data);
        setGuestName(data.userName || '');
        setGuestContact(data.userEmail || '');
        setAttending(data.attending);
        setGuestCount(data.guestCount || 1);
        setEvents(data.events || { haldi: true, wedding: true, reception: true });
        setMealPreference(data.mealPreference || 'Vegetarian');
        setMessage(data.message || '');
      }
    } catch (err) {
      console.error('Error fetching RSVP:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEvent = (eventName) => {
    setEvents(prev => ({ ...prev, [eventName]: !prev[eventName] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setStatusMessage('Please enter your full name');
      return;
    }

    try {
      setSubmitting(true);
      setStatusMessage('');

      const res = await api.submitRsvp({
        name: guestName.trim(),
        email: guestContact.trim(),
        attending,
        guestCount: attending ? parseInt(guestCount, 10) : 0,
        events: attending ? events : { haldi: false, wedding: false, reception: false },
        mealPreference,
        message
      });

      setSubmittedRsvp(res.rsvp);
      setIsEditing(false);

      if (attending) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#d4af37', '#f3e5ab', '#8b2635', '#ffffff']
        });
      }
    } catch (err) {
      setStatusMessage(err.message || 'Failed to submit RSVP');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="py-24 px-4 bg-[#faf6ee] text-espresso-text relative">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="font-script text-2xl sm:text-3xl text-[#D4848A] mb-1">
            {rsvp.eyebrow}
          </p>
          <h2 className="font-cormorant text-3xl sm:text-5xl font-normal tracking-wide text-espresso-text uppercase">
            RSVP <span className="font-cormorant italic text-[#D4848A] font-medium">Now</span>
          </h2>
          <p className="font-serif italic text-sm text-espresso-muted mt-1">
            {rsvp.subtitle}
          </p>
          <div className="text-gold-500 text-xs tracking-[0.5em] my-4">
            {global.dividerOrnament}
          </div>
        </div>

        {/* Content Box */}
        {submittedRsvp && !isEditing ? (
          /* Thank You / Confirmed State */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 sm:p-10 text-center max-w-lg mx-auto border border-gold-400/30 shadow-lg"
          >
            <div className="w-14 h-14 rounded-full bg-ivory-100 border border-gold-500 mx-auto flex items-center justify-center text-gold-600 mb-5">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <span className="font-script text-2xl text-gold-600 block mb-1">
              Thank You!
            </span>
            <h3 className="font-cormorant text-2xl sm:text-3xl font-medium text-espresso-text mb-4">
              {submittedRsvp.attending
                ? `We are thrilled you're coming, ${submittedRsvp.userName}!`
                : `We will miss you, ${submittedRsvp.userName}!`}
            </h3>

            <div className="my-6 p-5 rounded-2xl bg-ivory-50 border border-gold-400/20 text-left text-xs sm:text-sm space-y-2 text-espresso-muted">
              <p>
                <strong className="text-espresso-text font-serif uppercase tracking-wider">Status:</strong>{' '}
                {submittedRsvp.attending ? 'Attending with Joy' : 'Unable to Attend'}
              </p>
              {submittedRsvp.attending && (
                <>
                  <p>
                    <strong className="text-espresso-text font-serif uppercase tracking-wider">Guests:</strong>{' '}
                    {submittedRsvp.guestCount}
                  </p>
                  <p>
                    <strong className="text-espresso-text font-serif uppercase tracking-wider">Events:</strong>{' '}
                    {[
                      submittedRsvp.events?.haldi ? 'Haldi' : null,
                      submittedRsvp.events?.wedding ? 'Wedding Ceremony' : null,
                      submittedRsvp.events?.reception ? 'Reception' : null
                    ].filter(Boolean).join(', ') || 'None selected'}
                  </p>
                  <p>
                    <strong className="text-espresso-text font-serif uppercase tracking-wider">Meal:</strong>{' '}
                    {submittedRsvp.mealPreference}
                  </p>
                </>
              )}
              {submittedRsvp.message && (
                <p>
                  <strong className="text-espresso-text font-serif uppercase tracking-wider">Message:</strong>{' '}
                  <span className="italic">"{submittedRsvp.message}"</span>
                </p>
              )}
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2.5 rounded-full border border-gold-500/50 hover:bg-gold-500/10 text-gold-700 font-serif text-xs uppercase tracking-widest font-semibold flex items-center gap-2 mx-auto transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Your Response</span>
            </button>
          </motion.div>
        ) : (
          /* RSVP Form */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 sm:p-10 max-w-xl mx-auto border border-gold-400/30 shadow-lg"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2 border-b border-gold-400/20">
                <div>
                  <label className="block font-serif text-xs uppercase tracking-widest text-espresso-text mb-2 font-medium">
                    Your Full Name <span className="text-crimson-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-ivory-50 border border-gold-400/30 text-espresso-text placeholder-stone-400 text-sm focus:outline-none focus:border-gold-500 transition-colors"
                    />
                    <User className="w-4 h-4 text-gold-600 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block font-serif text-xs uppercase tracking-widest text-espresso-text mb-2 font-medium">
                    Phone / Email
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={guestContact}
                      onChange={(e) => setGuestContact(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-ivory-50 border border-gold-400/30 text-espresso-text placeholder-stone-400 text-sm focus:outline-none focus:border-gold-500 transition-colors"
                    />
                    <Phone className="w-4 h-4 text-gold-600 absolute left-3 top-3" />
                  </div>
                </div>
              </div>
              {/* Attending Toggle */}
              <div>
                <label className="block font-serif text-xs uppercase tracking-widest text-espresso-text mb-2.5">
                  Will you be able to attend?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAttending(true)}
                    className={`py-3 px-4 rounded-xl font-serif text-xs font-semibold tracking-wider uppercase transition-all ${
                      attending
                        ? 'bg-gold-500 text-white shadow-md'
                        : 'bg-ivory-50 border border-gold-400/25 text-espresso-muted hover:border-gold-400'
                    }`}
                  >
                    Joyfully Accept 💐
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending(false)}
                    className={`py-3 px-4 rounded-xl font-serif text-xs font-semibold tracking-wider uppercase transition-all ${
                      !attending
                        ? 'bg-crimson-600 text-white shadow-md'
                        : 'bg-ivory-50 border border-gold-400/25 text-espresso-muted hover:border-gold-400'
                    }`}
                  >
                    Regretfully Decline
                  </button>
                </div>
              </div>

              {attending && (
                <>
                  {/* Number of Guests */}
                  <div>
                    <label className="block font-serif text-xs uppercase tracking-widest text-espresso-text mb-2">
                      Total Number of Guests
                    </label>
                    <div className="flex items-center gap-2.5">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setGuestCount(num)}
                          className={`w-10 h-10 rounded-xl font-serif text-sm font-semibold transition-all ${
                            guestCount === num
                              ? 'bg-gold-500 text-white shadow-sm'
                              : 'bg-ivory-50 border border-gold-400/25 text-espresso-text hover:border-gold-400'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Per-event attendance */}
                  <div>
                    <label className="block font-serif text-xs uppercase tracking-widest text-espresso-text mb-2.5">
                      Events you will attend:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <label
                        className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                          events.haldi
                            ? 'bg-gold-50 border-gold-500 text-gold-900 font-medium'
                            : 'bg-ivory-50 border-gold-400/25 text-espresso-muted'
                        }`}
                        onClick={() => handleToggleEvent('haldi')}
                      >
                        <span className="text-xs font-serif">🌼 Haldi</span>
                        <input
                          type="checkbox"
                          checked={events.haldi}
                          readOnly
                          className="accent-gold-500 w-4 h-4 cursor-pointer"
                        />
                      </label>

                      <label
                        className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                          events.wedding
                            ? 'bg-gold-50 border-gold-500 text-gold-900 font-medium'
                            : 'bg-ivory-50 border-gold-400/25 text-espresso-muted'
                        }`}
                        onClick={() => handleToggleEvent('wedding')}
                      >
                        <span className="text-xs font-serif">🪔 Ceremony</span>
                        <input
                          type="checkbox"
                          checked={events.wedding}
                          readOnly
                          className="accent-gold-500 w-4 h-4 cursor-pointer"
                        />
                      </label>

                      <label
                        className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                          events.reception
                            ? 'bg-gold-50 border-gold-500 text-gold-900 font-medium'
                            : 'bg-ivory-50 border-gold-400/25 text-espresso-muted'
                        }`}
                        onClick={() => handleToggleEvent('reception')}
                      >
                        <span className="text-xs font-serif">🥂 Reception</span>
                        <input
                          type="checkbox"
                          checked={events.reception}
                          readOnly
                          className="accent-gold-500 w-4 h-4 cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Meal Preference */}
                  <div>
                    <label className="block font-serif text-xs uppercase tracking-widest text-espresso-text mb-2">
                      Meal Preference
                    </label>
                    <select
                      value={mealPreference}
                      onChange={(e) => setMealPreference(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-ivory-50 border border-gold-400/30 text-espresso-text text-sm focus:outline-none focus:border-gold-500"
                    >
                      {rsvp.mealOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Message */}
              <div>
                <label className="block font-serif text-xs uppercase tracking-widest text-espresso-text mb-2">
                  Warm message for Komal & Tushar
                </label>
                <textarea
                  rows="3"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Leave a lovely note or wishes..."
                  className="w-full px-4 py-2.5 rounded-xl bg-ivory-50 border border-gold-400/30 text-espresso-text text-sm placeholder-stone-400 focus:outline-none focus:border-gold-500 resize-none"
                ></textarea>
              </div>

              {statusMessage && (
                <p className="text-xs text-red-500">{statusMessage}</p>
              )}

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gold-400/20">
                {submittedRsvp && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-xs font-serif uppercase tracking-wider text-espresso-muted hover:text-espresso-text"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-7 py-2.5 rounded-full bg-gold-500 hover:bg-gold-600 text-white font-serif text-xs uppercase tracking-widest font-semibold shadow-md"
                >
                  {submitting ? 'Saving...' : 'Confirm RSVP'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </section>
  );
}
