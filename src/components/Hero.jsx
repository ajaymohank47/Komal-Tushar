import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { weddingContent } from '../data/content';
import { Calendar, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({ days: '059', hours: '00', minutes: '00', seconds: '00' });

  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: '000', hours: '00', minutes: '00', seconds: '00' });
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({
        days: String(d).padStart(3, '0'),
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0'),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

export default function Hero() {
  const { hero, countdown } = weddingContent;
  const timeLeft = useCountdown(countdown.targetDate);

  const downloadICS = () => {
    try {
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 }, colors: ['#d4af37', '#f3e5ab', '#8b2635', '#ffffff'] });
    } catch (e) {}

    const icsContent = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Komal & Tushar Wedding//EN',
      'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'BEGIN:VEVENT',
      'UID:wedding-komal-tushar-20261213@wedding.com', 'DTSTAMP:20261015T000000Z',
      'DTSTART:20261213T043000Z', 'DTEND:20261213T173000Z',
      'SUMMARY:Wedding of Komal & Tushar',
      'DESCRIPTION:Together with their families, Komal & Tushar joyfully invite you to witness their union in love and celebration.',
      'LOCATION:Swaraj Sanskrutik Bhavan, New Delhi, India', 'STATUS:CONFIRMED',
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'komal-tushar-wedding.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Mins', value: timeLeft.minutes },
    { label: 'Secs', value: timeLeft.seconds },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Background photo */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${hero.backgroundImage})` }}
      >
        {/* Soft golden overlay for warmth */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(41,29,20,0.50) 0%, rgba(41,29,20,0.65) 50%, rgba(41,29,20,0.85) 100%)' }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-lg mx-auto px-6 pt-28 pb-4 flex flex-col items-center">
        {/* Eyebrow script */}
        <motion.p
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-script text-xl sm:text-2xl text-gold-300 tracking-wide mb-3"
        >
          {hero.eyebrow}
        </motion.p>

        {/* Names — stacked large serif */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.15 }}
          className="flex flex-col items-center leading-[1.05] my-1"
        >
          <h1 className="font-cormorant text-6xl sm:text-8xl font-light tracking-widest text-white drop-shadow-sm">
            {hero.bride}
          </h1>
          <span className="font-script text-3xl sm:text-4xl text-gold-400 my-0.5 leading-none">
            {hero.ampersand}
          </span>
          <h1 className="font-cormorant text-6xl sm:text-8xl font-light tracking-widest text-white drop-shadow-sm">
            {hero.groom}
          </h1>
        </motion.div>

        {/* Date */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-cormorant tracking-[0.3em] text-xs sm:text-sm text-gold-300 uppercase font-medium mt-4 mb-3"
        >
          {hero.date}
        </motion.p>

        {/* Invite text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-white/75 text-[11px] sm:text-xs max-w-xs font-light leading-relaxed mb-7 px-2 font-serif"
        >
          {hero.invitationText}
        </motion.p>

        {/* Save the Date button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-10"
        >
          <button
            onClick={downloadICS}
            className="px-7 py-2.5 rounded-full border border-gold-400/60 bg-black/20 backdrop-blur-sm text-white font-serif tracking-[0.18em] text-[11px] uppercase hover:bg-gold-500/20 hover:border-gold-300 transition-all flex items-center gap-2"
          >
            <Calendar className="w-3.5 h-3.5 text-gold-300" />
            <span>{hero.ctaText}</span>
          </button>
        </motion.div>
      </div>

      {/* ── Countdown strip — integrated at bottom of hero (exactly as in reference) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.7 }}
        className="relative z-10 w-full max-w-sm mx-auto px-6 pb-14"
      >
        <div className="grid grid-cols-4 gap-2">
          {units.map((unit) => (
            <div
              key={unit.label}
              className="flex flex-col items-center justify-center bg-[#1a1200]/70 border border-gold-500/35 backdrop-blur-sm rounded-xl py-3 px-1"
            >
              <span className="font-cormorant text-2xl sm:text-3xl font-light text-gold-300 leading-none">
                {unit.value}
              </span>
              <span className="font-serif text-[9px] tracking-[0.2em] text-stone-400 uppercase mt-1">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer select-none"
        onClick={() => {
          document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <span className="font-serif text-[10px] tracking-[0.25em] text-gold-300/70 mb-0.5 lowercase">
          {hero.scrollIndicator}
        </span>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}>
          <ChevronDown className="w-4 h-4 text-gold-300/70" />
        </motion.div>
      </motion.div>
    </section>
  );
}
