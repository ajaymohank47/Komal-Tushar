import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { weddingContent } from '../data/content';
import { Copy, Check, Landmark, Smartphone } from 'lucide-react';

export default function WeddingGifts() {
  const { gifts, global } = weddingContent;
  const [copiedField, setCopiedField] = useState('');

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(''), 2500);
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(gifts.upi.qrCodeData)}&bgcolor=faf6ee&color=1b140e`;

  return (
    <section id="gifts" className="py-24 px-4 bg-[#fcf8f2] text-espresso-text relative">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="font-script text-2xl sm:text-3xl text-[#D4848A] mb-1">
            {gifts.eyebrow}
          </p>
          <h2 className="font-cormorant text-3xl sm:text-5xl font-normal tracking-wide text-espresso-text uppercase">
            Wedding <span className="font-cormorant italic text-[#D4848A] font-medium">Gifts</span>
          </h2>
          <div className="text-gold-500 text-xs tracking-[0.5em] my-4">
            {global.dividerOrnament}
          </div>
          <p className="text-espresso-muted text-xs sm:text-sm font-light leading-relaxed max-w-md mx-auto">
            {gifts.note}
          </p>
        </div>

        {/* 2 Cards Grid: UPI & Bank Transfer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Card 1: UPI Scan to Pay */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl p-6 sm:p-8 flex flex-col items-center text-center border border-gold-400/30 shadow-lg"
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-serif text-gold-700 font-semibold mb-5">
              <Smartphone className="w-4 h-4" />
              <span>{gifts.upi.title}</span>
            </div>

            {/* QR Code Container */}
            <div className="relative p-3 rounded-2xl bg-ivory-50 border border-gold-400/40 shadow-inner mb-6">
              <img
                src={qrImageUrl}
                alt="Wedding UPI QR Code"
                className="w-44 h-44 rounded-lg object-contain"
              />
            </div>

            {/* UPI ID display & copy button */}
            <div className="w-full flex items-center justify-between p-3 rounded-xl bg-ivory-50 border border-gold-400/25">
              <div className="text-left overflow-hidden mr-2">
                <span className="text-[10px] uppercase font-serif tracking-widest text-gold-700 block">
                  UPI ID
                </span>
                <span className="text-xs sm:text-sm font-mono text-espresso-text truncate block">
                  {gifts.upi.id}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(gifts.upi.id, 'upi')}
                className="px-3 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-white text-xs font-serif uppercase tracking-wider flex items-center gap-1.5 transition-all flex-shrink-0"
              >
                {copiedField === 'upi' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Card 2: Bank Transfer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-gold-400/30 shadow-lg"
          >
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-serif text-gold-700 font-semibold mb-5">
                <Landmark className="w-4 h-4" />
                <span>{gifts.bank.title}</span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="p-3 rounded-xl bg-ivory-50 border border-gold-400/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-serif tracking-widest text-gold-700 block">
                      Account Name
                    </span>
                    <span className="text-xs sm:text-sm text-espresso-text font-medium">
                      {gifts.bank.accountName}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(gifts.bank.accountName, 'accountName')}
                    className="p-1 text-stone-400 hover:text-gold-700"
                  >
                    {copiedField === 'accountName' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-ivory-50 border border-gold-400/20">
                  <span className="text-[10px] uppercase font-serif tracking-widest text-gold-700 block">
                    Bank
                  </span>
                  <span className="text-xs sm:text-sm text-espresso-text font-medium">
                    {gifts.bank.bankName}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-ivory-50 border border-gold-400/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-serif tracking-widest text-gold-700 block">
                      Account Number
                    </span>
                    <span className="text-xs sm:text-sm font-mono text-espresso-text font-medium">
                      {gifts.bank.accountNumber}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(gifts.bank.accountNumber, 'accountNo')}
                    className="p-1 text-stone-400 hover:text-gold-700"
                  >
                    {copiedField === 'accountNo' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-ivory-50 border border-gold-400/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-serif tracking-widest text-gold-700 block">
                      IFSC Code
                    </span>
                    <span className="text-xs sm:text-sm font-mono text-espresso-text font-medium">
                      {gifts.bank.ifsc}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(gifts.bank.ifsc, 'ifsc')}
                    className="p-1 text-stone-400 hover:text-gold-700"
                  >
                    {copiedField === 'ifsc' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-espresso-muted text-center italic">
              Kindly share a warm blessing or note after transfer so we can thank you personally.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
