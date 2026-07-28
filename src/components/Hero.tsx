import React from 'react';
import { Sparkles, ArrowRight, Gem, Shirt, ShieldCheck } from 'lucide-react';

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text & Manifesto */}
          <div className="lg:col-span-7 space-y-6">

            <h1 className="text-4xl sm:text-5xl lg:text-6xl serif font-light tracking-tight text-white leading-[1.12]">
              Where High Jewelry <br />
              <span className="italic font-normal gold-gradient">
                Meets Modern Couture
              </span>
            </h1>

            <p className="text-sm sm:text-base text-white/50 font-light max-w-2xl leading-relaxed">
              TREDNY crafts timeless 18k solid gold & GIA-certified diamond creations harmonized with bespoke silk, cashmere, and tailored velvet silhouettes. Step inside our interactive Virtual Dressing Room to curate your signature look.
            </p>

            {/* Call To Action Buttons */}
            <div className="pt-4 flex flex-wrap gap-4 items-center">
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
                <span>Jewelry</span>
              </button>

              <button
                onClick={onExploreFashions}
                className="px-8 py-3.5 rounded-sm border border-gold text-[10px] uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black transition-colors flex items-center gap-2 cursor-pointer bg-[#121212]"
                id="hero-explore-fashions-btn"
              >
                <Shirt className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Fashions</span>
              </button>
            </div>

            {/* Feature Highlights Bar */}
            <div className="pt-8 border-t border-white/5 grid grid-cols-3 gap-4 text-[10px] uppercase tracking-[0.15em] text-white/40">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>GIA Certified Gemstones</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>AI Style Assistant</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>Armored Express Shipping</span>
              </div>
            </div>

          </div>

          {/* Right Visual Gallery Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Primary Featured Look Image */}
              <div className="relative rounded-sm overflow-hidden border border-white/10 shadow-2xl group bg-[#121212]">
                <img
                  src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=1000"
                  alt="TREDNY Serpent Arc High Jewelry"
                  referrerPolicy="no-referrer"
                  className="w-full h-[420px] object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-90" />
                
                {/* Overlay Badge */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-sm bg-[#121212]/95 backdrop-blur-md border border-gold">
                  <span className="text-[10px] uppercase tracking-[0.3em] gold-gradient font-bold mb-1 block">
                    Featured High Jewelry
                  </span>
                  <p className="text-sm serif text-white font-medium">
                    The Serpent Arc Emerald Collier
                  </p>
                  <p className="text-[11px] text-white/40 mt-1 font-light italic">
                    Hand-forged 18K yellow gold with 4.5ct natural emerald & brilliant diamonds
                  </p>
                </div>
              </div>

              {/* Floating Accent Card - Apparel Pairing */}
              <div className="hidden sm:block absolute -bottom-8 -left-8 w-60 rounded-sm overflow-hidden border border-gold bg-[#121212] p-3 shadow-2xl">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1539109132382-381bb3f1cff6?auto=format&fit=crop&q=80&w=300"
                    alt="Apparel pairing"
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 object-cover rounded-sm"
                  />
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-[#C5A059] font-bold block">
                      Curated Pairing
                    </span>
                    <p className="text-xs text-white serif line-clamp-1">
                      Silk Drapery Evening Gown
                    </p>
                    <button
                      onClick={onOpenDressingStudio}
                      className="mt-1 text-[9px] uppercase tracking-wider text-[#F1D592] hover:underline flex items-center gap-1 cursor-pointer"
                      id="hero-pair-in-studio-btn"
                    >
                      Pair in Virtual Studio →
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
