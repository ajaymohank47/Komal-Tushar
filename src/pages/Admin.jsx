import React, { useState, useRef } from 'react';
import { useImageContext } from '../contexts/ImageContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Fallback images
import storyImg1 from '../assets/images/story/story-1.svg';
import storyImg2 from '../assets/images/story/story-2.svg';
import storyImg3 from '../assets/images/story/story-3.svg';
import storyImg4 from '../assets/images/story/story-4.svg';
import storyImg5 from '../assets/images/story/story-5.svg';
import galleryImg1 from '../assets/images/gallery/gallery-1.svg';
import galleryImg2 from '../assets/images/gallery/gallery-2.svg';
import galleryImg3 from '../assets/images/gallery/gallery-3.svg';
import galleryImg4 from '../assets/images/gallery/gallery-4.svg';
import galleryImg5 from '../assets/images/gallery/gallery-5.svg';
import galleryImg6 from '../assets/images/gallery/gallery-6.svg';
import galleryImg7 from '../assets/images/gallery/gallery-7.svg';
import galleryImg8 from '../assets/images/gallery/gallery-8.svg';
import galleryImg9 from '../assets/images/gallery/gallery-9.svg';
import dayanandImg from '../assets/images/family/dayanand.svg';
import geetaImg from '../assets/images/family/geeta.jpg';
import tejasImg from '../assets/images/family/tejas.jpg';
import sayaliImg from '../assets/images/family/sayali.jpg';
import shashikantImg from '../assets/images/family/shashikant.jpg';
import sushmaImg from '../assets/images/family/sushma.jpg';
import sarveshImg from '../assets/images/family/sarvesh.jpg';
import akshatatImg from '../assets/images/family/Akshatat.jpg';
import heroImg from '../assets/images/hero.png';

export const ADMIN_PASSWORD = 'komal2026';

export const IMAGE_SLOTS = [
  {
    section: 'Hero Section',
    slots: [
      { id: 'hero', label: 'Hero Background', fallback: heroImg },
    ],
  },
  {
    section: 'Our Story',
    slots: [
      { id: 'story-1', label: '1. First Meeting (2020)', fallback: storyImg1 },
      { id: 'story-2', label: '2. First Date (2021)', fallback: storyImg2 },
      { id: 'story-3', label: '3. The Proposal (2024)', fallback: storyImg3 },
      { id: 'story-4', label: '4. Engagement (2025)', fallback: storyImg4 },
      { id: 'story-5', label: '5. Wedding Day (2026)', fallback: storyImg5 },
    ],
  },
  {
    section: 'Photo Gallery',
    slots: [
      { id: 'gallery-1', label: 'Gallery 1 · Sunset Serenade', fallback: galleryImg1 },
      { id: 'gallery-2', label: 'Gallery 2 · The Ring Exchange', fallback: galleryImg2 },
      { id: 'gallery-3', label: 'Gallery 3 · Stolen Whispers', fallback: galleryImg3 },
      { id: 'gallery-4', label: 'Gallery 4 · Udaipur Lakes', fallback: galleryImg4 },
      { id: 'gallery-5', label: 'Gallery 5 · Family Celebrations', fallback: galleryImg5 },
      { id: 'gallery-6', label: 'Gallery 6 · Laughter & Lights', fallback: galleryImg6 },
      { id: 'gallery-7', label: 'Gallery 7 · Mountain Getaway', fallback: galleryImg7 },
      { id: 'gallery-8', label: 'Gallery 8 · Royal Palace Walk', fallback: galleryImg8 },
      { id: 'gallery-9', label: 'Gallery 9 · Under the Stars', fallback: galleryImg9 },
    ],
  },
  {
    section: "Groom's Family",
    slots: [
      { id: 'family-dayanand', label: 'Dayanand Pawar (Father)', fallback: dayanandImg },
      { id: 'family-geeta', label: 'Geeta Pawar (Mother)', fallback: geetaImg },
      { id: 'family-tejas', label: 'Tejas Pawar (Brother)', fallback: tejasImg },
      { id: 'family-sayali', label: 'Sayali Jadhav-Pawar (Sister-in-law)', fallback: sayaliImg },
    ],
  },
  {
    section: "Bride's Family",
    slots: [
      { id: 'family-shashikant', label: 'Shashikant Shinde (Father)', fallback: shashikantImg },
      { id: 'family-sushma', label: 'Sushma Shinde (Mother)', fallback: sushmaImg },
      { id: 'family-sarvesh', label: 'Sarvesh Shinde (Brother)', fallback: sarveshImg },
      { id: 'family-akshatat', label: 'Akshatat Shinde (Sister)', fallback: akshatatImg },
    ],
  },
];

export function SlotCard({ slot }) {
  const { images, setImage, removeImage } = useImageContext();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null); // null | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState('');

  const isCustomized = Boolean(images[slot.id]);
  const currentSrc = images[slot.id] || slot.fallback;

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!isSupabaseConfigured || !supabase) {
      setStatus('error');
      setErrorMsg('Supabase is not configured. Please check your .env credentials.');
      return;
    }

    setUploading(true);
    setStatus(null);
    setErrorMsg('');

    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file (JPEG, PNG, WEBP, etc.)');
      }

      const ext = file.name.split('.').pop() || 'jpg';
      const cleanSlotId = slot.id.replace(/[^a-zA-Z0-9_-]/g, '_');
      const path = `${cleanSlotId}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('wedding-photos')
        .upload(path, file, { 
          cacheControl: '3600',
          upsert: true 
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('wedding-photos')
        .getPublicUrl(path);

      const publicUrl = urlData?.publicUrl;
      if (!publicUrl) throw new Error('Could not get public URL from Supabase');

      await setImage(slot.id, publicUrl);
      setStatus('success');
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      console.error('Upload failed', err);
      setStatus('error');
      setErrorMsg(err?.message || 'Upload failed. Check Supabase connection.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveUrl = async (e) => {
    e.preventDefault();
    if (!urlValue.trim()) return;

    setUploading(true);
    setStatus(null);
    setErrorMsg('');

    try {
      await setImage(slot.id, urlValue.trim());
      setStatus('success');
      setShowUrlInput(false);
      setUrlValue('');
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      console.error('URL save failed', err);
      setStatus('error');
      setErrorMsg(err?.message || 'Could not save image URL.');
    } finally {
      setUploading(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm(`Reset "${slot.label}" back to original default?`)) return;

    setUploading(true);
    setStatus(null);
    setErrorMsg('');

    try {
      if (removeImage) {
        await removeImage(slot.id);
      } else {
        await setImage(slot.id, '');
      }
      setStatus('success');
      setTimeout(() => setStatus(null), 2500);
    } catch (err) {
      console.error('Reset failed', err);
      setStatus('error');
      setErrorMsg(err?.message || 'Failed to reset.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        background: '#261a09',
        border: '1px solid #3d2e0e',
        borderRadius: 12,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        position: 'relative',
      }}
    >
      {/* Top Header: Label + Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: '#d4af37',
            fontSize: 13,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            margin: 0,
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={slot.label}
        >
          {slot.label}
        </p>
        <span
          style={{
            fontSize: 9,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '2px 6px',
            borderRadius: 4,
            fontWeight: 700,
            background: isCustomized ? '#166534' : '#33230f',
            color: isCustomized ? '#86efac' : '#9a804e',
            border: `1px solid ${isCustomized ? '#22c55e' : '#57411a'}`,
          }}
        >
          {isCustomized ? 'Custom' : 'Default'}
        </span>
      </div>

      {/* Preview */}
      <div
        style={{
          width: '100%',
          height: 115,
          borderRadius: 8,
          overflow: 'hidden',
          border: '1px solid #3d2e0e',
          background: '#1a1209',
          position: 'relative',
        }}
      >
        <img
          src={currentSrc}
          alt={slot.label}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {status === 'success' && (
          <div
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              background: '#16a34a',
              color: '#ffffff',
              borderRadius: '50%',
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 'bold',
              boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
            }}
          >
            ✓
          </div>
        )}
      </div>

      {/* Slot ID */}
      <p
        style={{
          fontFamily: 'monospace',
          fontSize: 10,
          color: '#8b7040',
          margin: 0,
          letterSpacing: '0.05em',
        }}
      >
        slot: {slot.id}
      </p>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          style={{
            background: uploading ? '#3d2e0e' : '#d4af37',
            color: uploading ? '#7a6030' : '#1a1209',
            border: 'none',
            borderRadius: 7,
            padding: '8px 12px',
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: uploading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
            width: '100%',
          }}
        >
          {uploading ? 'Uploading…' : isCustomized ? '↩ Replace Photo' : '↑ Upload Photo'}
        </button>

        {/* Alternate actions: Reset or URL paste */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => setShowUrlInput(!showUrlInput)}
            type="button"
            disabled={uploading}
            style={{
              flex: 1,
              background: 'transparent',
              border: '1px solid #3d2e0e',
              color: '#9a804e',
              borderRadius: 6,
              padding: '4px 6px',
              fontSize: 11,
              fontFamily: 'serif',
              cursor: 'pointer',
            }}
          >
            {showUrlInput ? 'Cancel URL' : 'Link URL'}
          </button>

          {isCustomized && (
            <button
              onClick={handleReset}
              type="button"
              disabled={uploading}
              title="Reset back to default photo"
              style={{
                flex: 1,
                background: 'transparent',
                border: '1px solid #7f1d1d',
                color: '#f87171',
                borderRadius: 6,
                padding: '4px 6px',
                fontSize: 11,
                fontFamily: 'serif',
                cursor: 'pointer',
              }}
            >
              Reset
            </button>
          )}
        </div>

        {/* URL Input field if toggled */}
        {showUrlInput && (
          <form onSubmit={handleSaveUrl} style={{ display: 'flex', gap: 4, marginTop: 4 }}>
            <input
              type="url"
              placeholder="https://..."
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              style={{
                flex: 1,
                background: '#1a1209',
                border: '1px solid #4a3814',
                borderRadius: 5,
                padding: '4px 6px',
                color: '#f5e6c8',
                fontSize: 11,
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={!urlValue.trim() || uploading}
              style={{
                background: '#d4af37',
                color: '#1a1209',
                border: 'none',
                borderRadius: 5,
                padding: '4px 8px',
                fontSize: 10,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Set
            </button>
          </form>
        )}
      </div>

      {status === 'error' && (
        <p style={{ color: '#f87171', fontSize: 11, margin: 0, lineHeight: 1.4 }}>
          ⚠ {errorMsg}
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleUpload}
      />
    </div>
  );
}

/** Form card to add new photos to the "Our Moments" Gallery with category filter selection */
export function AddGalleryPhotoForm() {
  const { addGalleryPhoto } = useImageContext();
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('prewedding');
  const [customCategory, setCustomCategory] = useState('');
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState('');
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const CATEGORIES = [
    { id: 'prewedding', label: 'Pre-Wedding' },
    { id: 'engagement', label: 'Engagement' },
    { id: 'family', label: 'Family' },
    { id: 'travel', label: 'Travel' },
    { id: 'custom', label: '+ Other Category' },
  ];

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please choose an image file (JPG, PNG, WEBP, etc.)');
      return;
    }
    setSelectedFile(file);
    setPreviewSrc(URL.createObjectURL(file));
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isUrlMode && !selectedFile) {
      setErrorMsg('Please choose a photo file to upload.');
      return;
    }
    if (isUrlMode && !imageUrl.trim()) {
      setErrorMsg('Please enter an image URL.');
      return;
    }

    const finalCategory = (category === 'custom' ? customCategory.trim() : category) || 'prewedding';
    if (category === 'custom' && !customCategory.trim()) {
      setErrorMsg('Please enter a name for the custom category.');
      return;
    }

    setUploading(true);
    setStatus(null);
    setErrorMsg('');

    try {
      let finalUrl = imageUrl.trim();

      if (!isUrlMode && selectedFile) {
        if (!isSupabaseConfigured || !supabase) {
          throw new Error('Supabase is not configured. Please check your .env credentials.');
        }

        const ext = selectedFile.name.split('.').pop() || 'jpg';
        const cleanName = selectedFile.name.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 20);
        const path = `gallery-added/${Date.now()}_${cleanName}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('wedding-photos')
          .upload(path, selectedFile, {
            cacheControl: '3600',
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('wedding-photos')
          .getPublicUrl(path);

        if (!urlData?.publicUrl) throw new Error('Could not get public URL from Supabase.');
        finalUrl = urlData.publicUrl;
      }

      await addGalleryPhoto({
        title: title.trim() || 'Our Moment',
        category: finalCategory.toLowerCase(),
        imageUrl: finalUrl,
      });

      setStatus('success');
      setTitle('');
      setImageUrl('');
      setSelectedFile(null);
      setPreviewSrc('');
      setCustomCategory('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => setStatus(null), 3500);
    } catch (err) {
      console.error('Failed to add gallery photo:', err);
      setStatus('error');
      setErrorMsg(err.message || 'Failed to add photo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        background: '#1f1508',
        border: '1.5px solid #d4af37',
        borderRadius: 14,
        padding: '20px 24px',
        marginBottom: 24,
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: '#d4af37',
              fontSize: 18,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              margin: 0,
              fontWeight: 700,
            }}
          >
            ✦ Add New Photo to "Our Moments" Gallery
          </h3>
          <p style={{ color: '#a08552', fontSize: 12, margin: '4px 0 0', fontFamily: 'serif' }}>
            Upload extra pictures and assign them to a category filter. If more than 9 pictures are added, the website provides an elegant "View More Moments" expand button.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
          {/* Photo Title */}
          <div>
            <label
              style={{
                display: 'block',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 12,
                color: '#d4af37',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 6,
                fontWeight: 600,
              }}
            >
              Photo Caption / Title
            </label>
            <input
              type="text"
              placeholder="e.g. Sunset in Udaipur, Haldi Fun..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                background: '#140c04',
                border: '1px solid #4a3814',
                borderRadius: 8,
                padding: '9px 12px',
                color: '#f5e6c8',
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'serif',
              }}
            />
          </div>

          {/* Category Filter Selector */}
          <div>
            <label
              style={{
                display: 'block',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 12,
                color: '#d4af37',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 6,
                fontWeight: 600,
              }}
            >
              Select Filter / Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: '100%',
                background: '#140c04',
                border: '1px solid #4a3814',
                borderRadius: 8,
                padding: '9px 12px',
                color: '#f5e6c8',
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'serif',
                cursor: 'pointer',
              }}
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id} style={{ background: '#1a1209' }}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Custom Category Input if selected */}
        {category === 'custom' && (
          <div>
            <label
              style={{
                display: 'block',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 12,
                color: '#d4af37',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 6,
              }}
            >
              Custom Category Name
            </label>
            <input
              type="text"
              placeholder="e.g. haldi, reception, sangeet"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              style={{
                width: '100%',
                background: '#140c04',
                border: '1px solid #4a3814',
                borderRadius: 8,
                padding: '9px 12px',
                color: '#f5e6c8',
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'serif',
              }}
            />
          </div>
        )}

        {/* Image Source Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
          <span style={{ fontSize: 12, color: '#a08552', fontFamily: 'serif' }}>Source:</span>
          <button
            type="button"
            onClick={() => setIsUrlMode(false)}
            style={{
              background: !isUrlMode ? '#d4af37' : 'transparent',
              color: !isUrlMode ? '#1a1209' : '#a08552',
              border: `1px solid ${!isUrlMode ? '#d4af37' : '#4a3814'}`,
              borderRadius: 6,
              padding: '4px 12px',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'serif',
              textTransform: 'uppercase',
            }}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setIsUrlMode(true)}
            style={{
              background: isUrlMode ? '#d4af37' : 'transparent',
              color: isUrlMode ? '#1a1209' : '#a08552',
              border: `1px solid ${isUrlMode ? '#d4af37' : '#4a3814'}`,
              borderRadius: 6,
              padding: '4px 12px',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'serif',
              textTransform: 'uppercase',
            }}
          >
            Paste URL
          </button>
        </div>

        {/* Upload File Input / URL Input */}
        {!isUrlMode ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{
                background: '#2b1c09',
                border: '1px dashed #d4af37',
                borderRadius: 8,
                padding: '12px 18px',
                color: '#d4af37',
                fontSize: 13,
                fontFamily: 'serif',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span>📁 {selectedFile ? `Selected: ${selectedFile.name}` : 'Click to Pick Image from Computer / Phone'}</span>
            </button>
            {previewSrc && (
              <img
                src={previewSrc}
                alt="Preview"
                style={{ width: 44, height: 44, borderRadius: 6, objectFit: 'cover', border: '1px solid #d4af37' }}
              />
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
          </div>
        ) : (
          <div>
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              style={{
                width: '100%',
                background: '#140c04',
                border: '1px solid #4a3814',
                borderRadius: 8,
                padding: '9px 12px',
                color: '#f5e6c8',
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'serif',
              }}
            />
          </div>
        )}

        {/* Feedback messages */}
        {errorMsg && (
          <p style={{ color: '#f87171', fontSize: 12, margin: 0 }}>
            ⚠ {errorMsg}
          </p>
        )}
        {status === 'success' && (
          <p style={{ color: '#4ade80', fontSize: 13, margin: 0, fontWeight: 600 }}>
            ✓ Photo added to Gallery successfully! Visitors will see it immediately.
          </p>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={uploading}
            style={{
              background: uploading ? '#4a3814' : '#d4af37',
              color: uploading ? '#8b7040' : '#140c04',
              border: 'none',
              borderRadius: 8,
              padding: '10px 24px',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: uploading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {uploading ? 'Uploading to Supabase…' : '+ Add Photo to Gallery'}
          </button>
        </div>
      </form>
    </div>
  );
}

/** Card for each dynamically added gallery photo (with delete capability) */
export function AddedGalleryPhotoCard({ photo }) {
  const { deleteGalleryPhoto } = useImageContext();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete photo "${photo.title}" from the gallery?`)) return;
    setDeleting(true);
    try {
      await deleteGalleryPhoto(photo.id, photo.image_url);
    } catch (err) {
      alert(err.message || 'Failed to delete photo.');
      setDeleting(false);
    }
  };

  return (
    <div
      style={{
        background: '#261a09',
        border: '1px solid #d4af37/50',
        borderRadius: 12,
        padding: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: '#d4af37',
            fontSize: 13,
            letterSpacing: '0.08em',
            margin: 0,
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={photo.title}
        >
          {photo.title}
        </p>
        <span
          style={{
            fontSize: 9,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '2px 6px',
            borderRadius: 4,
            fontWeight: 700,
            background: '#047857',
            color: '#a7f3d0',
            border: '1px solid #10b981',
          }}
        >
          {photo.category}
        </span>
      </div>

      <div
        style={{
          width: '100%',
          height: 115,
          borderRadius: 8,
          overflow: 'hidden',
          border: '1px solid #3d2e0e',
          background: '#1a1209',
        }}
      >
        <img
          src={photo.image_url}
          alt={photo.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 9, color: '#8b7040', fontFamily: 'monospace' }}>
          Added {new Date(photo.created_at).toLocaleDateString()}
        </span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{
            background: 'transparent',
            border: '1px solid #7f1d1d',
            color: '#f87171',
            borderRadius: 6,
            padding: '3px 8px',
            fontSize: 11,
            fontFamily: 'serif',
            cursor: deleting ? 'not-allowed' : 'pointer',
          }}
        >
          {deleting ? 'Deleting…' : '🗑 Delete'}
        </button>
      </div>
    </div>
  );
}

export default function Admin() {
  const { galleryPhotos = [] } = useImageContext();
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const pageStyle = {
    minHeight: '100vh',
    background: '#1a1209',
    color: '#f5e6c8',
    fontFamily: "'Cormorant Garamond', serif",
    padding: '0 0 60px',
  };

  const headingStyle = {
    fontFamily: "'Cormorant Garamond', serif",
    color: '#d4af37',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    margin: 0,
  };

  // ── Password Gate ──────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div
        style={{
          ...pageStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            background: '#261a09',
            border: '1px solid #3d2e0e',
            borderRadius: 16,
            padding: '40px 36px',
            width: '100%',
            maxWidth: 380,
            textAlign: 'center',
          }}
        >
          <p style={{ color: '#d4af37', fontSize: 28, marginBottom: 4, ...headingStyle }}>
            ✦ Admin Panel
          </p>
          <p style={{ color: '#7a6030', fontSize: 13, marginBottom: 28, fontFamily: 'serif' }}>
            Komal &amp; Tushar · Wedding Site
          </p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
              style={{
                background: '#1a1209',
                border: `1px solid ${authError ? '#f87171' : '#3d2e0e'}`,
                borderRadius: 8,
                padding: '10px 14px',
                color: '#f5e6c8',
                fontFamily: 'serif',
                fontSize: 15,
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
            {authError && (
              <p style={{ color: '#f87171', fontSize: 12, margin: 0 }}>
                Incorrect password. Try again.
              </p>
            )}
            <button
              type="submit"
              style={{
                background: '#d4af37',
                color: '#1a1209',
                border: 'none',
                borderRadius: 8,
                padding: '11px 0',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: "'Cormorant Garamond', serif",
              }}
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Admin Dashboard ────────────────────────────────────────────────
  return (
    <div style={pageStyle}>
      {/* Header */}
      <div
        style={{
          borderBottom: '1px solid #3d2e0e',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          background: '#1a1209',
          zIndex: 10,
        }}
      >
        <div>
          <h1 style={{ ...headingStyle, fontSize: 20 }}>✦ Photo &amp; Image Admin</h1>
          <p style={{ color: '#7a6030', fontSize: 11, margin: '2px 0 0', fontFamily: 'serif' }}>
            Komal &amp; Tushar · Live Supabase Cloud Sync
          </p>
        </div>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            background: 'transparent',
            border: '1px solid #3d2e0e',
            borderRadius: 8,
            padding: '6px 14px',
            color: '#d4af37',
            fontSize: 12,
            cursor: 'pointer',
            fontFamily: 'serif',
            letterSpacing: '0.08em',
          }}
        >
          ← Back to Site
        </button>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '28px 20px 0' }}>

        {/* How-to banner */}
        <div
          style={{
            background: '#261a09',
            border: '1px solid #3d2e0e',
            borderRadius: 10,
            padding: '14px 18px',
            marginBottom: 32,
            fontSize: 13,
            lineHeight: 1.7,
            color: '#c8a96e',
            fontFamily: 'serif',
          }}
        >
          <strong style={{ color: '#d4af37', display: 'block', marginBottom: 4, fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: 12 }}>
            How to use
          </strong>
          Customize hero, story, family, and gallery photos. In the <strong>Photo Gallery</strong> section below, you can also <strong>add brand new photos</strong> with a category filter (Pre-wedding, Engagement, Family, Travel, etc.). All changes sync with Supabase Storage and Database in real-time!
          {!isSupabaseConfigured && (
            <span
              style={{
                display: 'block',
                marginTop: 10,
                padding: '8px 12px',
                background: '#3b1a1a',
                border: '1px solid #7f1d1d',
                borderRadius: 6,
                color: '#fca5a5',
                fontSize: 12,
              }}
            >
              ⚠ <strong>Supabase not configured.</strong> Create a <code>.env</code> file with
              <code> VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>.
            </span>
          )}
        </div>

        {/* Sections */}
        {IMAGE_SLOTS.map(section => (
          <div key={section.section} style={{ marginBottom: 44 }}>
            <h2
              style={{
                ...headingStyle,
                fontSize: 16,
                marginBottom: 16,
                paddingBottom: 8,
                borderBottom: '1px solid #3d2e0e',
              }}
            >
              {section.section}
            </h2>

            {/* If section is Photo Gallery: show the Add Photo form and extra photos */}
            {section.section === 'Photo Gallery' && (
              <>
                <AddGalleryPhotoForm />

                {/* Additional custom photos list */}
                {galleryPhotos.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <h3
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        color: '#d4af37',
                        fontSize: 14,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        marginBottom: 12,
                      }}
                    >
                      ✦ Extra Added Moments ({galleryPhotos.length})
                    </h3>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: 16,
                        marginBottom: 24,
                      }}
                    >
                      {galleryPhotos.map((photo) => (
                        <AddedGalleryPhotoCard key={photo.id} photo={photo} />
                      ))}
                    </div>
                  </div>
                )}

                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: '#a08552',
                    fontSize: 13,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    marginBottom: 12,
                  }}
                >
                  Default Gallery Slots (1–9)
                </h3>
              </>
            )}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 16,
              }}
            >
              {section.slots.map(slot => (
                <SlotCard key={slot.id} slot={slot} />
              ))}
            </div>
          </div>
        ))}

        <p style={{ color: '#7a6030', fontSize: 11, textAlign: 'center', marginTop: 20, fontFamily: 'serif' }}>
          Admin Panel · Komal &amp; Tushar Wedding · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
