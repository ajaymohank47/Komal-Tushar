import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { weddingContent } from '../data/content';

export default function Countdown() {
  const { countdown, global } = weddingContent;

  const [timeLeft, setTimeLeft] = useState({
    days: '000',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });

  useEffect(() => {
    const target = new Date(countdown.targetDate).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: '000', hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(d).padStart(3, '0'),
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0')
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [countdown.targetDate]);

  const units = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINUTES', value: timeLeft.minutes },
    { label: 'SECONDS', value: timeLeft.seconds }
  ];

  return (
    <section id="countdown" className="py-20 px-4 bg-[#1a1200] text-center relative overflow-hidden">
      <div className="max-w-3xl mx-auto relative z-10">
        {/* Eyebrow */}
        <p className="font-script text-2xl sm:text-3xl text-gold-400 mb-2">
          {countdown.eyebrow}
        </p>

        {/* Heading */}
        <h2 className="font-cormorant text-2xl sm:text-4xl tracking-wide text-stone-100 font-normal uppercase mb-3">
          {countdown.heading}
        </h2>

        {/* Divider */}
        <div className="text-gold-400 text-xs tracking-[0.5em] my-5">
          {global.dividerOrnament}
        </div>

        {/* Countdown Bar with Vertical Dividing Lines from Reference */}
        <div className="grid grid-cols-4 max-w-xl mx-auto mt-10">
          {units.map((unit, idx) => (
            <motion.div
              key={unit.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`flex flex-col items-center justify-center py-4 px-2 ${
                idx < units.length - 1 ? 'border-r border-gold-400/25' : ''
              }`}
            >
              <span className="font-cormorant text-3xl sm:text-5xl md:text-6xl font-light tracking-wide text-gold-300">
                {unit.value}
              </span>
              <span className="font-serif text-[10px] sm:text-xs tracking-[0.25em] text-stone-400 uppercase mt-2 font-medium">
                {unit.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
