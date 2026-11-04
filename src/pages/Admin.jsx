import React, { useState, useRef } from 'react';
import { useImageContext } from '../contexts/ImageContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Fallback SVG imports
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
import heroImg from '../assets/images/hero.png';

const ADMIN_PASSWORD = 'komal2026';

const IMAGE_SLOTS = [
  {
    section: 'Hero',
    slots: [
      { id: 'hero', label: 'Hero Background', fallback: heroImg },
    ],
  },
  {
    section: 'Our Story',
    slots: [
      { id: 'story-1', label: 'Story 1', fallback: storyImg1 },
      { id: 'story-2', label: 'Story 2', fallback: storyImg2 },
      { id: 'story-3', label: 'Story 3', fallback: storyImg3 },
      { id: 'story-4', label: 'Story 4', fallback: storyImg4 },
      { id: 'story-5', label: 'Story 5', fallback: storyImg5 },
    ],
  },
  {
    section: 'Photo Gallery',
    slots: [
      { id: 'gallery-1', label: 'Gallery 1', fallback: galleryImg1 },
      { id: 'gallery-2', label: 'Gallery 2', fallback: galleryImg2 },
      { id: 'gallery-3', label: 'Gallery 3', fallback: galleryImg3 },
      { id: 'gallery-4', label: 'Gallery 4', fallback: galleryImg4 },
      { id: 'gallery-5', label: 'Gallery 5', fallback: galleryImg5 },
      { id: 'gallery-6', label: 'Gallery 6', fallback: galleryImg6 },
      { id: 'gallery-7', label: 'Gallery 7', fallback: galleryImg7 },
      { id: 'gallery-8', label: 'Gallery 8', fallback: galleryImg8 },
      { id: 'gallery-9', label: 'Gallery 9', fallback: galleryImg9 },
    ],
  },
  {
    section: 'Family',
    slots: [
      { id: 'family-dayanand', label: 'Dayanand Pawar (Groom\'s Father)', fallback: dayanandImg },
    ],
  },
];

function SlotCard({ slot }) {
  const { images, setImage } = useImageContext();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null); // null | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const currentSrc = images[slot.id] || slot.fallback;

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!isSupabaseConfigured || !supabase) {
      setStatus('error');
      setErrorMsg('Supabase is not configured. Please set up your .env file.');
      return;
    }

    setUploading(true);
    setStatus(null);
    setErrorMsg('');

    try {
      const ext = file.name.split('.').pop();
      const path = `${slot.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('wedding-photos')
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('wedding-photos')
        .getPublicUrl(path);

      const publicUrl = urlData?.publicUrl;
      if (!publicUrl) throw new Error('Could not get public URL');

      await setImage(slot.id, publicUrl);
      setStatus('success');
    } catch (err) {
      console.error('Upload failed', err);
      setStatus('error');
      setErrorMsg(err?.message || 'Upload failed. Check console for details.');
    } finally {
      setUploading(false);
      // reset file input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
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
      {/* Slot label */}
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          color: '#d4af37',
          fontSize: 13,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          margin: 0,
          fontWeight: 600,
        }}
      >
        {slot.label}
      </p>

      {/* Preview */}
      <div
        style={{
          width: '100%',
          height: 110,
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
              borderRadius: '50%',
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
            }}
          >
            ✓
          </div>
        )}
      </div>

      {/* Slot ID hint */}
      <p
        style={{
          fontFamily: 'monospace',
          fontSize: 10,
          color: '#7a6030',
          margin: 0,
          letterSpacing: '0.05em',
        }}
      >
        slot: {slot.id}
      </p>

      {/* Upload button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        style={{
          background: uploading ? '#3d2e0e' : '#d4af37',
          color: uploading ? '#7a6030' : '#1a1209',
          border: 'none',
          borderRadius: 8,
          padding: '8px 14px',
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          cursor: uploading ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
          width: '100%',
        }}
      >
        {uploading ? 'Uploading…' : images[slot.id] ? '↩ Replace Photo' : '↑ Upload Photo'}
      </button>

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

export default function Admin() {
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
          <h1 style={{ ...headingStyle, fontSize: 20 }}>✦ Photo Admin</h1>
          <p style={{ color: '#7a6030', fontSize: 11, margin: '2px 0 0', fontFamily: 'serif' }}>
            Komal &amp; Tushar · Wedding Site
          </p>
        </div>
        <button
          onClick={() => window.location.href = '/'}
          style={{
            background: 'transparent',
            border: '1px solid #3d2e0e',
            borderRadius: 8,
            padding: '6px 14px',
            color: '#7a6030',
            fontSize: 12,
            cursor: 'pointer',
            fontFamily: 'serif',
            letterSpacing: '0.08em',
          }}
        >
          ← Back to Site
        </button>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px 0' }}>

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
          Click <em>Upload Photo</em> on any slot → pick a JPG/PNG/WEBP from your device → the photo
          uploads to Supabase Storage and the live site updates immediately. Photos are saved permanently
          — even after a page refresh. Each slot ID (shown in small text under the preview) maps to a
          specific location on the wedding website.
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
              <code> VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> and restart
              the dev server. See <strong>SUPABASE_SETUP.md</strong> for instructions.
            </span>
          )}
        </div>

        {/* Sections */}
        {IMAGE_SLOTS.map(section => (
          <div key={section.section} style={{ marginBottom: 40 }}>
            <h2
              style={{
                ...headingStyle,
                fontSize: 15,
                marginBottom: 16,
                paddingBottom: 8,
                borderBottom: '1px solid #3d2e0e',
              }}
            >
              {section.section}
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: 16,
              }}
            >
              {section.slots.map(slot => (
                <SlotCard key={slot.id} slot={slot} />
              ))}
            </div>
          </div>
        ))}

        <p style={{ color: '#3d2e0e', fontSize: 11, textAlign: 'center', marginTop: 20, fontFamily: 'serif' }}>
          Admin Panel · Komal &amp; Tushar Wedding · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

