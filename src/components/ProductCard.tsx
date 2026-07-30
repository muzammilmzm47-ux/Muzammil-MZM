import React, { useState, useRef } from 'react';
import { Heart, Sparkles, Star, Eye } from 'lucide-react';
import { Product, CurrencyConfig } from '../types';
import { formatPrice } from '../utils/format';
import { QuickViewModal } from './QuickViewModal';

interface ProductCardProps {
  product: Product;
  currency: CurrencyConfig;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onQuickAdd: (product: Product, size: string, color: string) => void;
  onBuyNow?: (product: Product, size?: string, color?: string) => void;
  onOpenDetail: (product: Product) => void;
  onOpenInDressingRoom: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  isWishlisted,
  onToggleWishlist,
  onQuickAdd,
  onBuyNow,
  onOpenDetail,
  onOpenInDressingRoom,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedSize] = useState(product.sizes[0] || 'Standard');
  const [selectedColor] = useState(product.colors[0] || 'Default');

  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleImageMouseEnter = () => {
    setIsHovered(true);
    // Start hover delay timer to open quick view modal automatically when hovering over product image
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setIsQuickViewOpen(true);
    }, 400);
  };

  const handleImageMouseLeave = () => {
    setIsHovered(false);
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  return (
    <>
      <div
        className="group relative bg-[#121212] border border-white/5 rounded-sm overflow-hidden hover:border-gold transition-all duration-300 flex flex-col h-full"
        onMouseLeave={handleImageMouseLeave}
      >
        {/* Product Image Container */}
        <div 
          className="relative w-full aspect-[4/5] bg-[#0A0A0A] overflow-hidden cursor-pointer"
          onMouseEnter={handleImageMouseEnter}
          onMouseLeave={handleImageMouseLeave}
          onClick={() => {
            if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
            setIsQuickViewOpen(true);
          }}
        >
          <img
            src={isHovered && product.hoverImage ? product.hoverImage : product.primaryImage}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out opacity-90 group-hover:opacity-100"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            {product.isNew && (
              <span className="px-2 py-0.5 rounded-xs text-[9px] font-semibold tracking-[0.2em] uppercase bg-gold-gradient text-black">
                New Arrival
              </span>
            )}
            {product.isBestseller && (
              <span className="px-2 py-0.5 rounded-xs text-[9px] font-semibold tracking-[0.2em] uppercase bg-[#121212] text-[#F1D592] border border-gold">
                Couture Edition
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition z-10 cursor-pointer ${
              isWishlisted
                ? 'bg-gold-gradient text-black'
                : 'bg-black/50 text-white hover:bg-black/80 hover:text-[#C5A059]'
            }`}
            title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            id={`product-wishlist-${product.id}`}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
          </button>

          {/* Hover Quick Action Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
                setIsQuickViewOpen(true);
              }}
              className="px-3 py-1.5 rounded-sm bg-[#1A1A1A] border border-white/10 text-white text-[10px] uppercase tracking-wider hover:border-[#C5A059] transition flex items-center gap-1 cursor-pointer"
              id={`product-quick-view-${product.id}`}
            >
              <Eye className="w-3.5 h-3.5 text-[#C5A059]" />
              Quick View
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenInDressingRoom(product);
              }}
              className="px-3 py-1.5 rounded-sm bg-gold-gradient text-black font-semibold text-[10px] uppercase tracking-wider transition flex items-center gap-1 cursor-pointer hover:brightness-110"
              id={`product-try-on-${product.id}`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Style Studio
            </button>
          </div>
        </div>

        {/* Product Content Info */}
        <div className="p-4 flex flex-col flex-grow justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-[9px] text-white/40 serif uppercase tracking-[0.2em] mb-1">
              <span>{product.category === 'jewelry' ? `Jewelry • ${product.subcategory}` : `Fashions • ${product.subcategory}`}</span>
              <div className="flex items-center gap-1 text-[#F1D592]">
                <Star className="w-3 h-3 fill-current" />
                <span>{product.rating}</span>
              </div>
            </div>

            <h3 
              onClick={() => onOpenDetail(product)}
              className="text-sm serif font-medium text-white hover:text-[#C5A059] transition cursor-pointer line-clamp-1"
            >
              {product.name}
            </h3>

            <p className="text-xs text-white/50 line-clamp-1 font-light mt-0.5">
              {product.tagline}
            </p>
          </div>

          {/* Materials Tags */}
          <div className="flex flex-wrap gap-1">
            {product.materials.slice(0, 2).map((m) => (
              <span
                key={m}
                className="text-[9px] px-1.5 py-0.5 rounded-xs bg-[#1A1A1A] text-white/50 border border-white/5 font-light"
              >
                {m}
              </span>
            ))}
          </div>

          {/* Price & Action Buttons */}
          <div className="pt-2 border-t border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">
                {formatPrice(product.price, currency)}
              </span>
              <span className="text-[10px] text-emerald-400 font-sans">In Stock</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                onClick={() => onQuickAdd(product, selectedSize, selectedColor)}
                className="py-1.5 px-2 rounded-sm bg-[#14120c] border border-gold/60 text-[#F1D592] hover:bg-[#221e12] font-semibold text-[10px] tracking-[0.1em] uppercase transition cursor-pointer text-center"
                id={`product-add-to-cart-${product.id}`}
              >
                Add to Cart
              </button>
              <button
                onClick={() => onBuyNow ? onBuyNow(product, selectedSize, selectedColor) : onQuickAdd(product, selectedSize, selectedColor)}
                className="py-1.5 px-2 rounded-sm bg-gold-gradient text-black hover:brightness-110 font-bold text-[10px] tracking-[0.1em] uppercase transition cursor-pointer text-center"
                id={`product-buy-now-${product.id}`}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        currency={currency}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        isWishlisted={isWishlisted}
        onToggleWishlist={onToggleWishlist}
        onQuickAdd={onQuickAdd}
        onBuyNow={onBuyNow}
        onOpenDetail={onOpenDetail}
        onOpenInDressingRoom={onOpenInDressingRoom}
      />
    </>
  );
};
