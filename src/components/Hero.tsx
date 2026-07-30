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

      <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-12 py-20 sm:py-32 lg:py-40 relative z-10 text-center">
        <div className="space-y-10">

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-fashion font-light tracking-wider leading-[1.2]">
            <span className="gold-gradient font-medium tracking-widest">TREDNY</span> <br />
            <span className="italic font-normal text-white mt-2 inline-block">Brand</span>
          </h1>

          {/* Call To Action Buttons */}
          <div className="pt-6 flex flex-wrap gap-6 items-center justify-center">
            <button
              onClick={onOpenDressingStudio}
              className="group px-10 py-4 rounded-sm bg-gold-gradient text-black font-semibold text-xs uppercase tracking-[0.25em] transition hover:brightness-110 flex items-center gap-3 cursor-pointer shadow-xl shadow-[#C5A059]/15"
              id="hero-dressing-studio-cta-btn"
            >
              <Sparkles className="w-4 h-4 text-black group-hover:rotate-12 transition-transform" />
              <span>Virtual Dressing Studio</span>
              <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onExploreJewelry}
              className="px-10 py-4 rounded-sm border border-gold text-xs uppercase tracking-[0.25em] text-white hover:bg-white hover:text-black transition-colors flex items-center gap-2 cursor-pointer bg-[#121212]"
              id="hero-explore-jewelry-btn"
            >
              <Gem className="w-4 h-4 text-[#C5A059]" />
              <span>Fancy</span>
            </button>

            <button
              onClick={onExploreFashions}
              className="px-10 py-4 rounded-sm border border-gold text-xs uppercase tracking-[0.25em] text-white hover:bg-white hover:text-black transition-colors flex items-center gap-2 cursor-pointer bg-[#121212]"
              id="hero-explore-fashions-btn"
            >
              <Shirt className="w-4 h-4 text-[#C5A059]" />
              <span>Apparel</span>
            </button>
          </div>

          {/* Feature Highlights Bar */}
          <div className="pt-12 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-xs uppercase tracking-[0.2em] text-white/50 max-w-3xl mx-auto">
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
