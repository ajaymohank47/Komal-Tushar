import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { X, ShieldCheck, Users, Gift, Trash2, Plus, Calendar, Utensils, MessageSquare } from 'lucide-react';

export default function AdminDashboardModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('rsvps');
  const [rsvpData, setRsvpData] = useState({ summary: null, rsvps: [] });
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add Gift form state
  const [newGift, setNewGift] = useState({
    name: '',
    price: '',
    description: '',
    image: ''
  });
  const [savingGift, setSavingGift] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadAdminData();
    }
  }, [isOpen]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [rsvpsRes, giftsRes] = await Promise.all([
        api.adminGetRsvps().catch(() => ({ summary: null, rsvps: [] })),
        api.getGifts().catch(() => [])
      ]);
      setRsvpData(rsvpsRes);
      setGifts(giftsRes || []);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGift = async (e) => {
    e.preventDefault();
    if (!newGift.name || !newGift.price) return;
    try {
      setSavingGift(true);
      const res = await api.adminAddGift(newGift);
      setGifts(prev => [...prev, res.gift]);
      setNewGift({ name: '', price: '', description: '', image: '' });
    } catch (err) {
      alert(err.message || 'Failed to add gift');
    } finally {
      setSavingGift(false);
    }
  };

  const handleDeleteGift = async (id) => {
    if (!confirm('Are you sure you want to delete this gift from the registry?')) return;
    try {
      await api.adminDeleteGift(id);
      setGifts(prev => prev.filter(g => g.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete gift');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-5xl h-[85vh] rounded-3xl bg-[#120d0a] border border-gold-500/30 shadow-2xl flex flex-col overflow-hidden text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gold-500/20 bg-obsidian-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-400 flex items-center justify-center text-gold-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold gold-gradient-text uppercase">
                Admin Dashboard
              </h3>
              <p className="text-xs text-stone-400">Manage RSVPs, Wedding Registry & Settings</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-gold-300 hover:bg-gold-500/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gold-500/15 bg-obsidian-900/60 px-6">
          <button
            onClick={() => setActiveTab('rsvps')}
            className={`py-3 px-4 font-serif text-xs uppercase tracking-widest font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'rsvps'
                ? 'border-gold-400 text-gold-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>RSVPs ({rsvpData.rsvps.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gifts')}
            className={`py-3 px-4 font-serif text-xs uppercase tracking-widest font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'gifts'
                ? 'border-gold-400 text-gold-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Gift Registry ({gifts.length})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-grow">
          {activeTab === 'rsvps' ? (
            <div className="space-y-6">
              {/* Summary Cards */}
              {rsvpData.summary && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-obsidian-950 border border-gold-500/20 text-center">
                    <span className="text-[10px] uppercase font-serif text-stone-400 block tracking-wider">Total Responses</span>
                    <span className="font-serif text-2xl font-bold text-gold-300">{rsvpData.summary.totalResponses}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-obsidian-950 border border-gold-500/20 text-center">
                    <span className="text-[10px] uppercase font-serif text-stone-400 block tracking-wider">Attending Parties</span>
                    <span className="font-serif text-2xl font-bold text-emerald-400">{rsvpData.summary.attendingCount}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-obsidian-950 border border-gold-500/20 text-center">
                    <span className="text-[10px] uppercase font-serif text-stone-400 block tracking-wider">Total Guest Count</span>
                    <span className="font-serif text-2xl font-bold text-gold-200">{rsvpData.summary.totalGuests}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-obsidian-950 border border-gold-500/20 text-center">
                    <span className="text-[10px] uppercase font-serif text-stone-400 block tracking-wider">Declined</span>
                    <span className="font-serif text-2xl font-bold text-stone-400">{rsvpData.summary.declinedCount}</span>
                  </div>
                </div>
              )}

              {/* RSVP Table */}
              <div className="rounded-2xl border border-gold-500/20 overflow-hidden bg-obsidian-950">
                <table className="w-full text-left text-xs">
                  <thead className="bg-obsidian-900 border-b border-gold-500/20 text-stone-400 uppercase font-serif text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3.5">Guest</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Guests</th>
                      <th className="p-3.5">Events</th>
                      <th className="p-3.5">Meal</th>
                      <th className="p-3.5">Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-500/10">
                    {rsvpData.rsvps.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-stone-500">
                          No RSVP submissions received yet.
                        </td>
                      </tr>
                    ) : (
                      rsvpData.rsvps.map((r) => (
                        <tr key={r.id} className="hover:bg-gold-500/5">
                          <td className="p-3.5">
                            <span className="font-semibold text-stone-200 block">{r.userName}</span>
                            <span className="text-[10px] text-stone-400">{r.userEmail}</span>
                          </td>
                          <td className="p-3.5">
                            {r.attending ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-semibold uppercase">
                                Attending
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-crimson-950 border border-crimson-500/40 text-crimson-300 text-[10px] font-semibold uppercase">
                                Declined
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 font-medium">{r.attending ? r.guestCount : 0}</td>
                          <td className="p-3.5 text-stone-300">
                            {r.attending ? (
                              <div className="flex gap-1 flex-wrap">
                                {r.events?.haldi && <span className="px-1.5 py-0.5 rounded bg-yellow-950/60 border border-yellow-500/30 text-yellow-300 text-[10px]">Haldi</span>}
                                {r.events?.wedding && <span className="px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-500/30 text-amber-300 text-[10px]">Ceremony</span>}
                                {r.events?.reception && <span className="px-1.5 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300 text-[10px]">Reception</span>}
                              </div>
                            ) : '-'}
                          </td>
                          <td className="p-3.5 text-stone-300">{r.attending ? r.mealPreference : '-'}</td>
                          <td className="p-3.5 max-w-xs truncate text-stone-300 italic">{r.message || '-'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Add New Gift Form */}
              <div className="p-5 rounded-2xl bg-obsidian-950 border border-gold-500/20">
                <h4 className="font-serif text-sm uppercase tracking-wider text-gold-400 font-semibold mb-3 flex items-center gap-1.5">
                  <Plus className="w-4 h-4" />
                  <span>Add New Registry Item</span>
                </h4>
                <form onSubmit={handleAddGift} className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <input
                      type="text"
                      placeholder="Gift Name (e.g. Vintage Record Player)"
                      value={newGift.name}
                      onChange={e => setNewGift({ ...newGift, name: e.target.value })}
                      required
                      className="w-full p-2.5 rounded-lg bg-obsidian-900 border border-gold-500/20 text-stone-100 placeholder-stone-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Price (e.g. ₹15,000 or Any amount)"
                      value={newGift.price}
                      onChange={e => setNewGift({ ...newGift, price: e.target.value })}
                      required
                      className="w-full p-2.5 rounded-lg bg-obsidian-900 border border-gold-500/20 text-stone-100 placeholder-stone-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Image URL (Unsplash or direct image link)"
                      value={newGift.image}
                      onChange={e => setNewGift({ ...newGift, image: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-obsidian-900 border border-gold-500/20 text-stone-100 placeholder-stone-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <textarea
                      rows="2"
                      placeholder="Description"
                      value={newGift.description}
                      onChange={e => setNewGift({ ...newGift, description: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-obsidian-900 border border-gold-500/20 text-stone-100 placeholder-stone-500 resize-none"
                    ></textarea>
                  </div>
                  <div className="sm:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={savingGift}
                      className="px-6 py-2 rounded-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-serif font-bold uppercase tracking-wider"
                    >
                      {savingGift ? 'Saving...' : 'Add Gift to Registry'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Gift Items Table */}
              <div className="rounded-2xl border border-gold-500/20 overflow-hidden bg-obsidian-950">
                <table className="w-full text-left text-xs">
                  <thead className="bg-obsidian-900 border-b border-gold-500/20 text-stone-400 uppercase font-serif text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3.5">Image</th>
                      <th className="p-3.5">Gift</th>
                      <th className="p-3.5">Price</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Reserved By</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-500/10">
                    {gifts.map(g => (
                      <tr key={g.id} className="hover:bg-gold-500/5">
                        <td className="p-3.5">
                          <img src={g.image} alt={g.name} className="w-12 h-10 object-cover rounded border border-gold-500/20" />
                        </td>
                        <td className="p-3.5 font-semibold text-stone-200">{g.name}</td>
                        <td className="p-3.5 text-gold-300 font-medium">{g.price}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                            g.status === 'Reserved'
                              ? 'bg-crimson-950 border border-crimson-500/40 text-crimson-300'
                              : 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                          }`}>
                            {g.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-stone-400">{g.reservedByName || '-'}</td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleDeleteGift(g.id)}
                            className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded transition-all"
                            title="Delete Gift"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
