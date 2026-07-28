import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, Sparkles, Menu, X, Globe, ShieldCheck, Truck, SlidersHorizontal, MoreVertical, Lock } from 'lucide-react';
import { CurrencyConfig } from '../types';
import { CURRENCY_MAP } from '../data/products';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  activeTab: 'shop' | 'dressing-room' | 'admin';
  setActiveTab: (tab: 'shop' | 'dressing-room' | 'admin') => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenOrderTracker: () => void;
  onOpenCareGuide: () => void;
  currency: CurrencyConfig;
  setCurrency: (currency: CurrencyConfig) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: 'all' | 'jewelry' | 'fashions';
  setCategoryFilter: (cat: 'all' | 'jewelry' | 'fashions') => void;
  announcementText?: string;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  activeTab,
  setActiveTab,
  onOpenCart,
  onOpenWishlist,
  onOpenOrderTracker,
  onOpenCareGuide,
  currency,
  setCurrency,
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  announcementText = 'All Kerala & Karnataka delivery available | Phone: 7338447753',
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isThreeDotsOpen, setIsThreeDotsOpen] = useState(false);

  return (
    <>
      {/* Top Delivery & Contact Bar */}
      <div className="bg-[#121212] text-[#C5A059] text-xs py-2 px-4 border-b border-white/5 font-serif tracking-widest flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#d4af37]">
          <Truck className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
          <span className="text-[11px] font-sans tracking-wide">All Kerala & Karnataka delivery available</span>
          <span className="hidden sm:inline text-white/30">|</span>
          <a href="tel:7338447753" className="text-[11px] font-mono text-white hover:text-[#d4af37] transition underline">
            Phone: 7338447753
          </a>
        </div>

        <div className="hidden md:flex items-center gap-4 text-white/50">
          <button 
            onClick={onOpenOrderTracker}
            className="hover:text-white transition flex items-center gap-1 cursor-pointer"
            id="header-track-order-btn"
          >
            <Truck className="w-3 h-3 text-[#C5A059]" />
            Track Order
          </button>
          <span>|</span>
          <button 
            onClick={onOpenCareGuide}
            className="hover:text-white transition cursor-pointer"
            id="header-care-guide-btn"
          >
            Jewelry & Fabric Care
          </button>
        </div>
      </div>

      {/* Main Header Container */}
      <header className="sticky top-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/5 text-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Left Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 text-[11px] uppercase tracking-[0.2em] font-medium text-white/60">
            <button
              onClick={() => {
                setActiveTab('shop');
                setCategoryFilter('all');
              }}
              className={`hover:text-[#C5A059] transition pb-1 cursor-pointer ${
                activeTab === 'shop' && categoryFilter === 'all'
                  ? 'text-[#C5A059] border-b border-[#C5A059] font-semibold'
                  : ''
              }`}
              id="nav-shop-all-btn"
            >
              Collection
            </button>
            <button
              onClick={() => {
                setActiveTab('shop');
                setCategoryFilter('jewelry');
              }}
              className={`hover:text-[#C5A059] transition pb-1 cursor-pointer ${
                activeTab === 'shop' && categoryFilter === 'jewelry'
                  ? 'text-[#C5A059] border-b border-[#C5A059] font-semibold'
                  : ''
              }`}
              id="nav-fine-jewelry-btn"
            >
              Jewelry
            </button>
            <button
              onClick={() => {
                setActiveTab('shop');
                setCategoryFilter('fashions');
              }}
              className={`hover:text-[#C5A059] transition pb-1 cursor-pointer ${
                activeTab === 'shop' && categoryFilter === 'fashions'
                  ? 'text-[#C5A059] border-b border-[#C5A059] font-semibold'
                  : ''
              }`}
              id="nav-fashions-btn"
            >
              Fashions
            </button>
          </nav>

          {/* Center Brand Logo - Fixed whitespace-nowrap */}
          <div className="flex-1 md:flex-none text-center flex justify-center">
            <button
              onClick={() => {
                setActiveTab('shop');
                setCategoryFilter('all');
              }}
              className="inline-flex flex-col items-center justify-center hover:opacity-90 transition cursor-pointer select-none px-2"
              id="brand-logo-btn"
            >
              <span className="text-xl sm:text-2xl md:text-3xl font-serif tracking-[0.35em] text-white font-semibold uppercase whitespace-nowrap">
                TREDNY
              </span>
              <span className="block text-[8px] sm:text-[9px] font-sans tracking-[0.4em] text-[#d4af37]/80 font-light mt-0.5 whitespace-nowrap">
                JEWELRY & FASHIONS
              </span>
            </button>
          </div>

          {/* Right Action Icons & Trendy Search */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Inline Desktop TREDNY Search Box */}
            <div className="relative hidden md:flex items-center">
              <input
                type="text"
                placeholder="Search TREDNY..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-36 lg:w-48 xl:w-56 bg-[#161616] border border-[#333333] focus:border-[#d4af37] text-xs text-white rounded-full py-1.5 pl-8 pr-7 focus:outline-none transition-all placeholder:text-white/40"
                id="header-inline-search-input"
              />
              <Search className="w-3.5 h-3.5 text-[#d4af37] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-white/50 hover:text-white px-1 cursor-pointer"
                  id="header-inline-clear-search-btn"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Mobile/Toggle Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-[#d4d4d4] hover:text-[#d4af37] transition cursor-pointer flex items-center gap-1.5 rounded-md hover:bg-white/5"
              title="Search TREDNY Catalog"
              id="header-search-toggle-btn"
            >
              <Search className="w-5 h-5 text-[#d4af37]" />
              <span className="hidden sm:inline md:hidden text-xs tracking-wider uppercase font-medium text-white/80">
                Search TREDNY
              </span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-[#d4d4d4] hover:text-[#d4af37] transition cursor-pointer"
              title="Wishlist"
              id="header-wishlist-btn"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#d4af37] text-black font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-[#d4d4d4] hover:text-[#d4af37] transition cursor-pointer flex items-center gap-1"
              title="Shopping Bag"
              id="header-cart-btn"
            >
              <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
              <span className="hidden sm:inline text-xs tracking-wider uppercase font-medium">
                Bag
              </span>
              {cartCount > 0 && (
                <span className="bg-[#d4af37] text-black font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* 3-Dot Options Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsThreeDotsOpen(!isThreeDotsOpen)}
                className={`p-2 rounded transition cursor-pointer flex items-center justify-center ${
                  isThreeDotsOpen
                    ? 'text-[#F1D592] bg-[#1a1a1a] ring-1 ring-[#C5A059]'
                    : 'text-[#d4d4d4] hover:text-[#d4af37]'
                }`}
                title="More Options"
                id="header-three-dots-btn"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {isThreeDotsOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-[#121212] border border-gold rounded-lg shadow-2xl py-2 z-50 text-xs text-[#E5E5E5] divide-y divide-white/10"
                  onMouseLeave={() => setIsThreeDotsOpen(false)}
                >
                  <div className="p-1">
                    <button
                      onClick={() => {
                        setActiveTab('admin');
                        setIsThreeDotsOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded hover:bg-[#1f1b11] text-[#F1D592] font-semibold text-left transition cursor-pointer"
                      id="three-dots-admin-btn"
                    >
                      <Lock className="w-4 h-4 text-[#C5A059]" />
                      <div className="flex-1">
                        <span className="block text-xs">Admin Portal</span>
                        <span className="block text-[9px] text-white/50 font-normal">Password Protected Gateway</span>
                      </div>
                    </button>
                  </div>

                  <div className="p-1 space-y-0.5">
                    <button
                      onClick={() => {
                        setActiveTab('dressing-room');
                        setIsThreeDotsOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded hover:bg-white/5 text-left transition cursor-pointer"
                      id="three-dots-studio-btn"
                    >
                      <Sparkles className="w-4 h-4 text-[#C5A059]" />
                      <span>Virtual Dressing Studio</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenOrderTracker();
                        setIsThreeDotsOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded hover:bg-white/5 text-left transition cursor-pointer"
                      id="three-dots-track-btn"
                    >
                      <Truck className="w-4 h-4 text-[#C5A059]" />
                      <span>Track Armored Shipment</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenCareGuide();
                        setIsThreeDotsOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded hover:bg-white/5 text-left transition cursor-pointer"
                      id="three-dots-care-btn"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                      <span>Jewelry & Fabric Care</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[#d4d4d4] hover:text-white transition cursor-pointer"
              id="mobile-menu-toggle-btn"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>

        {/* Expandable Search Input Bar */}
        {isSearchOpen && (
          <div className="bg-[#141414] border-t border-b border-[#282828] py-3 px-4 transition-all">
            <div className="max-w-3xl mx-auto flex items-center bg-[#0a0a0a] border border-[#333333] rounded-md px-3 py-2">
              <Search className="w-4 h-4 text-[#d4af37] mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search TREDNY Jewelry, Fashions, Gold, Silk, Diamonds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-[#f8f6f0] focus:outline-none placeholder-[#666666]"
                autoFocus
                id="header-search-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-[#888888] hover:text-white px-2 cursor-pointer shrink-0"
                  id="header-clear-search-btn"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#111111] border-b border-[#222222] px-4 py-6 space-y-4">
            <button
              onClick={() => {
                setActiveTab('admin');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between py-3 px-4 rounded border border-gold bg-[#1A1810] text-[#F1D592] font-semibold text-xs uppercase tracking-widest cursor-pointer"
              id="mobile-nav-admin-top-btn"
            >
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#C5A059]" />
                <span>Admin Portal</span>
              </div>
              <span className="text-[10px] text-[#C5A059] border border-gold/40 px-1.5 py-0.5 rounded">Protected</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('shop');
                setCategoryFilter('all');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-sm uppercase tracking-widest text-[#f8f6f0] hover:text-[#d4af37]"
              id="mobile-nav-all-btn"
            >
              Explore Full Collection
            </button>
            <button
              onClick={() => {
                setActiveTab('shop');
                setCategoryFilter('jewelry');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-sm uppercase tracking-widest text-[#f8f6f0] hover:text-[#d4af37]"
              id="mobile-nav-jewelry-btn"
            >
              Jewelry
            </button>
            <button
              onClick={() => {
                setActiveTab('shop');
                setCategoryFilter('fashions');
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left text-sm uppercase tracking-widest text-[#f8f6f0] hover:text-[#d4af37]"
              id="mobile-nav-fashions-btn"
            >
              Fashions
            </button>
            <button
              onClick={() => {
                setActiveTab('dressing-room');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-widest cursor-pointer"
              id="mobile-nav-dressing-btn"
            >
              <Sparkles className="w-4 h-4" />
              Open Virtual Dressing Studio
            </button>

            <div className="pt-4 border-t border-[#222222] flex justify-between items-center text-xs text-[#a3a3a3]">
              <button onClick={() => { onOpenOrderTracker(); setIsMobileMenuOpen(false); }} className="hover:text-white cursor-pointer" id="mobile-track-order-btn">
                Track Order
              </button>
              <button onClick={() => { onOpenCareGuide(); setIsMobileMenuOpen(false); }} className="hover:text-white cursor-pointer" id="mobile-care-guide-btn">
                Jewelry Care
              </button>
              <button onClick={() => { setActiveTab('admin'); setIsMobileMenuOpen(false); }} className="text-[#C5A059] hover:underline font-semibold cursor-pointer" id="mobile-admin-bottom-btn">
                Admin
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
