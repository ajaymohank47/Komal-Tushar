import React, { useState, useRef, useEffect } from 'react';
import { useImageContext } from '../contexts/ImageContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { api } from '../services/api';
import { compressImage, formatFileSize } from '../utils/imageCompressor';
import { 
  Users, Gift, Image, RefreshCw, Trash2, Plus, 
  Search, Download, CheckCircle2, Lock, Sparkles, MessageSquare, Utensils 
} from 'lucide-react';

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
import sarveshImg from '../assets/images/family/sarvesh.png';
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
      { id: 'story-1-1', label: 'Photo 1', fallback: storyImg1 },
      { id: 'story-1-2', label: 'Photo 2', fallback: storyImg1 },
      { id: 'story-1-3', label: 'Photo 3', fallback: storyImg1 },
    ],
    isDynamic: true,
    maxGroups: 5,
    groupFallbacks: [storyImg1, storyImg2, storyImg3, storyImg4, storyImg5],
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
  const [uploadMsg, setUploadMsg] = useState('');
  const [status, setStatus] = useState(null); // null | 'success' | 'error'
  const [compressionNote, setCompressionNote] = useState('');
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
    setUploadMsg('Optimizing photo…');
    setStatus(null);
    setCompressionNote('');
    setErrorMsg('');

    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file (JPEG, PNG, WEBP, etc.)');
      }

      // Automatically compress file size while preserving high visual resolution & clarity
      const { file: fileToUpload, originalSize, compressedSize, reduction, wasCompressed } = await compressImage(file);

      setUploadMsg('Uploading…');
      const ext = fileToUpload.name.split('.').pop() || 'jpg';
      const cleanSlotId = slot.id.replace(/[^a-zA-Z0-9_-]/g, '_');
      const path = `${cleanSlotId}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('wedding-photos')
        .upload(path, fileToUpload, { 
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
      if (wasCompressed) {
        setCompressionNote(`⚡ Reduced ${formatFileSize(originalSize)} → ${formatFileSize(compressedSize)} (${reduction} saved)`);
      }
      setTimeout(() => {
        setStatus(null);
        setCompressionNote('');
      }, 4000);
    } catch (err) {
      console.error('Upload failed', err);
      setStatus('error');
      setErrorMsg(err?.message || 'Upload failed. Check Supabase connection.');
    } finally {
      setUploading(false);
      setUploadMsg('');
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
        background: '#ffffff',
        border: '1px solid #ebdcc5',
        boxShadow: '0 2px 8px rgba(184, 134, 11, 0.05)',
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
            background: isCustomized ? '#ecfdf5' : '#faf6ee',
            color: isCustomized ? '#065f46' : '#7c6a59',
            border: `1px solid ${isCustomized ? '#a7f3d0' : '#dfcfb3'}`,
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
          border: '1px solid #ebdcc5',
          background: '#faf6ee',
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
            background: uploading ? '#dfcfb3' : '#b8860b',
            color: uploading ? '#7c6a59' : '#ffffff',
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
          {uploading ? (uploadMsg || 'Uploading…') : isCustomized ? '↩ Replace Photo' : '↑ Upload Photo'}
        </button>

        {compressionNote && (
          <p style={{ color: '#047857', fontSize: 10, margin: '2px 0 0', fontFamily: 'serif', textAlign: 'center' }}>
            {compressionNote}
          </p>
        )}

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
              color: '#7c6a59',
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

/** Dynamic story groups: starts with 3 cards, button adds 3 more (up to maxGroups * 3) */
function StoryGroupsAdmin({ section }) {
  const { images } = useImageContext();
  const [visibleGroups, setVisibleGroups] = React.useState(1);

  // Auto-expand groups that already have uploaded images
  React.useEffect(() => {
    let max = 1;
    for (let g = 1; g <= section.maxGroups; g++) {
      const hasAny = [`story-${g}-1`, `story-${g}-2`, `story-${g}-3`].some(id => images[id]);
      if (hasAny) max = g;
    }
    setVisibleGroups(Math.max(1, max));
  }, [images]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {Array.from({ length: visibleGroups }, (_, gi) => {
        const g = gi + 1;
        const slots = [1, 2, 3].map(n => ({
          id: `story-${g}-${n}`,
          label: `Group ${g} · Photo ${n}`,
          fallback: section.groupFallbacks[gi] || section.groupFallbacks[0],
        }));
        return (
          <div key={g}>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: '#a08552',
              fontSize: 12,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}>
              ✦ Group {g}
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 14,
            }}>
              {slots.map(slot => <SlotCard key={slot.id} slot={slot} />)}
            </div>
          </div>
        );
      })}

      {visibleGroups < section.maxGroups && (
        <button
          onClick={() => setVisibleGroups(v => v + 1)}
          style={{
            alignSelf: 'flex-start',
            background: 'transparent',
            border: '1.5px dashed #b8860b',
            color: '#b8860b',
            borderRadius: 8,
            padding: '8px 20px',
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          + Add Another Group of 3
        </button>
      )}
    </div>
  );
}

/** Form card to add new photos to the "Our Moments" Gallery with category filter selection */
export function AddGalleryPhotoForm() {
  const { addGalleryPhoto } = useImageContext();
  const fileInputRef = useRef(null);

  // title is derived from category — no user input needed
  const [category, setCategory] = useState('prewedding');
  const [customCategory, setCustomCategory] = useState('');
  const [isUrlMode, setIsUrlMode] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState('');
  const [compressionInfo, setCompressionInfo] = useState('');
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

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please choose an image file (JPG, PNG, WEBP, etc.)');
      return;
    }
    setErrorMsg('');
    const { file: optimized, originalSize, compressedSize, reduction, wasCompressed } = await compressImage(file);
    setSelectedFile(optimized);
    setPreviewSrc(URL.createObjectURL(optimized));
    if (wasCompressed) {
      setCompressionInfo(`⚡ Auto-compressed: ${formatFileSize(originalSize)} → ${formatFileSize(compressedSize)} (${reduction} smaller, full clarity preserved)`);
    } else {
      setCompressionInfo('');
    }
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
        title: 'Our Moment',
        category: finalCategory.toLowerCase(),
        imageUrl: finalUrl,
      });

      setStatus('success');
      setImageUrl('');
      setSelectedFile(null);
      setPreviewSrc('');
      setCompressionInfo('');
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
        background: '#ffffff',
        border: '1.5px solid #d4af37',
        borderRadius: 14,
        padding: '20px 24px',
        marginBottom: 24,
        boxShadow: '0 4px 16px rgba(184, 134, 11, 0.08)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: '#8c6721',
              fontSize: 18,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              margin: 0,
              fontWeight: 700,
            }}
          >
            ✦ Add New Photo to "Our Moments" Gallery
          </h3>
          <p style={{ color: '#7c6a59', fontSize: 12, margin: '4px 0 0', fontFamily: 'serif' }}>
            Upload extra pictures and assign them to a category filter. If more than 9 pictures are added, the website provides an elegant "View More Moments" expand button.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
          {/* Category Filter Selector */}
          <div>
            <label
              style={{
                display: 'block',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 12,
                color: '#8c6721',
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
                background: '#fdfbf7',
                border: '1px solid #dfcfb3',
                borderRadius: 8,
                padding: '9px 12px',
                color: '#2c1810',
                fontSize: 13,
                outline: 'none',
                boxSizing: 'border-box',
                fontFamily: 'serif',
                cursor: 'pointer',
              }}
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id} style={{ background: '#ffffff', color: '#2c1810' }}>
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
                color: '#8c6721',
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
                background: '#fdfbf7',
                border: '1px solid #dfcfb3',
                borderRadius: 8,
                padding: '9px 12px',
                color: '#2c1810',
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
              background: !isUrlMode ? '#b8860b' : '#faf6ee',
              color: !isUrlMode ? '#ffffff' : '#7c6a59',
              border: `1px solid ${!isUrlMode ? '#b8860b' : '#dfcfb3'}`,
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
              background: isUrlMode ? '#b8860b' : '#faf6ee',
              color: isUrlMode ? '#ffffff' : '#7c6a59',
              border: `1px solid ${isUrlMode ? '#b8860b' : '#dfcfb3'}`,
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
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{
                  background: '#faf6ee',
                  border: '1px dashed #b8860b',
                  borderRadius: 8,
                  padding: '12px 18px',
                  color: '#8c6721',
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
            {compressionInfo && (
              <p style={{ color: '#047857', fontSize: 11, margin: '8px 0 0', fontFamily: 'serif' }}>
                {compressionInfo}
              </p>
            )}
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
                background: '#fdfbf7',
                border: '1px solid #dfcfb3',
                borderRadius: 8,
                padding: '9px 12px',
                color: '#2c1810',
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
            {uploading ? 'Uploading…' : '+ Add Photo to Gallery'}
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
        background: '#ffffff',
        border: '1px solid #ebdcc5',
        boxShadow: '0 2px 8px rgba(184, 134, 11, 0.05)',
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
            color: '#2c1810',
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

  // Tabs: 'rsvps' | 'gifts' | 'photos'
  const [activeTab, setActiveTab] = useState('rsvps');

  // RSVPs state
  const [rsvps, setRsvps] = useState([]);
  const [rsvpSummary, setRsvpSummary] = useState(null);
  const [loadingRsvps, setLoadingRsvps] = useState(false);
  const [rsvpSearch, setRsvpSearch] = useState('');

  // Gifts state
  const [gifts, setGifts] = useState([]);
  const [loadingGifts, setLoadingGifts] = useState(false);
  const [newGift, setNewGift] = useState({ name: '', price: '', description: '', image: '' });
  const [savingGift, setSavingGift] = useState(false);
  const [giftImageFile, setGiftImageFile] = useState(null);
  const [giftImagePreview, setGiftImagePreview] = useState('');
  const [giftCompressionInfo, setGiftCompressionInfo] = useState('');
  const giftFileInputRef = useRef(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  // Fetch RSVPs
  const loadRsvps = async () => {
    try {
      setLoadingRsvps(true);
      const res = await api.adminGetRsvps();
      setRsvps(res.rsvps || []);
      setRsvpSummary(res.summary || null);
    } catch (err) {
      console.error('Failed to load RSVPs', err);
    } finally {
      setLoadingRsvps(false);
    }
  };

  // Fetch Gifts
  const loadGifts = async () => {
    try {
      setLoadingGifts(true);
      const res = await api.getGifts();
      setGifts(res || []);
    } catch (err) {
      console.error('Failed to load gifts', err);
    } finally {
      setLoadingGifts(false);
    }
  };

  // When authenticated, load data and subscribe to real-time events
  useEffect(() => {
    if (!authenticated) return;

    loadRsvps();
    loadGifts();

    if (!supabase) return;

    // Realtime listener for RSVPs
    const rsvpChannel = supabase
      .channel('admin_rsvps_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wedding_rsvps' }, () => {
        loadRsvps();
      })
      .subscribe();

    // Realtime listener for Gifts
    const giftsChannel = supabase
      .channel('admin_gifts_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wedding_gifts' }, () => {
        loadGifts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(rsvpChannel);
      supabase.removeChannel(giftsChannel);
    };
  }, [authenticated]);

  const handleDeleteRsvp = async (id, name) => {
    if (!window.confirm(`Delete RSVP for "${name || 'this guest'}"?`)) return;
    try {
      await api.adminDeleteRsvp(id);
      setRsvps(prev => prev.filter(r => r.id !== id));
      if (rsvpSummary) {
        setRsvpSummary(prev => ({
          ...prev,
          totalResponses: Math.max(0, prev.totalResponses - 1)
        }));
      }
    } catch (err) {
      alert(err.message || 'Failed to delete RSVP');
    }
  };

  const handleExportCsv = () => {
    if (!rsvps.length) {
      alert('No RSVP data to export.');
      return;
    }
    const headers = ['Guest Name', 'Contact', 'Guests Count', 'Meal Preference', 'Message', 'Submitted At'];
    const rows = rsvps.map(r => [
      `"${(r.userName || '').replace(/"/g, '""')}"`,
      `"${(r.userEmail || '').replace(/"/g, '""')}"`,
      r.guestCount || 1,
      `"${(r.mealPreference || '').replace(/"/g, '""')}"`,
      `"${(r.message || '').replace(/"/g, '""')}"`,
      `"${r.submittedAt ? new Date(r.submittedAt).toLocaleString('en-IN') : ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `komal_tushar_rsvps_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddGift = async (e) => {
    e.preventDefault();
    if (!newGift.name.trim()) return;
    try {
      setSavingGift(true);
      let imageUrl = newGift.image?.trim();

      // If user selected a file to upload directly to Supabase storage
      if (giftImageFile) {
        if (!supabase) {
          throw new Error('Supabase not configured for file upload');
        }
        const ext = giftImageFile.name.split('.').pop() || 'jpg';
        const fileName = `gifts/${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from('wedding-photos')
          .upload(fileName, giftImageFile, { contentType: giftImageFile.type, upsert: true });

        if (uploadErr) throw uploadErr;

        const { data: urlData } = supabase.storage
          .from('wedding-photos')
          .getPublicUrl(fileName);
        imageUrl = urlData?.publicUrl || imageUrl;
      }

      await api.adminAddGift({
        ...newGift,
        image: imageUrl || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80'
      });

      setNewGift({ name: '', price: '', description: '', image: '' });
      setGiftImageFile(null);
      setGiftImagePreview('');
      setGiftCompressionInfo('');
      if (giftFileInputRef.current) giftFileInputRef.current.value = '';
      await loadGifts();
    } catch (err) {
      alert(err.message || 'Failed to add gift');
    } finally {
      setSavingGift(false);
    }
  };

  const handleDeleteGift = async (id, name) => {
    if (!window.confirm(`Delete "${name}" from registry?`)) return;
    try {
      await api.adminDeleteGift(id);
      setGifts(prev => prev.filter(g => g.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete gift');
    }
  };

  const handleUnreserveGift = async (id, name) => {
    if (!window.confirm(`Cancel reservation for "${name}"?`)) return;
    try {
      await api.unreserveGift(id);
      await loadGifts();
    } catch (err) {
      alert(err.message || 'Failed to cancel reservation');
    }
  };

  const filteredRsvps = rsvps.filter(r => {
    if (!rsvpSearch.trim()) return true;
    const term = rsvpSearch.toLowerCase();
    return (
      (r.userName || '').toLowerCase().includes(term) ||
      (r.userEmail || '').toLowerCase().includes(term) ||
      (r.message || '').toLowerCase().includes(term)
    );
  });

  const pageStyle = {
    minHeight: '100vh',
    background: '#faf6ee',
    color: '#2c1810',
    fontFamily: "'Cormorant Garamond', serif",
    padding: '0 0 60px',
  };

  const headingStyle = {
    fontFamily: "'Cormorant Garamond', serif",
    color: '#8c6721',
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
            background: '#ffffff',
            border: '1px solid #e8dcbe',
            boxShadow: '0 10px 30px rgba(184, 134, 11, 0.08)',
            borderRadius: 16,
            padding: '40px 36px',
            width: '100%',
            maxWidth: 380,
            textAlign: 'center',
          }}
        >
          <p style={{ color: '#8c6721', fontSize: 28, marginBottom: 4, ...headingStyle }}>
            ✦ Admin Panel
          </p>
          <p style={{ color: '#7c6a59', fontSize: 13, marginBottom: 28, fontFamily: 'serif' }}>
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
                background: '#fdfbf7',
                border: `1px solid ${authError ? '#f87171' : '#dfcfb3'}`,
                borderRadius: 8,
                padding: '10px 14px',
                color: '#2c1810',
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
                background: '#b8860b',
                color: '#ffffff',
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
          borderBottom: '1px solid #e8dcbe',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          background: '#ffffff',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          zIndex: 20,
        }}
      >
        <div>
          <h1 style={{ ...headingStyle, fontSize: 20 }}>✦ Wedding Administration</h1>
          <p style={{ color: '#7c6a59', fontSize: 11, margin: '2px 0 0', fontFamily: 'serif' }}>
            Komal &amp; Tushar · Wedding Portal
          </p>
        </div>

        <button
          onClick={() => window.location.href = '/'}
          style={{
            background: '#faf6ee',
            border: '1px solid #dfcfb3',
            borderRadius: 8,
            padding: '6px 14px',
            color: '#8c6721',
            fontSize: 12,
            cursor: 'pointer',
            fontFamily: 'serif',
            letterSpacing: '0.08em',
          }}
        >
          ← Back to Site
        </button>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          borderBottom: '1px solid #e8dcbe',
          background: '#f5eedc',
          padding: '0 24px',
          display: 'flex',
          gap: 12,
          position: 'sticky',
          top: 65,
          zIndex: 19,
        }}
      >
        <button
          onClick={() => setActiveTab('rsvps')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '14px 18px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'rsvps' ? '2px solid #b8860b' : '2px solid transparent',
            color: activeTab === 'rsvps' ? '#8c6721' : '#7c6a59',
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <Users size={16} />
          <span>Guest RSVPs ({rsvps.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('gifts')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '14px 18px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'gifts' ? '2px solid #b8860b' : '2px solid transparent',
            color: activeTab === 'gifts' ? '#8c6721' : '#7c6a59',
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <Gift size={16} />
          <span>Gift Registry ({gifts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('photos')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '14px 18px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'photos' ? '2px solid #b8860b' : '2px solid transparent',
            color: activeTab === 'photos' ? '#8c6721' : '#7c6a59',
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <Image size={16} />
          <span>Photos &amp; Gallery</span>
        </button>
      </div>

      <div style={{ maxWidth: 1040, margin: '0 auto', padding: '28px 20px 0' }}>

        {/* ════════════════════════════════════════════════════════════════
            TAB 1: RSVPS
        ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'rsvps' && (
          <div>
            {/* Summary Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 16,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #ebdcc5',
                  boxShadow: '0 2px 10px rgba(184, 134, 11, 0.05)',
                  borderRadius: 12,
                  padding: '18px 20px',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#7c6a59', display: 'block' }}>
                  Total Responses
                </span>
                <span style={{ fontFamily: 'serif', fontSize: 32, fontWeight: 700, color: '#8c6721', display: 'block', marginTop: 4 }}>
                  {rsvps.length}
                </span>
              </div>

              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #ebdcc5',
                  boxShadow: '0 2px 10px rgba(184, 134, 11, 0.05)',
                  borderRadius: 12,
                  padding: '18px 20px',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#7c6a59', display: 'block' }}>
                  Total Guests Attending
                </span>
                <span style={{ fontFamily: 'serif', fontSize: 32, fontWeight: 700, color: '#15803d', display: 'block', marginTop: 4 }}>
                  {rsvps.reduce((sum, r) => sum + (parseInt(r.guestCount, 10) || 1), 0)}
                </span>
              </div>

              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #ebdcc5',
                  boxShadow: '0 2px 10px rgba(184, 134, 11, 0.05)',
                  borderRadius: 12,
                  padding: '18px 20px',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#7c6a59', display: 'block' }}>
                  Vegetarian Meals
                </span>
                <span style={{ fontFamily: 'serif', fontSize: 32, fontWeight: 700, color: '#a16207', display: 'block', marginTop: 4 }}>
                  {rsvps.filter(r => (r.mealPreference || '').toLowerCase().includes('veg')).length}
                </span>
              </div>

              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid #ebdcc5',
                  boxShadow: '0 2px 10px rgba(184, 134, 11, 0.05)',
                  borderRadius: 12,
                  padding: '18px 20px',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#7c6a59', display: 'block' }}>
                  Blessings &amp; Notes
                </span>
                <span style={{ fontFamily: 'serif', fontSize: 32, fontWeight: 700, color: '#475569', display: 'block', marginTop: 4 }}>
                  {rsvps.filter(r => Boolean(r.message && r.message.trim())).length}
                </span>
              </div>
            </div>

            {/* Action Bar: Search, Refresh, Export */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#ffffff',
                border: '1px solid #ebdcc5',
                boxShadow: '0 2px 10px rgba(184, 134, 11, 0.05)',
                borderRadius: 12,
                padding: '14px 18px',
                marginBottom: 20,
              }}
            >
              {/* Search */}
              <div style={{ position: 'relative', flex: '1 1 260px' }}>
                <Search size={15} style={{ position: 'absolute', left: 12, top: 11, color: '#7c6a59' }} />
                <input
                  type="text"
                  placeholder="Search by name, contact, or note..."
                  value={rsvpSearch}
                  onChange={e => setRsvpSearch(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#fdfbf7',
                    border: '1px solid #dfcfb3',
                    borderRadius: 8,
                    padding: '8px 12px 8px 36px',
                    color: '#2c1810',
                    fontSize: 13,
                    fontFamily: 'serif',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <button
                  onClick={loadRsvps}
                  disabled={loadingRsvps}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: '#faf6ee',
                    border: '1px solid #dfcfb3',
                    borderRadius: 8,
                    padding: '8px 14px',
                    color: '#8c6721',
                    fontSize: 12,
                    fontFamily: 'serif',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  <RefreshCw size={13} className={loadingRsvps ? 'animate-spin' : ''} />
                  <span>{loadingRsvps ? 'Refreshing…' : 'Refresh'}</span>
                </button>

                <button
                  onClick={handleExportCsv}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: '#166534',
                    border: '1px solid #22c55e',
                    borderRadius: 8,
                    padding: '8px 14px',
                    color: '#86efac',
                    fontSize: 12,
                    fontFamily: 'serif',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  <Download size={13} />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* RSVP Table */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #ebdcc5',
                boxShadow: '0 2px 10px rgba(184, 134, 11, 0.05)',
                borderRadius: 12,
                overflowX: 'auto',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13, fontFamily: 'serif' }}>
                <thead>
                  <tr style={{ background: '#f8f3e8', borderBottom: '1px solid #ebdcc5', color: '#7c6a59', textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.1em' }}>
                    <th style={{ padding: '14px 16px' }}>Guest Name</th>
                    <th style={{ padding: '14px 16px' }}>Contact</th>
                    <th style={{ padding: '14px 16px', textAlign: 'center' }}>Guests</th>
                    <th style={{ padding: '14px 16px' }}>Meal Choice</th>
                    <th style={{ padding: '14px 16px' }}>Wishes / Note</th>
                    <th style={{ padding: '14px 16px' }}>Date</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRsvps.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '48px 20px', textAlign: 'center', color: '#7c6a59' }}>
                        {loadingRsvps
                          ? 'Loading RSVPs…'
                          : rsvpSearch
                          ? `No RSVPs matching "${rsvpSearch}".`
                          : 'No RSVP responses received yet. Once guests submit the RSVP form on the site, their entries will show here in real-time!'}
                      </td>
                    </tr>
                  ) : (
                    filteredRsvps.map((r) => (
                      <tr
                        key={r.id}
                        style={{
                          borderBottom: '1px solid #f0e6d6',
                          verticalAlign: 'top',
                          transition: 'background 0.2s',
                        }}
                      >
                        {/* Name */}
                        <td style={{ padding: '14px 16px', fontWeight: 600, color: '#2c1810', whiteSpace: 'nowrap' }}>
                          {r.userName}
                        </td>

                        {/* Contact */}
                        <td style={{ padding: '14px 16px', color: '#7c6a59', fontSize: 12 }}>
                          {r.userEmail || '—'}
                        </td>

                        {/* Guest Count */}
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '2px 8px',
                              borderRadius: 12,
                              background: '#faf6ee',
                              border: '1px solid #dfcfb3',
                              color: '#8c6721',
                              fontWeight: 700,
                              fontSize: 12,
                            }}
                          >
                            {r.guestCount || 1}
                          </span>
                        </td>

                        {/* Meal */}
                        <td style={{ padding: '14px 16px', color: '#2c1810', whiteSpace: 'nowrap' }}>
                          <span
                            style={{
                              fontSize: 11,
                              padding: '3px 8px',
                              borderRadius: 4,
                              background: '#f0fdf4',
                              color: '#15803d',
                              border: '1px solid #bbf7d0',
                            }}
                          >
                            {r.mealPreference || 'Vegetarian'}
                          </span>
                        </td>

                        {/* Message / Wishes */}
                        <td
                          style={{
                            padding: '14px 16px',
                            color: '#2c1810',
                            fontStyle: 'italic',
                            minWidth: 260,
                            maxWidth: 420,
                            whiteSpace: 'normal',
                            wordBreak: 'break-word',
                            lineHeight: 1.55,
                            fontSize: 13,
                          }}
                        >
                          {r.message ? (
                            <span style={{ display: 'block' }}>
                              "{r.message}"
                            </span>
                          ) : (
                            <span style={{ color: '#a89a8c', fontStyle: 'normal' }}>—</span>
                          )}
                        </td>

                        {/* Date */}
                        <td style={{ padding: '14px 16px', color: '#7c6a59', fontSize: 11, whiteSpace: 'nowrap' }}>
                          {r.submittedAt ? new Date(r.submittedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                        </td>

                        {/* Action */}
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <button
                            onClick={() => handleDeleteRsvp(r.id, r.userName)}
                            style={{
                              background: '#fef2f2',
                              border: '1px solid #fca5a5',
                              borderRadius: 6,
                              padding: '4px 8px',
                              color: '#b91c1c',
                              cursor: 'pointer',
                              fontSize: 11,
                            }}
                            title="Delete RSVP"
                          >
                            <Trash2 size={12} />
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

        {/* ════════════════════════════════════════════════════════════════
            TAB 2: GIFT REGISTRY
        ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'gifts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Add New Gift Form */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #ebdcc5',
                boxShadow: '0 2px 10px rgba(184, 134, 11, 0.05)',
                borderRadius: 12,
                padding: '20px 22px',
              }}
            >
              <h3
                style={{
                  ...headingStyle,
                  fontSize: 14,
                  marginBottom: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Plus size={15} />
                <span>Add New Item to Gift Registry</span>
              </h3>

              <form onSubmit={handleAddGift} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                <div>
                  <input
                    type="text"
                    placeholder="Gift Name (e.g. Solara Air Fryer)"
                    value={newGift.name}
                    onChange={e => setNewGift({ ...newGift, name: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      background: '#fdfbf7',
                      border: '1px solid #dfcfb3',
                      borderRadius: 8,
                      padding: '10px 12px',
                      color: '#2c1810',
                      fontSize: 13,
                      fontFamily: 'serif',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      type="file"
                      ref={giftFileInputRef}
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const { file: optimized, originalSize, compressedSize, reduction, wasCompressed } = await compressImage(file);
                          setGiftImageFile(optimized);
                          setGiftImagePreview(URL.createObjectURL(optimized));
                          if (wasCompressed) {
                            setGiftCompressionInfo(`⚡ Reduced ${formatFileSize(originalSize)} → ${formatFileSize(compressedSize)} (${reduction} saved)`);
                          } else {
                            setGiftCompressionInfo('');
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => giftFileInputRef.current?.click()}
                      style={{
                        background: '#faf6ee',
                        border: '1px solid #b8860b',
                        color: '#8c6721',
                        borderRadius: 8,
                        padding: '10px 14px',
                        fontSize: 12,
                        cursor: 'pointer',
                        fontFamily: 'serif',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      📁 Upload Photo
                    </button>
                    <input
                      type="text"
                      placeholder="or paste Image URL"
                      value={newGift.image}
                      onChange={e => setNewGift({ ...newGift, image: e.target.value })}
                      style={{
                        width: '100%',
                        background: '#fdfbf7',
                        border: '1px solid #dfcfb3',
                        borderRadius: 8,
                        padding: '10px 12px',
                        color: '#2c1810',
                        fontSize: 13,
                        fontFamily: 'serif',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  {giftImagePreview && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                      <img src={giftImagePreview} alt="Preview" style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6, border: '1px solid #d4af37' }} />
                      <span style={{ fontSize: 11, color: '#047857', fontFamily: 'serif' }}>
                        Selected: {giftImageFile?.name} {giftCompressionInfo && `(${giftCompressionInfo})`}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setGiftImageFile(null);
                          setGiftImagePreview('');
                          setGiftCompressionInfo('');
                          if (giftFileInputRef.current) giftFileInputRef.current.value = '';
                        }}
                        style={{ background: 'transparent', border: 'none', color: '#f87171', fontSize: 12, cursor: 'pointer' }}
                      >
                        ✕ Remove
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <textarea
                    rows={2}
                    placeholder="Description"
                    value={newGift.description}
                    onChange={e => setNewGift({ ...newGift, description: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#fdfbf7',
                      border: '1px solid #dfcfb3',
                      borderRadius: 8,
                      padding: '10px 12px',
                      color: '#2c1810',
                      fontSize: 13,
                      fontFamily: 'serif',
                      resize: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="submit"
                    disabled={savingGift}
                    style={{
                      background: '#b8860b',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '10px 20px',
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      fontFamily: "'Cormorant Garamond', serif",
                    }}
                  >
                    {savingGift ? 'Adding…' : 'Add to Registry'}
                  </button>
                </div>
              </form>
            </div>

            {/* Gifts List Table */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #ebdcc5',
                boxShadow: '0 2px 10px rgba(184, 134, 11, 0.05)',
                borderRadius: 12,
                overflowX: 'auto',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13, fontFamily: 'serif' }}>
                <thead>
                  <tr style={{ background: '#f8f3e8', borderBottom: '1px solid #ebdcc5', color: '#7c6a59', textTransform: 'uppercase', fontSize: 11, letterSpacing: '0.1em' }}>
                    <th style={{ padding: '14px 16px' }}>Photo</th>
                    <th style={{ padding: '14px 16px' }}>Gift Name</th>
                    <th style={{ padding: '14px 16px' }}>Status</th>
                    <th style={{ padding: '14px 16px' }}>Reserved By</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {gifts.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#7c6a59' }}>
                        {loadingGifts ? 'Loading gift registry…' : 'No gifts in registry.'}
                      </td>
                    </tr>
                  ) : (
                    gifts.map((g) => {
                      const isReserved = g.status === 'Reserved';
                      return (
                        <tr key={g.id} style={{ borderBottom: '1px solid #f0e6d6' }}>
                          <td style={{ padding: '12px 16px' }}>
                            <img
                              src={g.image}
                              alt={g.name}
                              style={{ width: 52, height: 44, objectFit: 'cover', borderRadius: 6, border: '1px solid #3d2e0e' }}
                            />
                          </td>
                          <td style={{ padding: '12px 16px', fontWeight: 600, color: '#2c1810' }}>
                            {g.name}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                padding: '3px 8px',
                                borderRadius: 4,
                                fontSize: 10,
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                background: isReserved ? '#fef2f2' : '#f0fdf4',
                                color: isReserved ? '#991b1b' : '#15803d',
                                border: `1px solid ${isReserved ? '#fecaca' : '#bbf7d0'}`,
                              }}
                            >
                              {isReserved ? <Lock size={10} /> : <Sparkles size={10} />}
                              <span>{isReserved ? 'Reserved' : 'Available'}</span>
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', color: '#7c6a59' }}>
                            {g.reservedByName || '—'}
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: 8 }}>
                              {isReserved && (
                                <button
                                  onClick={() => handleUnreserveGift(g.id, g.name)}
                                  style={{
                                    background: '#faf6ee',
                                    border: '1px solid #dfcfb3',
                                    borderRadius: 6,
                                    padding: '4px 10px',
                                    color: '#8c6721',
                                    cursor: 'pointer',
                                    fontSize: 11,
                                    fontFamily: 'serif',
                                  }}
                                  title="Clear Reservation"
                                >
                                  Unreserve
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteGift(g.id, g.name)}
                                style={{
                                  background: '#3b1a1a',
                                  border: '1px solid #7f1d1d',
                                  borderRadius: 6,
                                  padding: '4px 8px',
                                  color: '#fca5a5',
                                  cursor: 'pointer',
                                  fontSize: 11,
                                }}
                                title="Delete Gift"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            TAB 3: PHOTO CUSTOMIZATION
        ════════════════════════════════════════════════════════════════ */}
        {activeTab === 'photos' && (
          <div>
            {/* How-to banner */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #ebdcc5',
                boxShadow: '0 2px 10px rgba(184, 134, 11, 0.05)',
                borderRadius: 10,
                padding: '14px 18px',
                marginBottom: 32,
                fontSize: 13,
                lineHeight: 1.7,
                color: '#5c4a3b',
                fontFamily: 'serif',
              }}
            >
              <strong style={{ color: '#8c6721', display: 'block', marginBottom: 4, fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: 12 }}>
                How to use
              </strong>
              Customize hero, story, family, and gallery photos. In the <strong>Photo Gallery</strong> section below, you can also <strong>add brand new photos</strong> with a category filter (Pre-wedding, Engagement, Family, Travel, etc.). All changes sync in real-time!
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

                {/* Dynamic Our Story section: 3 cards + "Add Group" */}
                {section.isDynamic ? (
                  <StoryGroupsAdmin section={section} />
                ) : (
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
                )}
              </div>
            ))}
          </div>
        )}

        <p style={{ color: '#7c6a59', fontSize: 11, textAlign: 'center', marginTop: 36, fontFamily: 'serif' }}>
          Admin Panel · Komal &amp; Tushar Wedding · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
