import React from 'react';
import { weddingContent } from '../data/content';

export default function Footer() {
  const { footer, global, footerNavLinks } = weddingContent;

  return (
    <footer className="bg-[#1a1200] text-stone-300 py-16 px-4 text-center relative overflow-hidden border-t border-gold-400/30">
      <div className="max-w-3xl mx-auto relative z-10 flex flex-col items-center">
        {/* Ornament */}
        <div className="text-gold-400 text-xs tracking-[0.5em] mb-4">
          {global.dividerOrnament}
        </div>

        {/* Couple Names */}
        <h3 className="font-cormorant text-3xl sm:text-4xl font-normal tracking-widest uppercase text-stone-100 mb-2">
          {footer.coupleNames}
        </h3>

        {/* Date & Location */}
        <p className="font-serif text-[11px] sm:text-xs tracking-[0.25em] text-gold-300 uppercase mb-8">
          {footer.datePlace}
        </p>

        {/* Footer Nav Links */}
        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-8 max-w-xl">
          {footerNavLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[11px] uppercase tracking-widest text-stone-400 hover:text-gold-300 transition-colors font-serif"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Bottom Line & Made With Love Notice */}
        <div className="pt-6 border-t border-gold-400/15 w-full max-w-xs flex items-center justify-center text-[11px] text-stone-400 font-light">
          <span>
            {footer.loveNotice.split('♥').map((part, i, arr) => (
              <React.Fragment key={i}>
                {part}
                {i < arr.length - 1 && <span style={{ color: '#D4848A' }}>♥</span>}
              </React.Fragment>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}
