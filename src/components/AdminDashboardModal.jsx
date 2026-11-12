import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { X, ShieldCheck, Users, Gift, Trash2, Plus, Calendar, Utensils, MessageSquare, Image, ExternalLink, RefreshCw } from 'lucide-react';
import { IMAGE_SLOTS, SlotCard, AddGalleryPhotoForm, AddedGalleryPhotoCard } from '../pages/Admin';
import { useImageContext } from '../contexts/ImageContext';

export default function AdminDashboardModal({ isOpen, onClose }) {
  const { galleryPhotos = [] } = useImageContext();
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
  }, [isOpen, activeTab]);

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
        className="relative w-full max-w-5xl h-[85vh] rounded-3xl bg-[#faf6ee] border border-gold-400/40 shadow-2xl flex flex-col overflow-hidden text-[#2c1810]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gold-400/20 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-400 flex items-center justify-center text-[#8c6721]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold gold-gradient-text uppercase">
                Admin Dashboard
              </h3>
              <p className="text-xs text-[#7c6a59]">Manage RSVPs, Wedding Registry & Settings</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#7c6a59] hover:text-[#8c6721] hover:bg-gold-500/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gold-400/20 bg-[#f5eedc] px-6">
          <button
            onClick={() => setActiveTab('rsvps')}
            className={`py-3 px-4 font-serif text-xs uppercase tracking-widest font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'rsvps'
                ? 'border-[#b8860b] text-[#8c6721]'
                : 'border-transparent text-[#7c6a59] hover:text-[#2c1810]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>RSVPs ({rsvpData.rsvps.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gifts')}
            className={`py-3 px-4 font-serif text-xs uppercase tracking-widest font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'gifts'
                ? 'border-[#b8860b] text-[#8c6721]'
                : 'border-transparent text-[#7c6a59] hover:text-[#2c1810]'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Gift Registry ({gifts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('photos')}
            className={`py-3 px-4 font-serif text-xs uppercase tracking-widest font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'photos'
                ? 'border-[#b8860b] text-[#8c6721]'
                : 'border-transparent text-[#7c6a59] hover:text-[#2c1810]'
            }`}
          >
            <Image className="w-4 h-4" />
            <span>Customize Photos</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-grow">
          {activeTab === 'rsvps' && (
            <div className="space-y-6">
              {/* Header with refresh and export */}
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-sm uppercase tracking-widest text-[#8c6721] font-semibold">
                  RSVP Submissions
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (!rsvpData.rsvps.length) return alert('No RSVPs to export.');
                      const headers = ['Guest Name', 'Contact', 'Guests Count', 'Meal Preference', 'Message', 'Submitted At'];
                      const rows = rsvData.rsvps.map(r => [
                        `"${(r.userName || '').replace(/"/g, '""')}"`,
                        `"${(r.userEmail || '').replace(/"/g, '""')}"`,
                        r.guestCount || 1,
                        `"${(r.mealPreference || '').replace(/"/g, '""')}"`,
                        `"${(r.message || '').replace(/"/g, '""')}"`,
                        `"${r.submittedAt ? new Date(r.submittedAt).toLocaleString('en-IN') : ''}"`
                      ]);
                      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
                      const link = document.createElement('a');
                      link.setAttribute('href', encodeURI(csvContent));
                      link.setAttribute('download', `rsvps_${new Date().toISOString().slice(0, 10)}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 text-xs font-serif uppercase tracking-wider transition-all"
                  >
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={loadAdminData}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold-500/30 bg-gold-500/10 hover:bg-gold-500/20 text-[#8c6721] text-xs font-serif uppercase tracking-wider transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    <span>{loading ? 'Loading…' : 'Refresh'}</span>
                  </button>
                </div>
              </div>
              {/* Summary Cards */}
              {rsvpData.summary && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white border border-gold-400/25 text-center">
                    <span className="text-[10px] uppercase font-serif text-[#7c6a59] block tracking-wider">Total Responses</span>
                    <span className="font-serif text-2xl font-bold text-[#8c6721]">{rsvpData.summary.totalResponses}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-gold-400/25 text-center">
                    <span className="text-[10px] uppercase font-serif text-[#7c6a59] block tracking-wider">Total Guest Count</span>
                    <span className="font-serif text-2xl font-bold text-[#8c6721]">{rsvpData.summary.totalGuests}</span>
                  </div>
                </div>
              )}

              {/* RSVP Table */}
              <div className="rounded-2xl border border-gold-400/25 overflow-hidden bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8f3e8] border-b border-gold-400/25 text-[#7c6a59] uppercase font-serif text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3.5">Guest</th>
                      <th className="p-3.5">Contact</th>
                      <th className="p-3.5">Guests</th>
                      <th className="p-3.5">Meal</th>
                      <th className="p-3.5">Message</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-500/10">
                    {rsvpData.rsvps.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-stone-500">
                          No RSVP submissions received yet.
                        </td>
                      </tr>
                    ) : (
                      rsvpData.rsvps.map((r) => (
                        <tr key={r.id} className="hover:bg-gold-500/5 align-top">
                          <td className="p-3.5">
                            <span className="font-semibold text-[#2c1810] block whitespace-nowrap">{r.userName}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="text-[10px] text-[#7c6a59]">{r.userEmail || '-'}</span>
                          </td>
                          <td className="p-3.5 font-medium text-[#8c6721] text-center">{r.guestCount || 1}</td>
                          <td className="p-3.5 text-[#4a3525] whitespace-nowrap">{r.mealPreference || '-'}</td>
                          <td className="p-3.5 min-w-[240px] max-w-md text-[#2c1810] italic whitespace-normal break-words leading-relaxed text-xs">
                            {r.message ? `"${r.message}"` : '-'}
                          </td>
                          <td className="p-3.5 text-stone-500 text-[10px] whitespace-nowrap">
                            {r.submittedAt ? new Date(r.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '-'}
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={async () => {
                                if (!window.confirm(`Delete RSVP for ${r.userName}?`)) return;
                                try {
                                  await api.adminDeleteRsvp(r.id);
                                  setRsvpData(prev => ({
                                    ...prev,
                                    rsvps: prev.rsvps.filter(item => item.id !== r.id),
                                    summary: prev.summary ? {
                                      ...prev.summary,
                                      totalResponses: Math.max(0, prev.summary.totalResponses - 1)
                                    } : null
                                  }));
                                } catch (e) {
                                  alert(e.message || 'Failed to delete');
                                }
                              }}
                              className="p-1 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded transition-all"
                              title="Delete RSVP"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'gifts' && (
            <div className="space-y-8">
              {/* Add New Gift Form */}
              <div className="p-5 rounded-2xl bg-white border border-gold-400/25">
                <h4 className="font-serif text-sm uppercase tracking-wider text-[#8c6721] font-semibold mb-3 flex items-center gap-1.5">
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
                      className="w-full p-2.5 rounded-lg bg-[#f8f3e8] border border-gold-400/25 text-[#2c1810] placeholder-stone-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Price (e.g. ₹15,000 or Any amount)"
                      value={newGift.price}
                      onChange={e => setNewGift({ ...newGift, price: e.target.value })}
                      required
                      className="w-full p-2.5 rounded-lg bg-[#f8f3e8] border border-gold-400/25 text-[#2c1810] placeholder-stone-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Image URL (Unsplash or direct image link)"
                      value={newGift.image}
                      onChange={e => setNewGift({ ...newGift, image: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-[#f8f3e8] border border-gold-400/25 text-[#2c1810] placeholder-stone-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <textarea
                      rows="2"
                      placeholder="Description"
                      value={newGift.description}
                      onChange={e => setNewGift({ ...newGift, description: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-[#f8f3e8] border border-gold-400/25 text-[#2c1810] placeholder-stone-500 resize-none"
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
              <div className="rounded-2xl border border-gold-400/25 overflow-hidden bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8f3e8] border-b border-gold-400/25 text-[#7c6a59] uppercase font-serif text-[10px] tracking-wider">
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
                          <img src={g.image} alt={g.name} className="w-12 h-10 object-cover rounded border border-gold-400/25" />
                        </td>
                        <td className="p-3.5 font-semibold text-[#2c1810]">{g.name}</td>
                        <td className="p-3.5 text-[#8c6721] font-medium">{g.price}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                            g.status === 'Reserved'
                              ? 'bg-crimson-950 border border-crimson-500/40 text-crimson-300'
                              : 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                          }`}>
                            {g.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-[#7c6a59]">{g.reservedByName || '-'}</td>
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

          {activeTab === 'photos' && (
            <div className="space-y-8">
              <div className="p-4 rounded-xl bg-white border border-gold-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-serif text-[#8c6721] font-semibold text-sm uppercase tracking-wider mb-1">
                    Photo &amp; Image Customization
                  </h4>
                  <p className="text-xs text-[#7c6a59]">
                    Upload photos to replace hero, our story, gallery, or family images. All changes sync in real-time.
                  </p>
                </div>
                <a
                  href="/admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg border border-gold-400/40 bg-gold-500/10 hover:bg-gold-500/20 text-[#8c6721] text-xs font-serif uppercase tracking-wider flex items-center gap-1.5 transition-all whitespace-nowrap"
                >
                  <span>Open Full Admin</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Slots Section */}
              <div className="space-y-8">
                {IMAGE_SLOTS.map((section) => (
                  <div key={section.section} className="space-y-3">
                    <h5 className="font-serif text-xs uppercase tracking-widest text-[#8c6721] font-bold border-b border-gold-400/25 pb-2">
                      {section.section}
                    </h5>

                    {section.section === 'Photo Gallery' && (
                      <div className="space-y-4">
                        <AddGalleryPhotoForm />
                        {galleryPhotos.length > 0 && (
                          <div>
                            <h6 className="font-serif text-xs text-[#8c6721] uppercase tracking-wider mb-2 font-semibold">
                              ✦ Extra Added Moments ({galleryPhotos.length})
                            </h6>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                              {galleryPhotos.map((photo) => (
                                <AddedGalleryPhotoCard key={photo.id} photo={photo} />
                              ))}
                            </div>
                          </div>
                        )}
                        <h6 className="font-serif text-[11px] text-[#7c6a59] uppercase tracking-wider mb-2">
                          Default Gallery Slots (1–9)
                        </h6>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {section.slots.map((slot) => (
                        <SlotCard key={slot.id} slot={slot} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
