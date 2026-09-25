import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { ProductModal } from './components/ProductModal';
import { DressingStudio } from './components/DressingStudio';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { CareGuideModal } from './components/CareGuideModal';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';

import { PRODUCTS, CURRENCY_MAP, PROMO_CODES } from './data/products';
import { Product, CartItem, CurrencyConfig, Order } from './types';

// Default sample orders for initial showcase
const INITIAL_ORDERS: Order[] = [
  {
    id: 'TRD-882910',
    date: 'July 24, 2026',
    items: [
      {
        id: 'ev-jw-001-18 Inch Choker-Emerald Green / Gold',
        product: PRODUCTS[0],
        quantity: 1,
        selectedSize: '18 Inch Choker',
        selectedColor: 'Emerald Green / Gold',
        engravingText: 'TREDNY 2026',
      },
    ],
    subtotal: 4850,
    discount: 485,
    shippingFee: 0,
    tax: 349.2,
    total: 4714.2,
    currency: 'USD',
    shippingAddress: {
      fullName: 'Duchess Victoria Vance',
      email: 'victoria.vance@beverlyhills.com',
      phone: '+1 (310) 882-9901',
      addressLine1: '9400 Wilshire Boulevard',
      city: 'Beverly Hills',
      state: 'CA',
      postalCode: '90212',
      country: 'United States',
    },
    paymentMethod: 'Amex Black Centurion',
    status: 'Armored Transit',
    trackingNumber: 'BRINKS-TRD-991823',
    estimatedDelivery: 'July 27, 2026',
  },
  {
    id: 'TRD-773821',
    date: 'July 22, 2026',
    items: [
      {
        id: 'ev-ap-101-M-Midnight Velvet',
        product: PRODUCTS[2],
        quantity: 1,
        selectedSize: 'M',
        selectedColor: 'Midnight Velvet',
      },
    ],
    subtotal: 2400,
    discount: 0,
    shippingFee: 0,
    tax: 192,
    total: 2592,
    currency: 'USD',
    shippingAddress: {
      fullName: 'Sienna Sterling',
      email: 'sienna@luxuryjournal.com',
      phone: '+1 (212) 901-4455',
      addressLine1: '740 Park Avenue',
      city: 'New York',
      state: 'NY',
      postalCode: '10021',
      country: 'United States',
    },
    paymentMethod: 'Apple Pay Platinum',
    status: 'Insured Quality Audit',
    trackingNumber: 'BRINKS-TRD-441209',
    estimatedDelivery: 'July 28, 2026',
  },
];

const INITIAL_SUBSCRIBERS = [
  'victoria.vance@beverlyhills.com',
  'sienna@luxuryjournal.com',
  'curator@voguegala.com',
  'vip.atelier@tredny.com',
];

export default function App() {
  // Main Tab Navigation
  const [activeTab, setActiveTab] = useState<'shop' | 'dressing-room' | 'admin'>('shop');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'jewelry' | 'fashions'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currency, setCurrency] = useState<CurrencyConfig>(CURRENCY_MAP.INR);

  // Dynamic Catalog State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('tredny_products');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        return parsed.map((p: any) => ({ ...p, category: p.category === 'apparel' ? 'fashions' : p.category }));
      } catch (e) { return PRODUCTS; }
    }
    return PRODUCTS;
  });

  // Dynamic Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('tredny_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_ORDERS; }
    }
    return INITIAL_ORDERS;
  });

  // Dynamic Promo Codes State
  const [promoCodes, setPromoCodes] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('tredny_promos');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return PROMO_CODES; }
    }
    return PROMO_CODES;
  });

  // Dynamic Subscribers State
  const [subscribers, setSubscribers] = useState<string[]>(() => {
    const saved = localStorage.getItem('tredny_subscribers');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_SUBSCRIBERS; }
    }
    return INITIAL_SUBSCRIBERS;
  });

  // In-Memory Admin Credentials State (NEVER saved to localStorage or any device)
  const [adminCreds, setAdminCreds] = useState<{ email: string; pass: string }>({
    email: 'admin@tredny.com',
    pass: 'muzammilshammas313',
  });

  // Zero-Storage Device Security: Proactively purge any residual admin tokens/creds from storage
  useEffect(() => {
    try {
      localStorage.removeItem('tredny_admin_creds');
      localStorage.removeItem('tredny_admin_session');
      localStorage.removeItem('tredny_admin_auth');
      sessionStorage.removeItem('tredny_admin_session');
      sessionStorage.removeItem('tredny_admin_auth');
    } catch (e) {
      // Storage access gracefully handled
    }
  }, []);

  // In-Memory Admin Authentication State (Resets to false on page refresh/exit)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Dynamic Store Banner Announcement State
  const [announcementText, setAnnouncementText] = useState<string>(() => {
    return localStorage.getItem('tredny_announcement') || 'All Kerala & Karnataka delivery available | Phone: 7338447753';
  });

  // Cart & Wishlist State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('tredny_cart') || localStorage.getItem('enmik_venm_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    // Initial welcome sample item
    return [
      {
        id: 'ev-jw-001-18 Inch Choker-Emerald Green / Gold',
        product: PRODUCTS[0],
        quantity: 1,
        selectedSize: '18 Inch Choker',
        selectedColor: 'Emerald Green / Gold',
      },
    ];
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('tredny_wishlist') || localStorage.getItem('enmik_venm_wishlist');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [PRODUCTS[1].id]; // Pre-wishlist a ring
  });

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isCareGuideOpen, setIsCareGuideOpen] = useState(false);

  // Selected Detail Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dressingStudioProduct, setDressingStudioProduct] = useState<Product | null>(null);

  // Checkout State Pass-through
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isGiftWrapped, setIsGiftWrapped] = useState(true);

  // Persistence Effects (Cart, Wishlist, Catalog, Orders, Promos, Subscribers, Announcements ONLY)
  useEffect(() => {
    localStorage.setItem('tredny_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('tredny_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    localStorage.setItem('tredny_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('tredny_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('tredny_promos', JSON.stringify(promoCodes));
  }, [promoCodes]);

  useEffect(() => {
    localStorage.setItem('tredny_subscribers', JSON.stringify(subscribers));
  }, [subscribers]);

  useEffect(() => {
    localStorage.setItem('tredny_announcement', announcementText);
  }, [announcementText]);

  // Product Admin Handlers
  const handleAddProduct = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Order Admin Handlers
  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  // Promo Code Admin Handlers
  const handleAddPromoCode = (code: string, discount: number) => {
    setPromoCodes((prev) => ({ ...prev, [code]: discount }));
  };

  const handleDeletePromoCode = (code: string) => {
    setPromoCodes((prev) => {
      const copy = { ...prev };
      delete copy[code];
      return copy;
    });
  };

  // Subscriber Handler
  const handleAddSubscriber = (email: string) => {
    if (email && !subscribers.includes(email)) {
      setSubscribers((prev) => [email, ...prev]);
    }
  };

  // Wishlist Handlers
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  // Add to Bag Handler
  const handleAddToCart = (
    product: Product,
    size: string,
    color: string,
    quantity: number = 1,
    engravingText?: string
  ) => {
    const itemId = `${product.id}-${size}-${color}-${engravingText || ''}`;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          quantity,
          selectedSize: size,
          selectedColor: color,
          engravingText,
        },
      ];
    });

    setIsCartOpen(true);
  };

  // Quick Add from Card
  const handleQuickAdd = (product: Product, size: string, color: string) => {
    handleAddToCart(product, size || product.sizes[0] || 'Standard', color || product.colors[0] || 'Default', 1);
  };

  // Buy Now Handler
  const handleBuyNow = (product: Product, size?: string, color?: string) => {
    handleAddToCart(product, size || product.sizes[0] || 'Standard', color || product.colors[0] || 'Default', 1);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Update Cart Item Quantity
  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  // Remove Cart Item
  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Open Product in Dressing Room
  const handleOpenInDressingRoom = (product: Product) => {
    setDressingStudioProduct(product);
    setActiveTab('dressing-room');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add Full Ensemble from Dressing Studio
  const handleAddEnsembleToCart = (ensembleProducts: Product[]) => {
    ensembleProducts.forEach((prod) => {
      handleAddToCart(
        prod,
        prod.sizes[0] || 'Standard',
        prod.colors[0] || 'Default',
        1
      );
    });
  };

  // Wishlist Products List
  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E5E5E5] font-sans selection:bg-[#C5A059] selection:text-black">
      
      {/* Header */}
      <Header
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlistIds.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenOrderTracker={() => setIsTrackerOpen(true)}
        onOpenCareGuide={() => setIsCareGuideOpen(true)}
        onOpenSignIn={() => setIsAuthModalOpen(true)}
        isAdminAuthenticated={isAdminAuthenticated}
        currency={currency}
        setCurrency={setCurrency}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        announcementText={announcementText}
      />

      {/* Main Content Area */}
      <main>
        {activeTab === 'shop' && (
          <>
            {/* Hero Banner */}
            <Hero
              onExploreJewelry={() => {
                setCategoryFilter('jewelry');
                setActiveTab('shop');
              }}
              onExploreFashions={() => {
                setCategoryFilter('fashions');
                setActiveTab('shop');
              }}
              onOpenDressingStudio={() => setActiveTab('dressing-room')}
            />

            {/* Product Catalog Grid */}
            <ProductGrid
              products={products}
              currency={currency}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              onQuickAdd={handleQuickAdd}
              onBuyNow={handleBuyNow}
              onOpenDetail={(prod) => setSelectedProduct(prod)}
              onOpenInDressingRoom={handleOpenInDressingRoom}
            />
          </>
        )}

        {/* Virtual Dressing Studio Tab */}
        {activeTab === 'dressing-room' && (
          <DressingStudio
            products={products}
            currency={currency}
            initialProduct={dressingStudioProduct}
            onAddEnsembleToCart={handleAddEnsembleToCart}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}

        {/* Admin Management Panel Tab */}
        {activeTab === 'admin' && (
          <AdminPanel
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            promoCodes={promoCodes}
            onAddPromoCode={handleAddPromoCode}
            onDeletePromoCode={handleDeletePromoCode}
            subscribers={subscribers}
            onAddSubscriber={handleAddSubscriber}
            currency={currency.code}
            onCloseAdmin={() => {
              setIsAdminAuthenticated(false);
              setActiveTab('shop');
            }}
            onLogout={() => {
              setIsAdminAuthenticated(false);
              setActiveTab('shop');
            }}
            isAdminAuthenticated={isAdminAuthenticated}
            onAuthenticateSuccess={() => {
              setIsAdminAuthenticated(true);
              setActiveTab('admin');
            }}
            adminCreds={adminCreds}
            onUpdateAdminCreds={(email, pass) => setAdminCreds({ email, pass })}
            announcementText={announcementText}
            onUpdateAnnouncementText={(text) => setAnnouncementText(text)}
          />
        )}
      </main>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        currency={currency}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={(prod, sz, col, qty, eng) => {
          handleAddToCart(prod, sz, col, qty, eng);
          setSelectedProduct(null);
        }}
        onBuyNow={(prod, sz, col, eng) => {
          handleAddToCart(prod, sz || prod.sizes[0] || 'Standard', col || prod.colors[0] || 'Default', 1, eng);
          setSelectedProduct(null);
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onOpenInDressingRoom={(prod) => {
          setSelectedProduct(null);
          handleOpenInDressingRoom(prod);
        }}
        allProducts={products}
      />

      {/* Shopping Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        currency={currency}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={(discount, gift) => {
          setAppliedDiscount(discount);
          setIsGiftWrapped(gift);
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        currency={currency}
        onRemoveFromWishlist={handleToggleWishlist}
        onMoveToCart={(prod) => {
          handleAddToCart(prod, prod.sizes[0] || 'Standard', prod.colors[0] || 'Default', 1);
          handleToggleWishlist(prod);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        currency={currency}
        discountAmount={appliedDiscount}
        isGiftWrapped={isGiftWrapped}
        onOrderCompleted={(newOrder) => {
          setOrders((prev) => [newOrder, ...prev]);
          setCartItems([]);
        }}
      />

      {/* Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        orders={orders}
      />

      {/* Care Guide Modal */}
      <CareGuideModal
        isOpen={isCareGuideOpen}
        onClose={() => setIsCareGuideOpen(false)}
      />

      {/* Zero-Storage Private Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        adminCreds={adminCreds}
        isAdminAuthenticated={isAdminAuthenticated}
        onAdminLoginSuccess={() => {
          setIsAdminAuthenticated(true);
          setActiveTab('admin');
        }}
        onAdminLogout={() => {
          setIsAdminAuthenticated(false);
          setActiveTab('shop');
        }}
      />

      {/* Footer */}
      <Footer
        onOpenDressingStudio={() => setActiveTab('dressing-room')}
        onOpenOrderTracker={() => setIsTrackerOpen(true)}
        onOpenCareGuide={() => setIsCareGuideOpen(true)}
        onAddSubscriber={handleAddSubscriber}
      />

      {/* Floating WhatsApp Quick Order Widget */}
      <WhatsAppFloatingButton />

    </div>
  );
}

