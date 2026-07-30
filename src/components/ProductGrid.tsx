import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, X, Search, RotateCcw, Gem, Shirt } from 'lucide-react';
import { Product, CurrencyConfig, FilterState } from '../types';
import { ProductCard } from './ProductCard';
import { formatPrice } from '../utils/format';

interface ProductGridProps {
  products: Product[];
  currency: CurrencyConfig;
  categoryFilter: 'all' | 'jewelry' | 'fashions';
  setCategoryFilter: (cat: 'all' | 'jewelry' | 'fashions') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
  onQuickAdd: (product: Product, size: string, color: string) => void;
  onBuyNow?: (product: Product, size?: string, color?: string) => void;
  onOpenDetail: (product: Product) => void;
  onOpenInDressingRoom: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  currency,
  categoryFilter,
  setCategoryFilter,
  searchQuery,
  setSearchQuery,
  wishlistIds,
  onToggleWishlist,
  onQuickAdd,
  onBuyNow,
  onOpenDetail,
  onOpenInDressingRoom,
}) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);

  // Extract all unique subcategories and materials
  const allSubcategories = useMemo(() => {
    const list = products
      .filter((p) => categoryFilter === 'all' || p.category === categoryFilter)
      .map((p) => p.subcategory);
    return Array.from(new Set(list));
  }, [products, categoryFilter]);

  const allMaterials = useMemo(() => {
    const materials = products.flatMap((p) => p.materials);
    return Array.from(new Set(materials));
  }, [products]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category check
        if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
        // Subcategory check
        if (selectedSubcategory !== 'all' && p.subcategory !== selectedSubcategory) return false;
        // Material check
        if (selectedMaterial !== 'all' && !p.materials.includes(selectedMaterial)) return false;
        // Price check
        if (p.price > priceRange) return false;
        // Search query
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchTagline = p.tagline.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchMat = p.materials.some((m) => m.toLowerCase().includes(q));
          if (!matchName && !matchTagline && !matchDesc && !matchMat) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, categoryFilter, selectedSubcategory, selectedMaterial, priceRange, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedSubcategory('all');
    setSelectedMaterial('all');
    setPriceRange(10000);
    setSearchQuery('');
    setCategoryFilter('all');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-24 lg:py-32 text-[#f8f6f0]">
      
      {/* Category Tabs & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-white/10">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 text-xs font-fashion uppercase tracking-[0.35em] text-[#C5A059]">
            <Gem className="w-4 h-4 text-[#F1D592]" />
            <span>Curated Collection</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-fashion text-white mt-2 font-light tracking-wide">
            {categoryFilter === 'all'
              ? 'Fancy & Fashions Collection'
              : categoryFilter === 'jewelry'
              ? 'Fancy Collection'
              : 'Haute Fashions Collection'}
          </h2>
          <p className="text-xs sm:text-sm text-white/50 font-light pt-1">
            Showing {filteredProducts.length} of {products.length} luxury creations
          </p>
        </div>

        {/* Category Pills Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setCategoryFilter('all');
              setSelectedSubcategory('all');
            }}
            className={`px-6 py-3 rounded-sm text-xs uppercase tracking-[0.25em] transition cursor-pointer ${
              categoryFilter === 'all'
                ? 'bg-gold-gradient text-black font-semibold'
                : 'bg-[#121212] text-white/60 hover:text-white border border-white/10'
            }`}
            id="filter-category-all"
          >
            All Collections
          </button>
          <button
            onClick={() => {
              setCategoryFilter('jewelry');
              setSelectedSubcategory('all');
            }}
            className={`px-6 py-3 rounded-sm text-xs uppercase tracking-[0.25em] transition flex items-center gap-2 cursor-pointer ${
              categoryFilter === 'jewelry'
                ? 'bg-gold-gradient text-black font-semibold'
                : 'bg-[#121212] text-white/60 hover:text-white border border-white/10'
            }`}
            id="filter-category-jewelry"
          >
            <Gem className="w-4 h-4" />
            Fancy
          </button>
          <button
            onClick={() => {
              setCategoryFilter('fashions');
              setSelectedSubcategory('all');
            }}
            className={`px-6 py-3 rounded-sm text-xs uppercase tracking-[0.25em] transition flex items-center gap-2 cursor-pointer ${
              categoryFilter === 'fashions'
                ? 'bg-gold-gradient text-black font-semibold'
                : 'bg-[#121212] text-white/60 hover:text-white border border-white/10'
            }`}
            id="filter-category-fashions"
          >
            <Shirt className="w-4 h-4" />
            Fashions
          </button>
        </div>
      </div>

      {/* Control Bar: Sort, Search Pill, Filter Drawer Toggle */}
      <div className="py-8 flex flex-wrap items-center justify-between gap-6">
        
        {/* Left Filter Toggle & Active Count */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
            className="px-5 py-2.5 rounded bg-[#161616] border border-[#333333] hover:border-[#d4af37] text-xs text-[#f8f6f0] flex items-center gap-2.5 transition cursor-pointer tracking-wider"
            id="filter-sidebar-toggle-btn"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#d4af37]" />
            <span>Filter Criteria</span>
          </button>

          {(selectedSubcategory !== 'all' || selectedMaterial !== 'all' || searchQuery !== '') && (
            <button
              onClick={resetFilters}
              className="text-xs text-[#d4af37] hover:underline flex items-center gap-1.5 cursor-pointer tracking-wider"
              id="reset-filters-btn"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>

        {/* Right Sort Selector */}
        <div className="flex items-center gap-2 text-xs text-[#a3a3a3]">
          <span>Sort By:</span>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-[#161616] border border-[#2d2d2d] text-[#f8f6f0] rounded px-3 py-1.5 focus:outline-none focus:border-[#d4af37] cursor-pointer"
            id="sort-select"
          >
            <option value="featured">Featured / Editors Choice</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

      </div>

      {/* Collapsible Filter Bar */}
      {isFilterSidebarOpen && (
        <div className="mb-8 p-6 bg-[#121212] border border-[#282828] rounded-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
          
          {/* Subcategory Filter */}
          <div>
            <label className="block text-xs font-serif uppercase text-[#d4af37] tracking-wider mb-2">
              Subcategory
            </label>
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-[#333333] text-xs text-[#f8f6f0] rounded p-2 focus:outline-none focus:border-[#d4af37]"
              id="filter-subcategory-select"
            >
              <option value="all">All Subcategories</option>
              {allSubcategories.map((sub) => (
                <option key={sub} value={sub} className="capitalize">
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Material Filter */}
          <div>
            <label className="block text-xs font-serif uppercase text-[#d4af37] tracking-wider mb-2">
              Primary Material / Gemstone
            </label>
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-[#333333] text-xs text-[#f8f6f0] rounded p-2 focus:outline-none focus:border-[#d4af37]"
              id="filter-material-select"
            >
              <option value="all">All Materials & Gemstones</option>
              {allMaterials.map((mat) => (
                <option key={mat} value={mat}>
                  {mat}
                </option>
              ))}
            </select>
          </div>

          {/* Max Price Slider */}
          <div>
            <div className="flex justify-between items-center text-xs font-serif uppercase text-[#d4af37] tracking-wider mb-2">
              <span>Max Price</span>
              <span className="text-[#f8f6f0] font-sans">{formatPrice(priceRange, currency)}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="10000"
              step="500"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-[#d4af37] bg-[#222222] cursor-pointer"
              id="filter-price-slider"
            />
          </div>

          {/* Search Box */}
          <div>
            <label className="block text-xs font-serif uppercase text-[#d4af37] tracking-wider mb-2">
              Keyword Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Emerald, Silk, Diamond..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-[#333333] text-xs text-[#f8f6f0] rounded p-2 pr-8 focus:outline-none focus:border-[#d4af37]"
                id="filter-keyword-input"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2 text-[#888888] hover:text-white"
                  id="filter-clear-keyword-btn"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Product Grid Render */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currency={currency}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onQuickAdd={onQuickAdd}
              onOpenDetail={onOpenDetail}
              onOpenInDressingRoom={onOpenInDressingRoom}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#121212] border border-[#222222] rounded-lg p-8">
          <Search className="w-12 h-12 text-[#d4af37] mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-serif text-[#f8f6f0]">No matching luxury items found</h3>
          <p className="text-xs text-[#888888] mt-2 max-w-md mx-auto">
            We couldn't find any items matching your selected filter criteria. Try expanding your price range or resetting filters.
          </p>
          <button
            onClick={resetFilters}
            className="mt-6 px-6 py-2.5 rounded bg-[#d4af37] text-black font-semibold text-xs uppercase tracking-widest cursor-pointer"
            id="empty-reset-filters-btn"
          >
            Reset All Filters
          </button>
        </div>
      )}

    </section>
  );
};
