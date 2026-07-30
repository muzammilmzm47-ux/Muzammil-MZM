import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Send, Check } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  onOpenDressingStudio: () => void;
  onOpenOrderTracker: () => void;
  onOpenCareGuide: () => void;
  onAddSubscriber?: (email: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenDressingStudio,
  onOpenOrderTracker,
  onOpenCareGuide,
  onAddSubscriber,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      if (onAddSubscriber) {
        onAddSubscriber(email);
      }
    }
  };

  return (
    <footer className="bg-[#0A0A0A] border-t border-white/5 text-[#E5E5E5] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/5">
          
          {/* Brand Manifesto Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-start">
              <BrandLogo size="md" className="!items-start" />
            </div>
            <p className="text-xs text-white/40 font-light leading-relaxed max-w-sm">
              TREDNY Brand — Your premier online destination for curated fashion, fine jewelry, accessories, and bespoke styling recommendations.
            </p>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#C5A059]">
              <ShieldCheck className="w-4 h-4" />
              <span>Quality Checked & Express Doorstep Delivery</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3 text-xs">
            <h4 className="serif uppercase tracking-[0.2em] text-[#C5A059] text-[11px]">
              Boutique Services
            </h4>
            <ul className="space-y-2 text-white/50 font-light">
              <li>
                <button onClick={onOpenDressingStudio} className="hover:text-white transition cursor-pointer" id="footer-link-dressing">
                  Virtual Dressing Studio
                </button>
              </li>
              <li>
                <button onClick={onOpenOrderTracker} className="hover:text-white transition cursor-pointer" id="footer-link-tracker">
                  Track Express Order
                </button>
              </li>
              <li>
                <button onClick={onOpenCareGuide} className="hover:text-white transition cursor-pointer" id="footer-link-care">
                  Apparel & Accessory Care
                </button>
              </li>
            </ul>
          </div>

          {/* Sourcing & Ethics */}
          <div className="space-y-3 text-xs">
            <h4 className="serif uppercase tracking-[0.2em] text-[#C5A059] text-[11px]">
              Our Promise
            </h4>
            <ul className="space-y-2 text-white/50 font-light">
              <li>Curated Brand Collections</li>
              <li>Verified Product Quality</li>
              <li>Express Doorstep Delivery</li>
              <li>Easy Exchanges & Support</li>
            </ul>
          </div>

          {/* Private Atelier Newsletter */}
          <div className="space-y-3 text-xs">
            <h4 className="serif uppercase tracking-[0.2em] text-[#C5A059] text-[11px]">
              Private Gazette
            </h4>
            <p className="text-white/40 font-light">
              Subscribe for private previews and receive 10% off your first creation with promo code <strong className="text-white font-medium">TREDNY10</strong>.
            </p>

            {subscribed ? (
              <div className="p-2.5 rounded-sm bg-[#14120c] border border-gold text-xs text-[#F1D592] flex items-center gap-2">
                <Check className="w-4 h-4 text-[#C5A059]" />
                <span>Subscribed! Use code <strong>TREDNY10</strong> at checkout.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                  id="footer-newsletter-input"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-sm bg-gold-gradient text-black font-semibold cursor-pointer hover:brightness-110"
                  id="footer-newsletter-btn"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-[10px] uppercase tracking-[0.2em] text-white/30 font-light gap-4">
          <p>© 2026 TREDNY Brand & Boutique. All rights reserved.</p>
          <div className="flex gap-6 items-center">
            <span className="hover:text-white/60 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-white/60 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-white/60 cursor-pointer">Security Certifications</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
