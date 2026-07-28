import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product, CurrencyConfig } from '../types';
import { formatPrice } from '../utils/format';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  currency: CurrencyConfig;
  onRemoveFromWishlist: (product: Product) => void;
  onMoveToCart: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  currency,
  onRemoveFromWishlist,
  onMoveToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0A0A0A] border-l border-white/5 text-[#E5E5E5] flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#121212]">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#C5A059] fill-current" />
              <h2 className="text-base serif tracking-[0.2em] uppercase text-white">
                Wishlist ({wishlistProducts.length})
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-white/40 hover:text-white transition cursor-pointer"
              id="wishlist-close-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlistProducts.length > 0 ? (
              wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-4 bg-[#121212] border border-gold rounded-sm flex gap-4 relative group"
                >
                  <img
                    src={product.primaryImage}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 object-cover rounded-sm border border-white/10"
                  />

                  <div className="flex-1 space-y-1">
                    <h3 className="text-xs serif font-medium text-white line-clamp-1 pr-6">
                      {product.name}
                    </h3>

                    <p className="text-[10px] text-[#C5A059] serif font-medium">
                      {formatPrice(product.price, currency)}
                    </p>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => onMoveToCart(product)}
                        className="px-3 py-1.5 rounded-sm bg-gold-gradient text-black font-semibold text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer hover:brightness-110"
                        id={`wishlist-move-bag-${product.id}`}
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move To Bag</span>
                      </button>

                      <button
                        onClick={() => onRemoveFromWishlist(product)}
                        className="p-1.5 text-white/40 hover:text-red-400 transition cursor-pointer"
                        title="Remove"
                        id={`wishlist-remove-${product.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 space-y-3">
                <Heart className="w-12 h-12 text-[#C5A059] mx-auto opacity-40" />
                <p className="text-sm serif text-white">Your wishlist is currently empty.</p>
                <p className="text-xs text-white/40">
                  Click the heart icon on any high jewelry or apparel piece to save it for later.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
