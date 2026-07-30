import React from 'react';
import { Sparkles, ArrowRight, Gem, Shirt, ShieldCheck } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface HeroProps {
  onExploreJewelry: () => void;
  onExploreFashions: () => void;
  onOpenDressingStudio: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreJewelry,
  onExploreFashions,
  onOpenDressingStudio,
}) => {
  return (
    <section className="relative bg-[#0A0A0A] text-[#E5E5E5] border-b border-white/5 overflow-hidden">
      
      {/* Background Decorative Gradient & Ambient Glow */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-radial from-[#C5A059]/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-radial from-[#121212] via-transparent to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10 text-center">
        <div className="space-y-6">

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-fashion font-light tracking-tight leading-[1.12]">
            <span className="gold-gradient font-medium tracking-wider">TREDNY</span> <br />
            <span className="italic font-normal text-white">Brand</span>
          </h1>

          {/* Call To Action Buttons */}
          <div className="pt-4 flex flex-wrap gap-4 items-center justify-center">
            <button
              onClick={onOpenDressingStudio}
              className="group px-8 py-3.5 rounded-sm bg-gold-gradient text-black font-semibold text-[10px] uppercase tracking-[0.2em] transition hover:brightness-110 flex items-center gap-3 cursor-pointer shadow-lg shadow-[#C5A059]/10"
              id="hero-dressing-studio-cta-btn"
            >
              <Sparkles className="w-4 h-4 text-black group-hover:rotate-12 transition-transform" />
              <span>Virtual Dressing Studio</span>
              <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onExploreJewelry}
              className="px-8 py-3.5 rounded-sm border border-gold text-[10px] uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black transition-colors flex items-center gap-2 cursor-pointer bg-[#121212]"
              id="hero-explore-jewelry-btn"
            >
              <Gem className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Fancy</span>
            </button>

            <button
              onClick={onExploreFashions}
              className="px-8 py-3.5 rounded-sm border border-gold text-[10px] uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black transition-colors flex items-center gap-2 cursor-pointer bg-[#121212]"
              id="hero-explore-fashions-btn"
            >
              <Shirt className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Apparel</span>
            </button>
          </div>

          {/* Feature Highlights Bar */}
          <div className="pt-8 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-[10px] uppercase tracking-[0.15em] text-white/40 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span>Quality Guaranteed</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span>AI Style Assistant</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ArrowRight className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span>Express Delivery</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
