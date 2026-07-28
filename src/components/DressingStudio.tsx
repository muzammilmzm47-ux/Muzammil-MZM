import React, { useState } from 'react';
import { Sparkles, Sliders, RefreshCw, ShoppingBag, Upload, Gem, Shirt, Check, ArrowRight, Wand2, Lightbulb } from 'lucide-react';
import { Product, AvatarModel, CurrencyConfig, AIStylingResponse } from '../types';
import { AVATAR_MODELS } from '../data/products';
import { formatPrice } from '../utils/format';

interface DressingStudioProps {
  products: Product[];
  currency: CurrencyConfig;
  initialProduct?: Product | null;
  onAddEnsembleToCart: (products: Product[]) => void;
  onOpenCart: () => void;
}

export const DressingStudio: React.FC<DressingStudioProps> = ({
  products,
  currency,
  initialProduct,
  onAddEnsembleToCart,
  onOpenCart,
}) => {
  // Products categorized
  const apparelItems = products.filter((p) => p.category === 'apparel');
  const jewelryItems = products.filter((p) => p.category === 'jewelry');

  // Selected State
  const [selectedModel, setSelectedModel] = useState<AvatarModel>(AVATAR_MODELS[0]);
  const [customModelUrl, setCustomModelUrl] = useState<string | null>(null);

  // Selected Outfit & Jewelry Layering
  const [selectedApparel, setSelectedApparel] = useState<Product | null>(
    initialProduct?.category === 'apparel'
      ? initialProduct
      : apparelItems[0] || null
  );

  const [selectedJewelry, setSelectedJewelry] = useState<Product | null>(
    initialProduct?.category === 'jewelry'
      ? initialProduct
      : jewelryItems[0] || null
  );

  // Fine positioning controls for jewelry overlay
  const [scale, setScale] = useState<number>(selectedJewelry?.dressingCoordinates.defaultScale || 0.4);
  const [offsetY, setOffsetY] = useState<number>(selectedJewelry?.dressingCoordinates.offsetY || 0);
  const [offsetX, setOffsetX] = useState<number>(selectedJewelry?.dressingCoordinates.offsetX || 0);

  // AI Stylist State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<AIStylingResponse | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [eventOccasion, setEventOccasion] = useState('Gala Night');

  // Handle image upload for custom model avatar
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomModelUrl(url);
    }
  };

  // Call backend AI Stylist endpoint
  const handleConsultAiStylist = async (promptText?: string) => {
    const textToSubmit = promptText || aiPrompt || 'Suggest a stunning high fashion ensemble for an exclusive evening soiree';
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/stylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSubmit,
          eventType: eventOccasion,
          currentLook: {
            apparel: selectedApparel?.name,
            jewelry: selectedJewelry?.name,
          },
          availableProducts: products,
        }),
      });

      if (res.ok) {
        const data: AIStylingResponse = await res.json();
        setAiResponse(data);

        // Auto apply recommended items if returned
        if (data.recommendedApparelId) {
          const recApparel = products.find((p) => p.id === data.recommendedApparelId);
          if (recApparel) setSelectedApparel(recApparel);
        }
        if (data.recommendedJewelryId) {
          const recJewel = products.find((p) => p.id === data.recommendedJewelryId);
          if (recJewel) {
            setSelectedJewelry(recJewel);
            setScale(recJewel.dressingCoordinates.defaultScale || 0.4);
            setOffsetY(recJewel.dressingCoordinates.offsetY || 0);
            setOffsetX(recJewel.dressingCoordinates.offsetX || 0);
          }
        }
      } else {
        // Fallback response
        setAiResponse({
          advice: "The Solstice Emerald Collier pairs exquisitely with the Midnight Velvet Evening Gown. The jewel tones of the emerald elevate the rich texture of Italian silk velvet.",
          styleConcept: "Met Gala Emerald & Velvet Synergy",
          stylingTips: [
            "Wear hair in a sleek low chignon to accentuate the collarbone.",
            "Choose minimalist gold stiletto sandals."
          ]
        });
      }
    } catch (err) {
      console.error(err);
      setAiResponse({
        advice: "The Aethel Diamond Solitaire Ring and Loro Piana Cashmere Smoking Blazer create a commanding, elegant silhouette.",
        styleConcept: "Contemporary High-Power Elegance",
        stylingTips: [
          "Keep neck accessories minimal to focus attention on hand brilliance.",
          "Pair with tailored silk trousers."
        ]
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleBuyEnsemble = () => {
    const ensemble: Product[] = [];
    if (selectedApparel) ensemble.push(selectedApparel);
    if (selectedJewelry) ensemble.push(selectedJewelry);

    if (ensemble.length > 0) {
      onAddEnsembleToCart(ensemble);
      onOpenCart();
    }
  };

  const currentTotalUSD = (selectedApparel?.price || 0) + (selectedJewelry?.price || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-[#f8f6f0]">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1c1910] border border-[#d4af37]/40 text-[#d4af37] text-xs font-serif uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Interactive Virtual Dressing Studio</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#f8f6f0] font-normal">
          Style Couture Apparel & Fine Jewelry
        </h1>
        <p className="text-xs text-white/50 font-light max-w-2xl mx-auto">
          Mix-and-match TREDNY high jewelry with modern apparel silhouettes on studio models or your own photo. Receive real-time editorial advice from TREDNY AI Curator.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Outfit & Jewelry Selector Tabs */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Avatar / Photo Switcher */}
          <div className="bg-[#121212] border border-[#262626] rounded-lg p-5 space-y-4">
            <h3 className="text-xs font-serif uppercase tracking-widest text-[#d4af37] flex items-center gap-2">
              <span>1. Choose Studio Model Avatar</span>
            </h3>

            <div className="grid grid-cols-3 gap-2">
              {AVATAR_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    setSelectedModel(model);
                    setCustomModelUrl(null);
                  }}
                  className={`p-1.5 rounded border transition text-center cursor-pointer ${
                    selectedModel.id === model.id && !customModelUrl
                      ? 'border-[#d4af37] bg-[#1d1a12]'
                      : 'border-[#2a2a2a] bg-[#161616] hover:border-[#444]'
                  }`}
                  id={`avatar-model-${model.id}`}
                >
                  <img
                    src={model.image}
                    alt={model.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-16 object-cover rounded mb-1"
                  />
                  <span className="text-[10px] text-[#d4d4d4] block truncate font-serif">
                    {model.name.split(' - ')[0]}
                  </span>
                </button>
              ))}
            </div>

            {/* Custom Photo Upload */}
            <div className="pt-2 border-t border-[#222222]">
              <label className="flex items-center justify-center gap-2 py-2 px-3 rounded border border-dashed border-[#444444] hover:border-[#d4af37] text-xs text-[#a3a3a3] hover:text-[#d4af37] cursor-pointer transition">
                <Upload className="w-3.5 h-3.5" />
                <span>{customModelUrl ? 'Change Uploaded Photo' : 'Upload Your Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="dressing-photo-upload-input"
                />
              </label>
            </div>
          </div>

          {/* Couture Apparel Picker */}
          <div className="bg-[#121212] border border-[#262626] rounded-lg p-5 space-y-3">
            <h3 className="text-xs font-serif uppercase tracking-widest text-[#d4af37] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Shirt className="w-4 h-4" />
                2. Select Apparel Ensemble
              </span>
              <span className="text-[10px] text-[#888888]">
                {selectedApparel ? formatPrice(selectedApparel.price, currency) : '$0'}
              </span>
            </h3>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {apparelItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedApparel(item)}
                  className={`p-2.5 rounded border transition flex items-center justify-between cursor-pointer ${
                    selectedApparel?.id === item.id
                      ? 'border-[#d4af37] bg-[#1d1a12]'
                      : 'border-[#262626] bg-[#161616] hover:border-[#444]'
                  }`}
                  id={`select-apparel-${item.id}`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.primaryImage}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 object-cover rounded border border-[#333]"
                    />
                    <div>
                      <p className="text-xs text-[#f8f6f0] font-serif font-medium line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-[#a3a3a3]">
                        {item.materials[0]}
                      </p>
                    </div>
                  </div>
                  {selectedApparel?.id === item.id && (
                    <Check className="w-4 h-4 text-[#d4af37] shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* High Jewelry Picker */}
          <div className="bg-[#121212] border border-[#262626] rounded-lg p-5 space-y-3">
            <h3 className="text-xs font-serif uppercase tracking-widest text-[#d4af37] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Gem className="w-4 h-4" />
                3. Layer Fine Jewelry Piece
              </span>
              <span className="text-[10px] text-[#888888]">
                {selectedJewelry ? formatPrice(selectedJewelry.price, currency) : '$0'}
              </span>
            </h3>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {jewelryItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedJewelry(item);
                    setScale(item.dressingCoordinates.defaultScale || 0.4);
                    setOffsetY(item.dressingCoordinates.offsetY || 0);
                    setOffsetX(item.dressingCoordinates.offsetX || 0);
                  }}
                  className={`p-2.5 rounded border transition flex items-center justify-between cursor-pointer ${
                    selectedJewelry?.id === item.id
                      ? 'border-[#d4af37] bg-[#1d1a12]'
                      : 'border-[#262626] bg-[#161616] hover:border-[#444]'
                  }`}
                  id={`select-jewelry-${item.id}`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.primaryImage}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 object-cover rounded border border-[#333]"
                    />
                    <div>
                      <p className="text-xs text-[#f8f6f0] font-serif font-medium line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-[#a3a3a3]">
                        {item.subcategory.toUpperCase()} • {item.materials[0]}
                      </p>
                    </div>
                  </div>
                  {selectedJewelry?.id === item.id && (
                    <Check className="w-4 h-4 text-[#d4af37] shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Center Column: Interactive Visual Dressing Stage */}
        <div className="lg:col-span-5 flex flex-col items-center">
          
          <div className="relative w-full aspect-[3/4] max-w-md bg-[#090909] border border-[#333333] rounded-xl overflow-hidden shadow-2xl flex items-center justify-center">
            
            {/* Background Model Image */}
            <img
              src={customModelUrl || selectedModel.image}
              alt="Model Canvas"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter brightness-95"
            />

            {/* Layer 1: Apparel Overlay Representation */}
            {selectedApparel && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-85 mix-blend-multiply">
                <img
                  src={selectedApparel.primaryImage}
                  alt={selectedApparel.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded opacity-80"
                />
              </div>
            )}

            {/* Layer 2: Jewelry Piece Overlay with Slider Positioning */}
            {selectedJewelry && (
              <div
                className="absolute transition-all pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
                style={{
                  transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
                }}
              >
                <img
                  src={selectedJewelry.primaryImage}
                  alt={selectedJewelry.name}
                  referrerPolicy="no-referrer"
                  className="w-48 h-48 object-contain filter drop-shadow-[0_4px_12px_rgba(212,175,55,0.6)]"
                />
              </div>
            )}

            {/* Floating Live Spec Badge */}
            <div className="absolute bottom-4 left-4 right-4 bg-[#121212]/90 backdrop-blur-md border border-[#333333] p-3 rounded-lg flex items-center justify-between text-xs">
              <div>
                <p className="text-[10px] text-[#d4af37] uppercase font-serif tracking-widest">
                  Styled Ensemble Total
                </p>
                <p className="text-sm font-semibold text-white">
                  {formatPrice(currentTotalUSD, currency)}
                </p>
              </div>

              <button
                onClick={handleBuyEnsemble}
                className="px-4 py-2 rounded bg-[#d4af37] hover:bg-[#c29f2e] text-black font-semibold text-xs uppercase tracking-widest transition flex items-center gap-1.5 cursor-pointer"
                id="dressing-buy-ensemble-btn"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Buy Outfit</span>
              </button>
            </div>

          </div>

          {/* Positioning Adjuster Controls */}
          {selectedJewelry && (
            <div className="w-full max-w-md mt-4 p-4 bg-[#121212] border border-[#282828] rounded-lg text-xs space-y-3">
              <div className="flex items-center justify-between text-[#d4af37] font-serif uppercase tracking-wider text-[11px]">
                <span className="flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5" />
                  Fine Jewelry Positioning
                </span>
                <button
                  onClick={() => {
                    setScale(selectedJewelry.dressingCoordinates.defaultScale || 0.4);
                    setOffsetY(selectedJewelry.dressingCoordinates.offsetY || 0);
                    setOffsetX(selectedJewelry.dressingCoordinates.offsetX || 0);
                  }}
                  className="text-[10px] text-[#888888] hover:text-white flex items-center gap-1 cursor-pointer"
                  id="reset-position-btn"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reset Position
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] text-[#888888] block mb-1">Scale</span>
                  <input
                    type="range"
                    min="0.2"
                    max="0.8"
                    step="0.02"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="w-full accent-[#d4af37] cursor-pointer"
                    id="slider-scale"
                  />
                </div>

                <div>
                  <span className="text-[10px] text-[#888888] block mb-1">Vertical Y</span>
                  <input
                    type="range"
                    min="-80"
                    max="120"
                    step="2"
                    value={offsetY}
                    onChange={(e) => setOffsetY(parseInt(e.target.value))}
                    className="w-full accent-[#d4af37] cursor-pointer"
                    id="slider-offset-y"
                  />
                </div>

                <div>
                  <span className="text-[10px] text-[#888888] block mb-1">Horizontal X</span>
                  <input
                    type="range"
                    min="-80"
                    max="80"
                    step="2"
                    value={offsetX}
                    onChange={(e) => setOffsetX(parseInt(e.target.value))}
                    className="w-full accent-[#d4af37] cursor-pointer"
                    id="slider-offset-x"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Venm AI Styling Advisor */}
        <div className="lg:col-span-3 space-y-6">
          
          <div className="bg-[#121212] border border-[#d4af37]/40 rounded-lg p-5 space-y-4 shadow-xl">
            
            <div className="flex items-center gap-2 text-[#d4af37]">
              <Wand2 className="w-4 h-4" />
              <h3 className="text-xs font-serif uppercase tracking-widest font-semibold">
                Venm AI Style Advisor
              </h3>
            </div>

            <p className="text-xs text-[#a3a3a3] font-light">
              Get intelligent haute couture commentary and automated pairing recommendations powered by Gemini.
            </p>

            {/* Quick Prompt Chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] text-[#d4af37] uppercase font-serif tracking-widest block">
                Occasion Presets
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Met Gala Red Carpet',
                  'Monaco Yacht Soiree',
                  'Opera House Premiere',
                  'Minimalist Riviera Gold',
                ].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => {
                      setEventOccasion(chip);
                      handleConsultAiStylist(`Suggest ensemble for ${chip}`);
                    }}
                    className="px-2.5 py-1 rounded bg-[#1a1812] border border-[#3a3320] hover:border-[#d4af37] text-[10px] text-[#e6c65c] transition cursor-pointer"
                    id={`prompt-chip-${chip.replace(/\s+/g, '-')}`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Input */}
            <div className="space-y-2 pt-2">
              <textarea
                placeholder="Describe your event or styling preference (e.g. 'I need an emerald necklace and black gown for a gala in Cannes')..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows={3}
                className="w-full bg-[#181818] border border-[#333333] rounded p-2.5 text-xs text-[#f8f6f0] focus:outline-none focus:border-[#d4af37] resize-none"
                id="ai-stylist-textarea"
              />

              <button
                onClick={() => handleConsultAiStylist()}
                disabled={isAiLoading}
                className="w-full py-2.5 px-4 rounded bg-[#d4af37] hover:bg-[#c29f2e] text-black font-semibold text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                id="ai-stylist-submit-btn"
              >
                {isAiLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Curating Haute Look...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-black" />
                    <span>Consult AI Stylist</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Response Display */}
            {aiResponse && (
              <div className="pt-4 border-t border-[#2a2a2a] space-y-3 animate-fadeIn">
                <div className="bg-[#181610] p-3 rounded border border-[#d4af37]/30 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-serif text-[#d4af37]">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>{aiResponse.styleConcept}</span>
                  </div>
                  <p className="text-xs text-[#d4d4d4] leading-relaxed font-light italic">
                    "{aiResponse.advice}"
                  </p>
                </div>

                {aiResponse.stylingTips && (
                  <div className="space-y-1 text-[11px] text-[#a3a3a3]">
                    <span className="text-[#d4af37] font-serif uppercase tracking-wider block text-[10px]">
                      Atelier Styling Notes
                    </span>
                    <ul className="list-disc pl-4 space-y-1">
                      {aiResponse.stylingTips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
