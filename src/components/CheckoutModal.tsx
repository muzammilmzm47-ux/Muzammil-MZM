import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, Check, Truck, Lock, ArrowRight, Download, PackageCheck, Award, MessageCircle, Phone } from 'lucide-react';
import { CartItem, CurrencyConfig, ShippingAddress, Order } from '../types';
import { formatPrice, generateOrderId, generateTrackingNumber } from '../utils/format';
import { openWhatsAppChat, buildCartWhatsAppMessage } from '../utils/whatsapp';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currency: CurrencyConfig;
  discountAmount: number;
  isGiftWrapped: boolean;
  onOrderCompleted: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  currency,
  discountAmount,
  isGiftWrapped,
  onOrderCompleted,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '7338447753',
    addressLine1: '',
    addressLine2: '',
    city: 'Kochi',
    state: 'Kerala',
    postalCode: '682001',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState<'pay_online' | 'cod'>('pay_online');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const rawSubtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const giftFee = isGiftWrapped ? 25 : 0;
  const taxAmount = (rawSubtotal - discountAmount) * 0.05; // 5% GST tax
  const grandTotalUSD = rawSubtotal - discountAmount + giftFee + taxAmount;

  // Pre-fill Demo Address helper for instant user convenience
  const handleFillDemoAddress = () => {
    setAddress({
      fullName: 'Muzammil Shammas',
      email: 'muzammil@trendy.in',
      phone: '7338447753',
      addressLine1: 'M.G. Road, Near Marine Drive',
      addressLine2: 'Eranakulam',
      city: 'Kochi',
      state: 'Kerala',
      postalCode: '682001',
      country: 'India',
    });
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const newOrder: Order = {
        id: generateOrderId(),
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        items: [...cartItems],
        subtotal: rawSubtotal,
        discount: discountAmount,
        shippingFee: 0,
        tax: taxAmount,
        total: grandTotalUSD,
        currency: currency.code,
        shippingAddress: address,
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Pay While Order (UPI / Card / NetBanking)',
        status: paymentMethod === 'cod' ? 'COD - Pending Dispatch' : 'Paid - Processing',
        trackingNumber: generateTrackingNumber(),
        estimatedDelivery: '2-4 Days (All Kerala & Karnataka Express Delivery)',
      };

      setCompletedOrder(newOrder);
      onOrderCompleted(newOrder);
      setIsProcessing(false);
      setStep(3);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative bg-[#121212] border border-[#2a2a2a] rounded-xl max-w-3xl w-full text-[#f8f6f0] overflow-hidden shadow-2xl my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#0A0A0A]">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#C5A059]" />
            <h2 className="text-sm serif uppercase tracking-[0.3em] text-white">
              TREDNY Encrypted Checkout
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/40 hover:text-white transition cursor-pointer"
            id="checkout-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Stepper */}
        {step !== 3 && (
          <div className="bg-[#121212] border-b border-white/5 px-6 py-3 flex items-center justify-between text-xs serif uppercase tracking-[0.2em]">
            <div className={`flex items-center gap-2 ${step === 1 ? 'text-[#C5A059]' : 'text-white/40'}`}>
              <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">1</span>
              <span>Shipping & Recipient</span>
            </div>
            <span className="text-white/20">/</span>
            <div className={`flex items-center gap-2 ${step === 2 ? 'text-[#C5A059]' : 'text-white/40'}`}>
              <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">2</span>
              <span>Payment & Order</span>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-8">
          
          {/* STEP 1: Shipping Address Form */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-serif uppercase text-[#d4af37] tracking-wider">
                  Insured Armored Delivery Address
                </h3>

                <button
                  onClick={handleFillDemoAddress}
                  className="text-xs text-[#d4af37] hover:underline cursor-pointer"
                  id="checkout-demo-address-btn"
                >
                  ⚡ Auto-fill Demo Address
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-[#a3a3a3] uppercase mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full bg-[#181818] border border-[#333333] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#d4af37]"
                    placeholder="e.g. Alexander Vance"
                    id="address-fullname-input"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#a3a3a3] uppercase mb-1">Email Address (Order Confirmation)</label>
                  <input
                    type="email"
                    required
                    value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })}
                    className="w-full bg-[#181818] border border-[#333333] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#d4af37]"
                    placeholder="alexander@couture.com"
                    id="address-email-input"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-[#a3a3a3] uppercase mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={address.addressLine1}
                    onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                    className="w-full bg-[#181818] border border-[#333333] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#d4af37]"
                    placeholder="740 Park Avenue, Penthouse 12B"
                    id="address-line1-input"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#a3a3a3] uppercase mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full bg-[#181818] border border-[#333333] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#d4af37]"
                    placeholder="New York"
                    id="address-city-input"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#a3a3a3] uppercase mb-1">Postal / ZIP Code</label>
                  <input
                    type="text"
                    required
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    className="w-full bg-[#181818] border border-[#333333] rounded px-3 py-2 text-xs focus:outline-none focus:border-[#d4af37]"
                    placeholder="10021"
                    id="address-postal-input"
                  />
                </div>
              </div>

              {/* Continue Step 2 Button */}
              <button
                onClick={() => {
                  if (address.fullName && address.addressLine1) setStep(2);
                  else alert('Please fill in recipient name and address.');
                }}
                className="w-full py-3 rounded bg-[#d4af37] hover:bg-[#c29f2e] text-black font-semibold text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 cursor-pointer mt-6"
                id="checkout-step1-continue-btn"
              >
                <span>Continue To Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Payment Method & Review */}
          {step === 2 && (
            <div className="space-y-6">
              
              {/* Delivery Banner Note with Clickable WhatsApp Chat */}
              <div className="p-3 bg-[#181812] border border-[#d4af37]/40 rounded-lg text-xs text-[#e6c65c] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <span>Delivery Available across <strong>All Kerala & Karnataka</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => openWhatsAppChat('7338447753', `Hi TREDNY! I am filling my order details (${cartItems.length} items) and have a quick question.`)}
                  className="inline-flex items-center gap-1.5 font-mono text-emerald-400 text-[11px] bg-emerald-950/80 hover:bg-emerald-900 px-2.5 py-1 rounded border border-emerald-500/40 transition cursor-pointer"
                  title="Direct WhatsApp Chat"
                  id="checkout-delivery-whatsapp-btn"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>WhatsApp: 7338447753</span>
                </button>
              </div>

              {/* Payment Option Tabs */}
              <div className="space-y-3">
                <label className="block text-xs font-serif uppercase text-[#d4af37] tracking-wider">
                  Choose Payment Option
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Option 1: Pay While Order */}
                  <button
                    onClick={() => setPaymentMethod('pay_online')}
                    className={`p-4 rounded-lg border text-left transition flex flex-col justify-between gap-2 cursor-pointer ${
                      paymentMethod === 'pay_online' 
                        ? 'border-[#d4af37] bg-[#1d1a12] ring-1 ring-[#d4af37]' 
                        : 'border-[#2a2a2a] bg-[#161616] hover:border-white/20'
                    }`}
                    id="payment-method-pay-online"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-[#d4af37]" />
                        <span className="font-semibold text-sm text-white">Pay While Order</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 uppercase tracking-wider font-bold">Instant Order</span>
                    </div>
                    <p className="text-xs text-[#a3a3a3] font-light">
                      Pay instantly online using UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, or NetBanking.
                    </p>
                  </button>

                  {/* Option 2: Cash On Delivery */}
                  <button
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-lg border text-left transition flex flex-col justify-between gap-2 cursor-pointer ${
                      paymentMethod === 'cod' 
                        ? 'border-[#d4af37] bg-[#1d1a12] ring-1 ring-[#d4af37]' 
                        : 'border-[#2a2a2a] bg-[#161616] hover:border-white/20'
                    }`}
                    id="payment-method-cod"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <Truck className="w-5 h-5 text-emerald-400" />
                        <span className="font-semibold text-sm text-white">Cash on Delivery</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 uppercase tracking-wider font-bold">Pay at Doorstep</span>
                    </div>
                    <p className="text-xs text-[#a3a3a3] font-light">
                      Pay cash to courier partner when your delivery arrives anywhere in Kerala or Karnataka.
                    </p>
                  </button>
                </div>
              </div>

              {/* Online Pay Details Form */}
              {paymentMethod === 'pay_online' && (
                <div className="p-4 bg-[#181818] border border-[#282828] rounded-lg space-y-3">
                  <div className="text-xs text-[#d4af37] font-semibold flex items-center justify-between">
                    <span>Online Payment Options</span>
                    <span className="text-[10px] text-white/50">100% Encrypted & Safe</span>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] text-[#a3a3a3] uppercase mb-1">UPI ID or Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="e.g. 7338447753@upi or 4532 •••• •••• 8892"
                      className="w-full bg-[#0e0e0e] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                      id="card-number-input"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-[#a3a3a3] uppercase mb-1">Expiration (for Cards)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-[#0e0e0e] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                        id="card-expiry-input"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#a3a3a3] uppercase mb-1">CVV / Security Code</label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-[#0e0e0e] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                        id="card-cvc-input"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Cash On Delivery Confirmation Info Box */}
              {paymentMethod === 'cod' && (
                <div className="p-4 bg-[#121f17] border border-emerald-500/30 rounded-lg text-xs space-y-1 text-emerald-200">
                  <p className="font-semibold text-emerald-400">Cash on Delivery Selected</p>
                  <p className="text-[11px] text-white/70">
                    No upfront payment required! Our delivery partner will collect {formatPrice(grandTotalUSD, currency)} upon delivering your parcel to {address.fullName || 'your address'} ({address.city}, {address.state}).
                  </p>
                </div>
              )}

              {/* Final Summary Card */}
              <div className="p-4 bg-[#161616] border border-[#2a2a2a] rounded-lg space-y-2 text-xs">
                <div className="flex justify-between text-[#a3a3a3]">
                  <span>Items ({cartItems.length})</span>
                  <span>{formatPrice(rawSubtotal, currency)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount</span>
                    <span>-{formatPrice(discountAmount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#a3a3a3]">
                  <span>Insured Armored Express Courier</span>
                  <span className="text-[#d4af37]">Complimentary</span>
                </div>
                <div className="flex justify-between text-[#a3a3a3]">
                  <span>Estimated Tax (8%)</span>
                  <span>{formatPrice(taxAmount, currency)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-white pt-2 border-t border-[#262626]">
                  <span>Total Payable</span>
                  <span className="text-[#d4af37]">{formatPrice(grandTotalUSD, currency)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded border border-[#333] hover:border-white text-xs text-[#a3a3a3] transition cursor-pointer"
                  id="checkout-back-step1-btn"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const msg = buildCartWhatsAppMessage(cartItems, formatPrice(grandTotalUSD, currency), address.fullName, `${address.addressLine1}, ${address.city}, ${address.state}`);
                    openWhatsAppChat('7338447753', msg);
                  }}
                  className="py-3 px-4 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-lg border border-emerald-400/40"
                  id="checkout-whatsapp-direct-order-btn"
                >
                  <MessageCircle className="w-4 h-4 fill-current text-white" />
                  <span>Direct Order via WhatsApp</span>
                </button>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="flex-1 py-3 px-4 rounded bg-[#d4af37] hover:bg-[#c29f2e] text-black font-semibold text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                  id="checkout-place-order-btn"
                >
                  {isProcessing ? (
                    <span>Encrypting & Placing Order...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-black" />
                      <span>Place Order ({formatPrice(grandTotalUSD, currency)})</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: Order Confirmation Screen */}
          {step === 3 && completedOrder && (
            <div className="text-center space-y-6 py-4 animate-fadeIn">
              
              <div className="w-16 h-16 bg-[#1a1810] border-2 border-[#d4af37] rounded-full flex items-center justify-center mx-auto text-[#d4af37]">
                <PackageCheck className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-serif uppercase tracking-widest text-[#d4af37] block">
                  Order Successfully Confirmed
                </span>
                <h2 className="text-2xl font-serif text-[#f8f6f0] mt-1 font-normal">
                  Thank You, {completedOrder.shippingAddress.fullName}
                </h2>
                <p className="text-xs text-[#a3a3a3] font-light max-w-md mx-auto mt-1">
                  Your order receipt and GIA authenticity dossier have been dispatched to <span className="text-white">{completedOrder.shippingAddress.email}</span>.
                </p>
              </div>

              {/* Order Receipt Box */}
              <div className="p-6 bg-[#161616] border border-[#2a2a2a] rounded-xl text-left space-y-4 max-w-lg mx-auto text-xs">
                
                <div className="flex justify-between border-b border-[#262626] pb-3">
                  <div>
                    <span className="text-[10px] text-[#888888] uppercase block">Order Reference</span>
                    <span className="text-sm font-semibold font-serif text-[#d4af37]">{completedOrder.id}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-[#888888] uppercase block">Tracking Code</span>
                    <span className="text-xs font-mono text-white">{completedOrder.trackingNumber}</span>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="space-y-2">
                  <span className="text-[10px] text-[#888888] uppercase block">Purchased Items</span>
                  {completedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-xs">
                      <span className="line-clamp-1 text-[#d4d4d4]">
                        {item.quantity}x {item.product.name} ({item.selectedSize})
                      </span>
                      <span className="font-semibold text-white ml-2">
                        {formatPrice(item.product.price * item.quantity, currency)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#262626] flex justify-between items-center text-sm font-semibold text-white">
                  <span>Grand Total</span>
                  <span className="text-[#d4af37]">{formatPrice(completedOrder.total, currency)}</span>
                </div>

                {/* Estimated Delivery */}
                <div className="bg-[#1e1c14] p-3 rounded border border-[#d4af37]/30 flex items-center gap-3">
                  <Truck className="w-5 h-5 text-[#d4af37] shrink-0" />
                  <div>
                    <p className="text-white font-serif font-medium text-xs">Armored Transport Dispatch</p>
                    <p className="text-[10px] text-[#a3a3a3]">{completedOrder.estimatedDelivery}</p>
                  </div>
                </div>

              </div>

              {/* Download, WhatsApp & Close Button */}
              <div className="pt-4 flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => openWhatsAppChat('7338447753', `Hi TREDNY! Here is my confirmed order reference ${completedOrder.id}. Tracking code: ${completedOrder.trackingNumber}. Total: ${formatPrice(completedOrder.total, currency)}.`)}
                  className="px-5 py-2.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold border border-emerald-400/30 transition flex items-center gap-2 cursor-pointer shadow-lg"
                  id="checkout-confirm-whatsapp-btn"
                >
                  <MessageCircle className="w-4 h-4 fill-current text-white" />
                  <span>Send Order Ref to WhatsApp (7338447753)</span>
                </button>

                <button
                  onClick={() => alert(`Receipt PDF for ${completedOrder.id} downloaded.`)}
                  className="px-5 py-2.5 rounded bg-[#222222] hover:bg-[#333333] text-xs text-[#f8f6f0] border border-[#333] transition flex items-center gap-2 cursor-pointer"
                  id="checkout-download-receipt-btn"
                >
                  <Download className="w-4 h-4 text-[#d4af37]" />
                  <span>Download Digital Receipt</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-widest cursor-pointer"
                  id="checkout-done-btn"
                >
                  Return To Boutique
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
