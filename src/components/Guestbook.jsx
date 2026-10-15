import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { weddingContent } from '../data/content';
import { MessageSquare, Send, Trash2, User } from 'lucide-react';

export default function Guestbook() {
  const { guestbook, global } = weddingContent;
  const { isAdmin } = useAuth();

  const [wishes, setWishes] = useState([]);
  const [authorName, setAuthorName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadWishes();
  }, []);

  const loadWishes = async () => {
    try {
      setLoading(true);
      const data = await api.getGuestbook();
      setWishes(data || []);
    } catch (err) {
      console.error('Failed to load guestbook:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostWish = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setPosting(true);
      setErrorMsg('');
      const res = await api.postGuestbook(message.trim(), authorName.trim() || 'Well-Wisher');
      setWishes(prev => [res.entry, ...prev]);
      setMessage('');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to post your wish');
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteWish = async (id) => {
    if (!confirm('Are you sure you want to remove this wish?')) return;
    try {
      await api.adminDeleteGuestbook(id);
      setWishes(prev => prev.filter(w => w.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete wish');
    }
  };

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return '';
    }
  };

  return (
    <section id="guestbook" className="py-24 px-4 bg-[#fcf8f2] text-espresso-text relative">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="font-script text-2xl sm:text-3xl text-[#D4848A] mb-1">
            {guestbook.eyebrow}
          </p>
          <h2 className="font-cormorant text-3xl sm:text-5xl font-normal tracking-wide text-espresso-text uppercase">
            Guest <span className="font-cormorant italic text-[#D4848A] font-medium">Book</span>
          </h2>
          <p className="font-serif italic text-sm text-espresso-muted mt-1">
            {guestbook.subtitle}
          </p>
          <div className="text-gold-500 text-xs tracking-[0.5em] my-4">
            {global.dividerOrnament}
          </div>
        </div>

        {/* Post Form */}
        <div className="mb-14">
          <motion.form
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handlePostWish}
            className="bg-white rounded-3xl p-6 sm:p-7 max-w-xl mx-auto border border-gold-400/30 shadow-md"
          >
            <div className="mb-3">
              <label className="block font-serif text-[11px] uppercase tracking-wider text-espresso-text mb-1 font-medium">
                Your Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Rahul & Neha"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-ivory-50 border border-gold-400/30 text-espresso-text placeholder-stone-400 text-sm focus:outline-none focus:border-gold-500"
                />
                <User className="w-4 h-4 text-gold-600 absolute left-3 top-3" />
              </div>
            </div>

            <div className="mb-3">
              <label className="block font-serif text-[11px] uppercase tracking-wider text-espresso-text mb-1 font-medium">
                Blessing / Wish for the Couple
              </label>
              <textarea
                rows="3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your prayers, love, or warm memories for Komal & Tushar..."
                className="w-full p-3.5 rounded-xl bg-ivory-50 border border-gold-400/30 text-espresso-text placeholder-stone-400 text-sm focus:outline-none focus:border-gold-500 resize-none"
              ></textarea>
            </div>

            {errorMsg && <p className="text-xs text-red-500 mb-2">{errorMsg}</p>}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={posting || !message.trim()}
                className="px-6 py-2.5 rounded-full bg-gold-500 hover:bg-gold-600 text-white font-serif text-xs uppercase tracking-widest font-semibold shadow-md disabled:opacity-50 transition-all flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{posting ? 'Posting...' : 'Post Blessing'}</span>
              </button>
            </div>
          </motion.form>
        </div>

        {/* Wishes List */}
        <div className="space-y-4 max-w-xl mx-auto">
          {wishes.map((wish) => (
            <motion.div
              key={wish.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-white border border-gold-400/25 shadow-sm flex items-start gap-4 relative group hover:shadow-md transition-all"
            >
              <img
                src={wish.userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(wish.userName)}`}
                alt={wish.userName}
                className="w-10 h-10 rounded-full border border-gold-400 flex-shrink-0 object-cover mt-0.5"
              />

              <div className="flex-grow">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-cormorant text-lg font-medium text-espresso-text">
                    {wish.userName}
                  </h4>
                  <span className="text-[10px] text-espresso-muted font-serif">
                    {formatDate(wish.createdAt)}
                  </span>
                </div>

                <p className="text-espresso-muted text-xs sm:text-sm leading-relaxed font-light whitespace-pre-line">
                  {wish.message}
                </p>
              </div>

              {isAdmin && (
                <button
                  onClick={() => handleDeleteWish(wish.id)}
                  title="Moderate wish"
                  className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-red-500 rounded transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
