import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Shield, User, AlertCircle } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, loginWithGoogle, loginDev, authError } = useAuth();
  const googleBtnRef = useRef(null);
  const [customName, setCustomName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!isAuthModalOpen) return;

    if (window.google && googleClientId) {
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response) => {
            try {
              setSubmitting(true);
              await loginWithGoogle(response.credential);
            } catch (err) {
              setErrorMessage(err.message || 'Google sign in failed');
            } finally {
              setSubmitting(false);
            }
          }
        });

        if (googleBtnRef.current) {
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'outline',
            size: 'large',
            width: 280,
            text: 'signin_with'
          });
        }
      } catch (e) {
        console.warn('Google GSI init notice:', e);
      }
    }
  }, [isAuthModalOpen, googleClientId]);

  if (!isAuthModalOpen) return null;

  const handleDevPreset = async (asAdmin) => {
    try {
      setSubmitting(true);
      setErrorMessage('');
      if (asAdmin) {
        await loginDev({
          name: 'Tushar & Komal (Admin)',
          email: 'tushar@example.com',
          asAdmin: true
        });
      } else {
        await loginDev({
          name: 'Priya Sharma',
          email: 'priya@example.com',
          asAdmin: false
        });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to login');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCustomLogin = async (e) => {
    e.preventDefault();
    if (!customName.trim()) {
      setErrorMessage('Please enter your name');
      return;
    }
    try {
      setSubmitting(true);
      setErrorMessage('');
      await loginDev({
        name: customName.trim(),
        email: `${customName.toLowerCase().replace(/\s+/g, '')}@weddingguest.com`,
        asAdmin: false
      });
    } catch (err) {
      setErrorMessage(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={closeAuthModal}>
      <div
        className="relative w-full max-w-sm p-6 sm:p-8 rounded-3xl bg-white border border-gold-400/40 shadow-2xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-espresso-text transition-colors rounded-full hover:bg-ivory-100"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <span className="font-script text-2xl text-gold-600 block mb-1">Welcome</span>
          <h3 className="font-cormorant text-2xl text-espresso-text font-medium">
            Sign In to RSVP & Wishes
          </h3>
          <p className="text-xs text-espresso-muted mt-1">
            Join Komal & Tushar's wedding celebration portal
          </p>
        </div>

        {(errorMessage || authError) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
            <span>{errorMessage || authError}</span>
          </div>
        )}

        {/* Google OAuth Section */}
        {googleClientId ? (
          <div className="flex justify-center mb-5" ref={googleBtnRef}></div>
        ) : (
          <div className="mb-5 p-3 rounded-xl bg-ivory-100 border border-gold-400/20 text-xs text-espresso-muted">
            <span className="text-gold-700 font-semibold block mb-0.5">Google Sign-In Ready</span>
            <span>Add <code className="text-xs">VITE_GOOGLE_CLIENT_ID</code> to <code className="text-xs">.env</code> to enable Google sign in</span>
          </div>
        )}

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gold-400/25"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-gold-600 font-serif tracking-widest text-[11px]">
              Dev Login Shortcuts
            </span>
          </div>
        </div>

        {/* 1-Click Dev Presets */}
        <div className="space-y-2 mb-4">
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleDevPreset(false)}
            className="w-full py-2.5 px-4 rounded-xl border border-gold-400/35 bg-ivory-50 hover:bg-gold-500/10 text-espresso-text font-serif text-xs flex items-center justify-center gap-2 transition-all"
          >
            <User className="w-3.5 h-3.5 text-gold-600" />
            <span>Login as Guest (Priya Sharma)</span>
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => handleDevPreset(true)}
            className="w-full py-2.5 px-4 rounded-xl border border-crimson-500/30 bg-crimson-50/50 hover:bg-crimson-50 text-espresso-text font-serif text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Shield className="w-3.5 h-3.5 text-crimson-600" />
            <span>Login as Couple / Admin</span>
          </button>
        </div>

        {/* Custom dev name sign in */}
        <form onSubmit={handleCustomLogin} className="space-y-2 text-left pt-3 border-t border-gold-400/15">
          <p className="text-[11px] text-espresso-muted text-center">Or enter your name to continue:</p>
          <input
            type="text"
            placeholder="Your Name (e.g. Rahul Verma)"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-ivory-50 border border-gold-400/30 text-espresso-text placeholder-stone-400 focus:outline-none focus:border-gold-500"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2 text-xs font-semibold uppercase tracking-wider text-white bg-gold-500 hover:bg-gold-600 rounded-xl transition-all shadow-sm"
          >
            {submitting ? 'Signing In...' : 'Sign In as Custom Guest'}
          </button>
        </form>
      </div>
    </div>
  );
}
