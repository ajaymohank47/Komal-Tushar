import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { weddingContent } from '../data/content';
import { Menu, X, ShieldCheck } from 'lucide-react';

export default function Navbar({ onOpenAdmin }) {
  const { isAdmin } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = weddingContent.navLinks;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 py-3 shadow-sm'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand / Logo: K&T */}
        <a href="#" className="group flex items-center text-decoration-none" title="Komal & Tushar">
          <span className={`font-cormorant text-2xl sm:text-3xl font-semibold tracking-[0.2em] transition-colors ${
            isScrolled ? 'text-stone-800 group-hover:text-gold-600' : 'text-stone-100 group-hover:text-gold-300'
          }`}>
            K<span className="font-script text-gold-400 mx-0.5 text-3xl sm:text-4xl">&</span>T
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-[11px] uppercase tracking-widest font-serif transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-gold-400 hover:after:w-full after:transition-all ${
                isScrolled ? 'text-stone-700 hover:text-gold-600' : 'text-stone-200 hover:text-gold-300'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Admin Action (if enabled) */}
        {isAdmin && (
          <div className="hidden md:flex items-center">
            <button
              onClick={onOpenAdmin}
              className="px-3 py-1 text-[11px] rounded-full border border-gold-400/50 bg-gold-500/15 hover:bg-gold-500/25 text-gold-300 flex items-center gap-1.5 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
              <span>Admin</span>
            </button>
          </div>
        )}

        {/* Mobile Menu Hamburger */}
        <div className="flex md:hidden items-center space-x-2">
          {isAdmin && (
            <button
              onClick={onOpenAdmin}
              className="px-2 py-0.5 text-[10px] rounded-full border border-gold-400/40 bg-gold-500/10 text-gold-300"
            >
              Admin
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-stone-200 hover:text-gold-400 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-6 py-5 space-y-3 shadow-md animate-fadeIn">
          <div className="flex flex-col space-y-2.5 pb-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs uppercase tracking-wider text-stone-700 hover:text-gold-600 font-serif py-1"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
