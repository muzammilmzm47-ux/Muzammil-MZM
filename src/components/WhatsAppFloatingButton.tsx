import React, { useState } from 'react';
import { MessageCircle, X, PhoneCall, Sparkles } from 'lucide-react';
import { openWhatsAppChat } from '../utils/whatsapp';

export const WhatsAppFloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Expanded Quick Chat Tooltip */}
      {isOpen && (
        <div className="mb-3 w-72 bg-[#121212] border border-[#d4af37]/40 rounded-xl p-4 shadow-2xl text-white text-xs animate-fadeIn space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-emerald-400">TREDNY Direct Support</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/40 hover:text-white transition cursor-pointer"
              id="whatsapp-widget-close-btn"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[#a3a3a3] leading-relaxed">
            Have questions or want to place your order directly via WhatsApp? Chat with our team now!
          </p>

          <div className="p-2.5 bg-[#1a1a1a] rounded-lg border border-white/5 space-y-1">
            <p className="text-[10px] text-[#888] uppercase tracking-wider">Direct WhatsApp Line</p>
            <p className="text-sm font-mono text-[#d4af37] font-semibold">7338447753</p>
            <p className="text-[10px] text-emerald-400">Available Kerala & Karnataka</p>
          </div>

          <button
            onClick={() => {
              openWhatsAppChat('7338447753', 'Hi TREDNY! I would like to inquire or place an order.');
              setIsOpen(false);
            }}
            className="w-full py-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
            id="whatsapp-widget-chat-now-btn"
          >
            <MessageCircle className="w-4 h-4 fill-current text-white" />
            <span>Chat on WhatsApp Now</span>
          </button>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => {
          if (!isOpen) {
            setIsOpen(true);
          } else {
            openWhatsAppChat('7338447753', 'Hi TREDNY! I would like to inquire or place an order.');
          }
        }}
        className="group bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl flex items-center gap-2 transition-all transform hover:scale-105 cursor-pointer border-2 border-emerald-400/40"
        title="Direct Chat on WhatsApp (7338447753)"
        id="whatsapp-floating-trigger-btn"
      >
        <MessageCircle className="w-6 h-6 fill-current text-white" />
        <span className="hidden sm:inline font-semibold text-xs tracking-wide">
          Order on WhatsApp: <strong className="font-mono underline">7338447753</strong>
        </span>
      </button>
    </div>
  );
};
