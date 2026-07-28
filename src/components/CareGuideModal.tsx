import React from 'react';
import { X, Sparkles, Gem, Shirt, ShieldCheck } from 'lucide-react';

interface CareGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CareGuideModal: React.FC<CareGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative bg-[#121212] border border-[#2a2a2a] rounded-xl max-w-2xl w-full text-[#f8f6f0] p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#888888] hover:text-white transition cursor-pointer"
          id="care-guide-close-btn"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-[#C5A059] serif uppercase tracking-[0.2em] text-[10px] mb-1">
            <Sparkles className="w-4 h-4 text-[#F1D592]" />
            <span>TREDNY Atelier Guide</span>
          </div>
          <h2 className="text-2xl serif text-white">
            Jewelry & Fine Fabric Preservation
          </h2>
          <p className="text-xs text-white/50 font-light mt-1">
            Ensure your 18K solid gold, natural emeralds, GIA diamonds, and Italian silk creations remain immaculate for generations.
          </p>
        </div>

        <div className="space-y-4 text-xs">
          
          {/* Fine Jewelry Care */}
          <div className="p-4 bg-[#121212] border border-gold rounded-sm space-y-2">
            <h3 className="serif text-[#C5A059] uppercase tracking-wider text-[11px] flex items-center gap-2">
              <Gem className="w-4 h-4" />
              18K Gold, Emeralds & Diamond Maintenance
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-white/60 font-light">
              <li><strong className="text-white">Emerald Care:</strong> Natural emeralds feature delicate inclusions. Clean only with warm lint-free microfiber cloth; never submerge in ultrasonic cleaners.</li>
              <li><strong className="text-white">Diamond Brilliance:</strong> Soaking in warm water with mild, non-detergent soap restores maximum refraction.</li>
              <li><strong className="text-white">Storage:</strong> Store every piece in its lined TREDNY suede pouch to prevent metal-on-metal scratching.</li>
            </ul>
          </div>

          {/* Couture Apparel Care */}
          <div className="p-4 bg-[#121212] border border-gold rounded-sm space-y-2">
            <h3 className="serif text-[#C5A059] uppercase tracking-wider text-[11px] flex items-center gap-2">
              <Shirt className="w-4 h-4" />
              Silk Velvet, Organza & Cashmere Care
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-white/60 font-light">
              <li><strong className="text-white">Silk Velvet Gowns:</strong> Steam gently on reverse side. Always hang on padded cedar hangers. Specialist dry clean only.</li>
              <li><strong className="text-white">Loro Piana Cashmere Blazers:</strong> Air out after wear. Use a natural bristle garment brush to refresh cashmere fibers.</li>
            </ul>
          </div>

        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-sm bg-gold-gradient text-black font-semibold text-[10px] uppercase tracking-[0.2em] cursor-pointer hover:brightness-110"
            id="care-guide-done-btn"
          >
            Understood
          </button>
        </div>

      </div>
    </div>
  );
};
