import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ShieldCheck, Tag, ArrowRight, Check, MessageCircle } from 'lucide-react';
import { CartItem, CurrencyConfig } from '../types';
import { PROMO_CODES } from '../data/products';
import { formatPrice } from '../utils/format';
import { openWhatsAppChat, buildCartWhatsAppMessage } from '../utils/whatsapp';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currency: CurrencyConfig;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: (appliedDiscount: number, isGiftWrapped: boolean) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [isGiftWrapped, setIsGiftWrapped] = useState(true);

  const rawSubtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const discountAmount = rawSubtotal * discountPercent;
  const giftFee = isGiftWrapped ? 25 : 0;
  const finalSubtotal = rawSubtotal - discountAmount + giftFee;

  const handleApplyPromo = () => {
    setPromoError('');
    setPromoSuccess('');
    const code = promoCode.trim().toUpperCase();
    
    if (PROMO_CODES[code]) {
      setDiscountPercent(PROMO_CODES[code]);
      setPromoSuccess(`Promo Code '${code}' Applied: ${PROMO_CODES[code] * 100}% Off`);
    } else {
      setPromoError('Invalid promo code. Try "TREDNY10" or "LUXURY20"');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0A0A0A] border-l border-white/5 text-[#E5E5E5] flex flex-col shadow-2xl">
          
          {/* Cart Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#121212]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C5A059]" />
              <h2 className="text-base serif tracking-[0.2em] uppercase text-white">
                Shopping Bag ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-white/40 hover:text-white transition cursor-pointer"
              id="cart-drawer-close-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-[#121212] border border-gold rounded-sm flex gap-4 relative group"
                >
                  <img
                    src={item.product.primaryImage}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 object-cover rounded-sm border border-white/10"
                  />

                  <div className="flex-1 space-y-1">
                    <h3 className="text-xs serif font-medium text-white line-clamp-1 pr-6">
                      {item.product.name}
                    </h3>

                    <p className="text-[10px] text-white/50">
                      Size: <span className="text-[#C5A059] font-medium">{item.selectedSize}</span>
                    </p>

                    {item.engravingText && (
                      <p className="text-[10px] text-[#F1D592] italic">
                        Note: "{item.engravingText}"
                      </p>
                    )}

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">
                        {formatPrice(item.product.price * item.quantity, currency)}
                      </span>

                      {/* Quantity Buttons */}
                      <div className="flex items-center gap-2 bg-[#1A1A1A] border border-white/10 rounded-sm px-2 py-0.5 text-xs">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="hover:text-[#C5A059] px-1 cursor-pointer"
                          id={`cart-decrease-${item.id}`}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="hover:text-[#C5A059] px-1 cursor-pointer"
                          id={`cart-increase-${item.id}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Item Button */}
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="absolute top-3 right-3 text-white/30 hover:text-red-400 transition cursor-pointer"
                    title="Remove item"
                    id={`cart-remove-${item.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-16 space-y-3">
                <ShoppingBag className="w-12 h-12 text-[#C5A059] mx-auto opacity-40" />
                <p className="text-sm serif text-white">Your shopping bag is currently empty.</p>
                <p className="text-xs text-white/40">
                  Explore TREDNY high jewelry or modern apparel to add creations.
                </p>
              </div>
            )}
          </div>

          {/* Cart Footer & Summary */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-white/5 bg-[#121212] space-y-4">
              
              {/* Gift Wrapping Option */}
              <label className="flex items-center gap-2 text-xs text-white/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isGiftWrapped}
                  onChange={(e) => setIsGiftWrapped(e.target.checked)}
                  className="accent-[#C5A059]"
                  id="cart-gift-wrap-checkbox"
                />
                <span>Complimentary Luxury Velvet Box & Wax Seal Packaging</span>
              </label>

              {/* Promo Code Entry */}
              <div className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-white/40 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Promo Code (e.g. TREDNY10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-sm pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#C5A059] uppercase"
                      id="cart-promo-input"
                    />
                  </div>
                  <button
                    onClick={handleApplyPromo}
                    className="px-3 py-1.5 rounded-sm bg-[#1A1A1A] hover:bg-[#262626] text-xs text-[#C5A059] border border-white/10 transition cursor-pointer"
                    id="cart-apply-promo-btn"
                  >
                    Apply
                  </button>
                </div>

                {promoError && <p className="text-[10px] text-red-400">{promoError}</p>}
                {promoSuccess && <p className="text-[10px] text-green-400">{promoSuccess}</p>}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-1.5 text-xs text-[#a3a3a3] pt-2 border-t border-[#222222]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(rawSubtotal, currency)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount ({discountPercent * 100}%)</span>
                    <span>-{formatPrice(discountAmount, currency)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Armored Insured Shipping</span>
                  <span className="text-[#d4af37]">COMPLIMENTARY</span>
                </div>

                <div className="flex justify-between text-sm font-semibold text-[#f8f6f0] pt-2 border-t border-[#222222]">
                  <span>Total Amount</span>
                  <span>{formatPrice(finalSubtotal, currency)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    const msg = buildCartWhatsAppMessage(cartItems, formatPrice(finalSubtotal, currency));
                    openWhatsAppChat('7338447753', msg);
                  }}
                  className="w-full py-2.5 px-4 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-md border border-emerald-400/40"
                  id="cart-whatsapp-order-btn"
                >
                  <MessageCircle className="w-4 h-4 fill-current text-white" />
                  <span>Direct Order via WhatsApp (7338447753)</span>
                </button>

                <button
                  onClick={() => {
                    onProceedToCheckout(discountAmount, isGiftWrapped);
                  }}
                  className="w-full py-3 px-6 rounded bg-[#d4af37] hover:bg-[#c29f2e] text-black font-semibold text-xs uppercase tracking-[0.2em] transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  id="cart-checkout-btn"
                >
                  <span>Proceed To Secure Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#888888]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>256-Bit SSL Encrypted & Insured Checkout</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
