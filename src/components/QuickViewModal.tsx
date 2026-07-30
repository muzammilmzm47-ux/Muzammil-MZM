import React, { useState } from 'react';
import { X, Star, Heart, Sparkles, ShieldCheck, MessageCircle, Eye, ShoppingBag, Check, ArrowRight } from 'lucide-react';
import { Product, CurrencyConfig } from '../types';
import { formatPrice } from '../utils/format';
import { openWhatsAppChat } from '../utils/whatsapp';

interface QuickViewModalProps {
  product: Product | null;
  currency: CurrencyConfig;
  isOpen: boolean;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onQuickAdd: (product: Product, size: string, color: string) => void;
  onBuyNow?: (product: Product, size?: string, color?: string) => void;
  onOpenDetail: (product: Product) => void;
  onOpenInDressingRoom: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  currency,
  isOpen,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onQuickAdd,
  onBuyNow,
  onOpenDetail,
  onOpenInDressingRoom,
}) => {
  if (!isOpen || !product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [addedToast, setAddedToast] = useState(false);

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.primaryImage, product.hoverImage].filter(Boolean) as string[];

  const currentImage = images[activeImageIndex] || product.primaryImage;
  const fallbackImgSrc = 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800';

  const handleAddToCart = () => {
    onQuickAdd(product, product.sizes[0] || 'Standard', product.colors[0] || 'Default');
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNowClick = () => {
    if (onBuyNow) {
      onBuyNow(product, product.sizes[0] || 'Standard', product.colors[0] || 'Default');
    } else {
      onQuickAdd(product, product.sizes[0] || 'Standard', product.colors[0] || 'Default');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div 
        className="relative bg-[#121212] border border-[#d4af37]/40 rounded-xl max-w-2xl w-full text-[#f8f6f0] overflow-hidden shadow-2xl my-auto animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar Banner */}
        <div className="bg-[#181812] px-4 py-2 border-b border-[#282828] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#d4af37] uppercase font-semibold">
            <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>TREDNY Quick View</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/40 text-[#888888] hover:text-white hover:bg-black transition cursor-pointer"
            title="Close Quick View"
            id="quick-view-close-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-5">
          
          {/* Left Column: Image & Badges */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-lg overflow-hidden border border-[#262626] bg-[#0a0a0a]">
              <img
                src={currentImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                onError={(e) => { (e.target as HTMLImageElement).src = fallbackImgSrc; }}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />

              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                {product.isNew && (
                  <span className="px-2 py-0.5 rounded-xs text-[9px] font-semibold tracking-wider uppercase bg-[#d4af37] text-black">
                    New
                  </span>
                )}
                {product.isBestseller && (
                  <span className="px-2 py-0.5 rounded-xs text-[9px] font-semibold tracking-wider uppercase bg-[#121212] text-[#d4af37] border border-[#d4af37]">
                    Couture
                  </span>
                )}
              </div>

              {/* Wishlist Icon */}
              <button
                onClick={() => onToggleWishlist(product)}
                className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition z-10 cursor-pointer ${
                  isWishlisted
                    ? 'bg-[#d4af37] text-black'
                    : 'bg-black/60 text-white hover:text-[#d4af37]'
                }`}
                title="Save to Wishlist"
                id="quick-view-wishlist-btn"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-12 h-12 rounded border transition overflow-hidden shrink-0 cursor-pointer ${
                      activeImageIndex === idx ? 'border-[#d4af37]' : 'border-white/10 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Details & Fast Actions */}
          <div className="flex flex-col justify-between space-y-3">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-[10px] text-[#888888] uppercase tracking-wider mb-1">
                <span>{product.category === 'jewelry' ? `Jewelry • ${product.subcategory}` : `Fashions • ${product.subcategory}`}</span>
                <div className="flex items-center gap-1 text-[#d4af37]">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="font-semibold text-white">{product.rating}</span>
                </div>
              </div>

              {/* Product Name & Tagline */}
              <h3 className="text-base sm:text-lg font-serif font-semibold text-white leading-tight">
                {product.name}
              </h3>
              <p className="text-xs text-[#d4af37]/90 font-light mt-0.5">
                {product.tagline}
              </p>

              {/* Price */}
              <div className="mt-2.5 flex items-baseline gap-2 border-b border-[#222222] pb-2.5">
                <span className="text-lg font-bold text-white font-mono">
                  {formatPrice(product.price, currency)}
                </span>
                <span className="text-[10px] text-emerald-400 font-sans">Available in Kerala & Karnataka</span>
              </div>

              {/* Description preview */}
              <p className="text-xs text-[#a3a3a3] line-clamp-2 mt-2 leading-relaxed">
                {product.description}
              </p>

              {/* Material tags */}
              <div className="flex flex-wrap gap-1 mt-2.5">
                {product.materials.map((m) => (
                  <span key={m} className="text-[10px] px-2 py-0.5 rounded bg-[#1c1c1c] text-[#d4d4d4] border border-[#333333]">
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-[#222222]">
              
              {/* Added Toast Alert */}
              {addedToast && (
                <div className="p-1.5 bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[11px] rounded flex items-center justify-center gap-1.5 animate-fadeIn">
                  <Check className="w-3.5 h-3.5" />
                  <span>Added to Cart successfully!</span>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-2 px-3 rounded bg-[#1c1c1c] border border-[#d4af37]/60 hover:bg-[#282828] text-[#d4af37] font-semibold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer"
                  id="quick-view-add-cart-btn"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add To Cart</span>
                </button>

                <button
                  onClick={handleBuyNowClick}
                  className="flex-1 py-2 px-3 rounded bg-gold-gradient hover:brightness-110 text-black font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1 cursor-pointer"
                  id="quick-view-buy-now-btn"
                >
                  <span>Buy Now</span>
                </button>
              </div>

              {/* WhatsApp direct order */}
              <button
                type="button"
                onClick={() => openWhatsAppChat('7338447753', `Hi TREDNY! I am interested in quick-ordering: ${product.name} (${formatPrice(product.price, currency)}). Please confirm details.`)}
                className="w-full py-2 px-3 rounded bg-emerald-900/70 hover:bg-emerald-800 text-emerald-300 border border-emerald-500/40 font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                id="quick-view-whatsapp-btn"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400 fill-current" />
                <span>WhatsApp Order (7338447753)</span>
              </button>

              {/* Style Studio & Full Details buttons */}
              <div className="flex items-center justify-between pt-1 text-[11px]">
                <button
                  onClick={() => {
                    onClose();
                    onOpenInDressingRoom(product);
                  }}
                  className="text-[#d4af37] hover:underline flex items-center gap-1 cursor-pointer"
                  id="quick-view-[#d4af37]-studio-btn"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Style Studio Try-On</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenDetail(product);
                  }}
                  className="text-white/80 hover:text-white hover:underline flex items-center gap-1 cursor-pointer font-medium"
                  id="quick-view-full-details-btn"
                >
                  <span>Full Product Page</span>
                  <ArrowRight className="w-3 h-3 text-[#d4af37]" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
