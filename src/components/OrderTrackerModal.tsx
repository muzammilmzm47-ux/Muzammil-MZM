import React, { useState } from 'react';
import { X, Truck, Search, ShieldCheck, CheckCircle2, Clock, Package } from 'lucide-react';
import { Order } from '../types';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  orders,
}) => {
  if (!isOpen) return null;

  const [searchId, setSearchId] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = orders.find(
      (o) => o.id.toLowerCase() === searchId.trim().toLowerCase() || o.trackingNumber.toLowerCase() === searchId.trim().toLowerCase()
    );
    if (found) {
      setSelectedOrder(found);
    } else {
      alert(`No active armored dispatch found for reference "${searchId}".`);
    }
  };

  const steps = [
    { title: 'Order Placed', desc: 'Encrypted order confirmed & funds verified' },
    { title: 'Insured Quality Audit', desc: 'Gemologist inspection & micro-setting security check' },
    { title: 'Armored Transit', desc: 'In transit via Brink’s Armored Express Security' },
    { title: 'Signature Delivered', desc: 'In-person adult signature required upon delivery' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative bg-[#121212] border border-[#2a2a2a] rounded-xl max-w-xl w-full text-[#f8f6f0] p-6 sm:p-8 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#888888] hover:text-white transition cursor-pointer"
          id="tracker-close-btn"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-[#C5A059] serif uppercase tracking-[0.2em] text-[10px] mb-1">
          <Truck className="w-4 h-4 text-[#F1D592]" />
          <span>Armored Transport Logistics</span>
        </div>

        <h2 className="text-xl serif text-white mb-4">
          Live Order & Tracking Search
        </h2>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-white/40 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Enter Order Reference (e.g., TRD-9X2K8L or ARM-10293)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5A059]"
              id="tracker-search-input"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-sm bg-gold-gradient text-black font-semibold text-xs uppercase tracking-wider cursor-pointer hover:brightness-110"
            id="tracker-search-btn"
          >
            Track
          </button>
        </form>

        {/* Display Order Status Timeline */}
        {selectedOrder ? (
          <div className="bg-[#121212] border border-gold rounded-sm p-5 space-y-5 text-xs">
            
            <div className="flex justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] text-white/40 uppercase block">Order ID</span>
                <span className="text-sm font-semibold serif text-[#C5A059]">{selectedOrder.id}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-white/40 uppercase block">Courier Tracking</span>
                <span className="text-xs font-mono text-white">{selectedOrder.trackingNumber}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4 pt-2">
              {steps.map((stepItem, index) => {
                const isCurrent = index === 1; // Simulated active stage: Quality Audit / Transit
                const isDone = index === 0;

                return (
                  <div key={index} className="flex items-start gap-3 relative">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border ${
                      isDone
                        ? 'bg-emerald-900/40 border-emerald-500 text-emerald-400'
                        : isCurrent
                        ? 'bg-[#C5A059]/20 border-[#C5A059] text-[#C5A059] animate-pulse'
                        : 'bg-[#1A1A1A] border-white/10 text-white/30'
                    }`}>
                      {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    </div>

                    <div>
                      <p className={`serif text-xs ${isCurrent || isDone ? 'text-white font-medium' : 'text-white/40'}`}>
                        {stepItem.title}
                      </p>
                      <p className="text-[10px] text-white/50">{stepItem.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-[#14120c] p-3 rounded-sm border border-gold text-[11px] text-white/60">
              <span className="text-[#C5A059] font-semibold block">Estimated Arrival Window:</span>
              <span>{selectedOrder.estimatedDelivery}</span>
            </div>

          </div>
        ) : (
          <div className="text-center py-8 text-xs text-white/40 bg-[#121212] rounded-sm border border-white/10 p-4">
            <Package className="w-8 h-8 text-[#C5A059] mx-auto mb-2 opacity-50" />
            <p>No order selected. Enter an order code above to inspect live armored transit status.</p>
          </div>
        )}

      </div>
    </div>
  );
};
