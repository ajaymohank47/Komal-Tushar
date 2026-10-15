import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { weddingContent } from '../data/content';

function MemberCard({ member, index }) {
  const [imgError, setImgError] = useState(false);
  const emoji = /mother|sister/i.test(member.relation) ? '👩' : '👨';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="flex flex-col items-center text-center"
    >
      {/* Circular photo with gold ring */}
      <div className="relative w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] rounded-full border-2 border-gold-400 p-[2px] bg-white shadow-md mb-2.5 group hover:scale-105 transition-transform duration-300">
        <div className="w-full h-full rounded-full overflow-hidden bg-ivory-200 flex items-center justify-center">
          {!imgError && member.photo ? (
            <img
              src={member.photo}
              alt={member.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover object-top"
              loading="lazy"
            />
          ) : (
            <span className="text-2xl select-none">{emoji}</span>
          )}
        </div>
      </div>

      {/* Name */}
      <p className="font-cormorant text-sm sm:text-base font-medium text-espresso-text leading-snug">
        {member.name.split(' ')[0]}
      </p>
      {/* Relation */}
      <span className="font-serif text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-gold-700 font-semibold">
        {member.relation}
      </span>
    </motion.div>
  );
}

export default function Family() {
  const { family, global } = weddingContent;

  return (
    <section id="family" className="py-20 px-4 bg-[#faf6ee] text-espresso-text">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="font-script text-2xl sm:text-3xl text-[#D4848A] mb-1">{family.eyebrow}</p>
          <h2 className="font-cormorant text-3xl sm:text-5xl font-normal tracking-wide text-espresso-text uppercase">
            Our <span className="italic text-[#D4848A] font-medium">Family</span>
          </h2>
          <div className="text-gold-500 text-xs tracking-[0.5em] mt-4">{global.dividerOrnament}</div>
        </div>

        {/* Groom's Family */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h3 className="font-cormorant text-lg sm:text-xl uppercase tracking-[0.25em] text-[#D4848A] text-center mb-7 font-medium">
            {family.groomFamily.title}
          </h3>
          <div className="grid grid-cols-4 gap-3 sm:gap-5 max-w-sm mx-auto">
            {family.groomFamily.members.map((m, i) => (
              <MemberCard key={m.name} member={m} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Separator */}
        <div className="flex items-center justify-center gap-3 my-4 mb-12">
          <div className="h-[1px] w-16 bg-gold-400/30" />
          <span className="text-gold-500 text-xs">{global.singleOrnament}</span>
          <div className="h-[1px] w-16 bg-gold-400/30" />
        </div>

        {/* Bride's Family */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <h3 className="font-cormorant text-lg sm:text-xl uppercase tracking-[0.25em] text-[#D4848A] text-center mb-7 font-medium">
            {family.brideFamily.title}
          </h3>
          <div className="grid grid-cols-4 gap-3 sm:gap-5 max-w-sm mx-auto">
            {family.brideFamily.members.map((m, i) => (
              <MemberCard key={m.name} member={m} index={i} />
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
