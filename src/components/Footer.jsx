import React from 'react';
import { weddingContent } from '../data/content';

export default function Footer() {
  const { footer, global } = weddingContent;

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

        {/* Bottom Line & Made With Love Notice */}
        <div className="pt-6 border-t border-gold-400/15 w-full max-w-xs flex flex-col items-center justify-center gap-2 text-[11px] text-stone-400 font-light">
          <span>
            {footer.loveNotice.split('♥').map((part, i, arr) => (
              <React.Fragment key={i}>
                {part}
                {i < arr.length - 1 && <span style={{ color: '#D4848A' }}>♥</span>}
              </React.Fragment>
            ))}
          </span>
          <a
            href="/admin"
            className="text-[10px] text-gold-500/60 hover:text-gold-400 uppercase tracking-widest transition-colors font-serif"
          >
            ✦ Admin &amp; Photo Customization
          </a>
        </div>
      </div>
    </footer>
  );
}
