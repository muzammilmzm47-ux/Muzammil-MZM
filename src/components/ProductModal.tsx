import React, { useState } from 'react';
import { X, Star, ShieldCheck, Sparkles, Check, Heart, Truck, Award, Maximize2 } from 'lucide-react';
import { Product, CurrencyConfig } from '../types';
import { formatPrice } from '../utils/format';

interface ProductModalProps {
  product: Product | null;
  currency: CurrencyConfig;
  isOpen: boolean;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (
    product: Product,
    size: string,
    color: string,
    quantity: number,
    engravingText?: string
  ) => void;
  onBuyNow?: (
    product: Product,
    size?: string,
    color?: string,
    engravingText?: string
  ) => void;
  onOpenInDressingRoom: (product: Product) => void;
  allProducts: Product[];
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  currency,
  isOpen,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onOpenInDressingRoom,
  allProducts,
}) => {
  if (!isOpen || !product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'Standard');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || 'Default');
  const [quantity, setQuantity] = useState(1);
  const [engravingText, setEngravingText] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'certificate'>('details');
  const [isFullScreenView, setIsFullScreenView] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity, engravingText);
  };

  const handleBuyNowClick = () => {
    if (onBuyNow) {
      onBuyNow(product, selectedSize, selectedColor, engravingText);
    } else {
      onAddToCart(product, selectedSize, selectedColor, quantity, engravingText);
    }
  };

  const currentImgSrc = product.images[activeImageIndex] || product.primaryImage;
  const fallbackImgSrc = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800';

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
        <div className="relative bg-[#121212] border border-[#2a2a2a] rounded-xl max-w-4xl w-full text-[#f8f6f0] overflow-hidden shadow-2xl my-8">
          
          {/* Close Modal Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-[#888888] hover:text-white hover:bg-black transition cursor-pointer"
            id="product-modal-close-btn"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Left: Image Gallery */}
            <div className="p-6 bg-[#0a0a0a] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#222222]">
              <div 
                className="relative aspect-square rounded-lg overflow-hidden border border-[#222222] mb-4 cursor-zoom-in group"
                onClick={() => setIsFullScreenView(true)}
              >
                <img
                  src={currentImgSrc}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => { (e.target as HTMLImageElement).src = fallbackImgSrc; }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 rounded bg-black/80 text-[#d4af37] text-xs flex items-center gap-1.5 border border-[#d4af37]/40">
                    <Maximize2 className="w-3.5 h-3.5" /> Full Screen View
                  </span>
                </div>

                {product.isBestseller && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-[#d4af37] text-black text-[9px] font-bold uppercase tracking-widest">
                    Haute Masterpiece
                  </span>
                )}
              </div>

              {/* Thumbnail Row */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded overflow-hidden border-2 transition shrink-0 cursor-pointer ${
                      activeImageIndex === idx ? 'border-[#d4af37]' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                    id={`product-thumbnail-${idx}`}
                  >
                    <img 
                      src={img} 
                      alt="" 
                      referrerPolicy="no-referrer" 
                      onError={(e) => { (e.target as HTMLImageElement).src = fallbackImgSrc; }}
                      className="w-full h-full object-cover" 
                    />
                  </button>
                ))}
              </div>

              {/* Virtual Dressing CTA */}
              <button
                onClick={() => {
                  onClose();
                  onOpenInDressingRoom(product);
                }}
                className="mt-4 w-full py-2.5 px-4 rounded bg-[#1c1a11] border border-[#d4af37]/50 text-[#e6c65c] hover:bg-[#d4af37] hover:text-black font-semibold text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 cursor-pointer"
                id="modal-dressing-studio-btn"
              >
                <Sparkles className="w-4 h-4" />
                Style This Piece in Virtual Dressing Studio
              </button>
            </div>

            {/* Right: Product Details & Purchase Form */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
              
              <div>
                <div className="flex items-center justify-between text-xs text-[#888888] font-serif uppercase tracking-widest mb-1">
                  <span>{product.category === 'jewelry' ? `Jewelry • ${product.subcategory}` : `Fashions • ${product.subcategory}`}</span>
                  <div className="flex items-center gap-1 text-[#e6c65c]">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{product.rating} ({product.reviewCount} Reviews)</span>
                  </div>
                </div>

                <h1 className="text-2xl font-serif text-[#f8f6f0] font-normal leading-tight">
                  {product.name}
                </h1>

                <p className="text-sm text-[#d4af37] font-serif italic mt-1">
                  {product.tagline}
                </p>

                <div className="mt-4 text-2xl font-semibold text-[#f8f6f0]">
                  {formatPrice(product.price, currency)}
                </div>
              </div>

              {/* Customization Selectors */}
              <div className="space-y-4 pt-4 border-t border-[#222222]">
                
                {/* Size Selector */}
                <div>
                  <label className="block text-xs font-serif uppercase text-[#d4af37] tracking-wider mb-2">
                    Select {product.category === 'jewelry' ? 'Size' : 'Apparel Size'}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3 py-1.5 rounded text-xs transition cursor-pointer ${
                          selectedSize === sz
                            ? 'bg-[#d4af37] text-black font-semibold'
                            : 'bg-[#1a1a1a] text-[#d4d4d4] border border-[#333333] hover:border-[#d4af37]'
                        }`}
                        id={`modal-size-${sz}`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optional Custom Note */}
                <div>
                  <label className="block text-xs font-serif uppercase text-[#d4af37] tracking-wider mb-1">
                    Custom Requests or Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Special instructions or tailoring request"
                    value={engravingText}
                    onChange={(e) => setEngravingText(e.target.value)}
                    maxLength={50}
                    className="w-full bg-[#181818] border border-[#333333] rounded px-3 py-2 text-xs text-[#f8f6f0] focus:outline-none focus:border-[#d4af37]"
                    id="modal-engraving-input"
                  />
                </div>

              </div>

              {/* Tabbed Info View: Details & Certificate (Specifications removed as requested) */}
              <div className="pt-4 border-t border-[#222222]">
                <div className="flex gap-4 border-b border-[#222222] pb-2 text-xs uppercase tracking-widest">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`pb-1 cursor-pointer ${activeTab === 'details' ? 'text-[#d4af37] border-b-2 border-[#d4af37]' : 'text-[#888888]'}`}
                    id="modal-tab-details"
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab('certificate')}
                    className={`pb-1 cursor-pointer ${activeTab === 'certificate' ? 'text-[#d4af37] border-b-2 border-[#d4af37]' : 'text-[#888888]'}`}
                    id="modal-tab-certificate"
                  >
                    Authenticity & Guarantee
                  </button>
                </div>

                <div className="py-3 text-xs text-[#a3a3a3] font-light min-h-[70px]">
                  {activeTab === 'details' && (
                    <p className="leading-relaxed">{product.description}</p>
                  )}

                  {activeTab === 'certificate' && (
                    <div className="flex items-center gap-3 bg-[#181818] p-3 rounded border border-[#d4af37]/30">
                      <Award className="w-8 h-8 text-[#d4af37] shrink-0" />
                      <div>
                        <p className="text-white font-medium">TREDNY Certified Guarantee</p>
                        <p className="text-[10px] text-[#888888]">
                          Every piece is handcrafted with precision materials, verified quality standards, and full customer service support.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Add to Cart, Buy Now & Wishlist Buttons */}
              <div className="pt-4 border-t border-[#222222] flex items-center gap-3">
                <button
                  onClick={handleAdd}
                  className="flex-1 py-3 px-3 rounded bg-[#1c1c1c] border border-[#d4af37]/60 hover:bg-[#282828] text-[#d4af37] font-semibold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  id="modal-add-to-bag-btn"
                >
                  <span>Add To Cart</span>
                </button>

                <button
                  onClick={handleBuyNowClick}
                  className="flex-1 py-3 px-3 rounded bg-gold-gradient hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  id="modal-buy-now-btn"
                >
                  <span>Buy Now</span>
                </button>

                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`p-3 rounded border transition cursor-pointer ${
                    isWishlisted
                      ? 'bg-[#d4af37] text-black border-[#d4af37]'
                      : 'bg-[#1c1c1c] text-[#f8f6f0] border border-[#333333] hover:border-[#d4af37]'
                  }`}
                  title="Wishlist"
                  id="modal-wishlist-toggle-btn"
                >
                  <Heart className="w-5 h-5 fill-current" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Lightbox Overlay for Full Image View */}
      {isFullScreenView && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsFullScreenView(false)}
        >
          <button
            onClick={() => setIsFullScreenView(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
            id="fullscreen-close-btn"
          >
            <X className="w-6 h-6" />
          </button>
          
          <img
            src={currentImgSrc}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={(e) => { (e.target as HTMLImageElement).src = fallbackImgSrc; }}
            className="max-w-full max-h-[90vh] object-contain rounded shadow-2xl"
          />
        </div>
      )}
    </>
  );
};
