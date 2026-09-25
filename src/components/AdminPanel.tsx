import React, { useState } from 'react';
import { 
  Plus, Trash2, Edit3, Save, X, Package, ShoppingBag, 
  DollarSign, Users, Tag, Check, RefreshCw, AlertCircle, 
  Search, ShieldCheck, Truck, ArrowUpRight, ChevronRight, Eye, Send,
  Lock, Key, LogOut, Settings, SlidersHorizontal, Globe
} from 'lucide-react';
import { Product, Order, Currency } from '../types';
import { formatPrice } from '../utils/format';

interface AdminPanelProps {
  products: Product[];
  onAddProduct: (newProduct: Product) => void;
  onUpdateProduct: (updatedProduct: Product) => void;
  onDeleteProduct: (id: string) => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  promoCodes: Record<string, number>;
  onAddPromoCode: (code: string, discount: number) => void;
  onDeletePromoCode: (code: string) => void;
  subscribers: string[];
  onAddSubscriber: (email: string) => void;
  currency: Currency;
  onCloseAdmin: () => void;
  adminCreds: { email: string; pass: string };
  onUpdateAdminCreds: (email: string, pass: string) => void;
  announcementText: string;
  onUpdateAnnouncementText: (text: string) => void;
  isAdminAuthenticated?: boolean;
  onLogout?: () => void;
  onAuthenticateSuccess?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  orders,
  onUpdateOrderStatus,
  promoCodes,
  onAddPromoCode,
  onDeletePromoCode,
  subscribers,
  currency,
  onCloseAdmin,
  adminCreds,
  onUpdateAdminCreds,
  announcementText,
  onUpdateAnnouncementText,
  isAdminAuthenticated,
  onLogout,
  onAuthenticateSuccess,
}) => {
  // In-Memory Authentication State
  const [localAuthenticated, setLocalAuthenticated] = useState(false);
  const isAuthenticated = isAdminAuthenticated !== undefined ? isAdminAuthenticated : localAuthenticated;
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'promos' | 'subscribers' | 'security'>('overview');
  
  // Search & Filter States
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // New Product Modal State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form State for Add/Edit Product
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    category: 'jewelry' as 'jewelry' | 'fashions',
    subcategory: 'necklace',
    price: 1200,
    primaryImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
    description: '',
    materials: '18K Yellow Gold, Diamond',
    colors: 'Gold, Emerald',
    sizes: 'Standard, Custom',
    isNew: true,
    isFeatured: false,
    stockCount: 12,
  });

  // Promo Code Form State
  const [newCodeName, setNewCodeName] = useState('');
  const [newCodeDiscount, setNewCodeDiscount] = useState('15');
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  // Broadcast Gazette State
  const [broadcastSubject, setBroadcastSubject] = useState('Exclusive Private Atelier Access');
  const [broadcastMessage, setBroadcastMessage] = useState('We are delighted to invite our VIP gazette members to preview our latest Haute Collection.');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Security & Password Change Form State
  const [editAdminEmail, setEditAdminEmail] = useState(adminCreds.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityMsg, setSecurityMsg] = useState<string | null>(null);
  const [securityErr, setSecurityErr] = useState<string | null>(null);

  // Store Banner Announcement State
  const [bannerNoticeInput, setBannerNoticeInput] = useState(announcementText);
  const [bannerNoticeMsg, setBannerNoticeMsg] = useState<string | null>(null);

  // Handle Admin Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      loginEmail.trim().toLowerCase() === adminCreds.email.toLowerCase() &&
      loginPass === adminCreds.pass
    ) {
      setLocalAuthenticated(true);
      if (onAuthenticateSuccess) onAuthenticateSuccess();
      setLoginEmail('');
      setLoginPass('');
      setLoginError(null);
    } else {
      setLoginError('Invalid administrator credentials. Access denied.');
    }
  };

  // Reset Credentials to Factory Default
  const handleResetCredsToDefault = () => {
    onUpdateAdminCreds('admin@tredny.com', 'muzammilshammas313');
    setLoginEmail('');
    setLoginPass('');
    setLoginError(null);
    setSecurityMsg('Admin credentials restored to initial default.');
  };

  // Handle Changing Password and Email Credentials
  const handleChangeCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityMsg(null);
    setSecurityErr(null);

    if (currentPassword !== adminCreds.pass) {
      setSecurityErr('Current password is incorrect.');
      return;
    }
    if (newPassword.length < 6) {
      setSecurityErr('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setSecurityErr('New password and confirmation do not match.');
      return;
    }

    onUpdateAdminCreds(editAdminEmail.trim(), newPassword);
    setSecurityMsg('✓ Admin credentials & password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Handle Store Announcement Banner Save
  const handleSaveBannerNotice = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAnnouncementText(bannerNoticeInput);
    setBannerNoticeMsg('✓ Header announcement banner updated live!');
    setTimeout(() => setBannerNoticeMsg(null), 3500);
  };

  // KPIs Calculations
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalItemsSold = orders.reduce((sum, order) => sum + order.items.reduce((iSum, i) => iSum + i.quantity, 0), 0);
  const inventoryValuation = products.reduce((sum, p) => sum + (p.price * 10), 0);

  // Authentication Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#E5E5E5] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#121212] border border-gold rounded-xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-[#1A1810] border border-gold rounded-full flex items-center justify-center mx-auto text-[#C5A059]">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl serif font-light text-white uppercase tracking-widest">
              Atelier Security
            </h2>
            <p className="text-xs text-[#C5A059] uppercase tracking-wider font-medium">
              Encrypted Admin Authentication Gateway
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-950/80 border border-red-500/40 text-red-200 text-xs rounded-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-white/60 text-[10px] uppercase tracking-wider mb-1">
                Admin Email Address
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Enter admin email"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                data-lpignore="true"
                data-1p-ignore="true"
                name="tredny_admin_email_field"
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm px-3 py-2.5 text-white focus:outline-none focus:border-[#C5A059]"
                required
                id="admin-login-email-input"
              />
            </div>

            <div>
              <label className="block text-white/60 text-[10px] uppercase tracking-wider mb-1">
                Security Password
              </label>
              <input
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="Enter admin password"
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                data-lpignore="true"
                data-1p-ignore="true"
                name="tredny_admin_pass_field"
                className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm px-3 py-2.5 text-white focus:outline-none focus:border-[#C5A059]"
                required
                id="admin-login-pass-input"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-sm bg-gold-gradient text-black font-semibold uppercase tracking-widest cursor-pointer hover:brightness-110 flex items-center justify-center gap-2 text-xs"
              id="admin-login-submit-btn"
            >
              <Key className="w-4 h-4" />
              <span>Authenticate & Enter Admin Panel</span>
            </button>
          </form>

          <div className="pt-4 border-t border-white/10 text-center space-y-3">
            <p className="text-[10px] text-white/40">
              Zero-Storage Active: Session will automatically close upon exiting. No credentials saved.
            </p>
            <div className="flex justify-between items-center text-xs">
              <button
                type="button"
                onClick={handleResetCredsToDefault}
                className="text-[10px] text-[#C5A059] hover:underline cursor-pointer"
              >
                Reset to Default Credentials
              </button>
              <button
                type="button"
                onClick={onCloseAdmin}
                className="text-[10px] text-white/60 hover:text-white cursor-pointer"
              >
                Exit to Storefront
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Product Editing Handlers
  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      tagline: '',
      category: 'jewelry',
      subcategory: 'necklace',
      price: 1500,
      primaryImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
      description: 'Handcrafted luxury piece sculpted from precious 18k solid gold and fine gems.',
      materials: '18K Yellow Gold, VS1 Diamond',
      colors: 'Yellow Gold',
      sizes: '16 Inch, 18 Inch',
      isNew: true,
      isFeatured: false,
      stockCount: 10,
    });
    setEditingProductId(null);
    setShowAddProductModal(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setFormData({
      name: product.name,
      tagline: product.tagline,
      category: product.category,
      subcategory: product.subcategory,
      price: product.price,
      primaryImage: product.primaryImage,
      description: product.description,
      materials: product.materials.join(', '),
      colors: product.colors.join(', '),
      sizes: product.sizes.join(', '),
      isNew: product.isNew || false,
      isFeatured: product.isFeatured || false,
      stockCount: 15,
    });
    setEditingProductId(product.id);
    setShowAddProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingProductId) {
      const existing = products.find((p) => p.id === editingProductId);
      if (existing) {
        const updated: Product = {
          ...existing,
          name: formData.name,
          tagline: formData.tagline,
          category: formData.category,
          subcategory: formData.subcategory as any,
          price: Number(formData.price),
          primaryImage: formData.primaryImage,
          hoverImage: formData.primaryImage,
          images: [formData.primaryImage],
          description: formData.description,
          materials: formData.materials.split(',').map((s) => s.trim()).filter(Boolean),
          colors: formData.colors.split(',').map((s) => s.trim()).filter(Boolean),
          sizes: formData.sizes.split(',').map((s) => s.trim()).filter(Boolean),
          isNew: formData.isNew,
          isFeatured: formData.isFeatured,
        };
        onUpdateProduct(updated);
      }
    } else {
      const newProduct: Product = {
        id: `trd-custom-${Date.now()}`,
        name: formData.name,
        tagline: formData.tagline || 'Custom Atelier Creation',
        category: formData.category,
        subcategory: formData.subcategory as any,
        price: Number(formData.price),
        rating: 5.0,
        reviewCount: 1,
        primaryImage: formData.primaryImage,
        hoverImage: formData.primaryImage,
        images: [formData.primaryImage],
        description: formData.description,
        materials: formData.materials.split(',').map((s) => s.trim()).filter(Boolean),
        colors: formData.colors.split(',').map((s) => s.trim()).filter(Boolean),
        sizes: formData.sizes.split(',').map((s) => s.trim()).filter(Boolean),
        isNew: formData.isNew,
        isFeatured: formData.isFeatured,
        specs: {
          'Origin': 'TREDNY Atelier Direct',
          'Certificate': 'GIA Digital Dossier Included',
        },
        dressingCoordinates: {
          overlayType: formData.category === 'jewelry' ? 'necklace' : 'outfit',
          defaultScale: 1.0,
          offsetY: 0,
          offsetX: 0,
        },
      };
      onAddProduct(newProduct);
    }
    setShowAddProductModal(false);
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = newCodeName.trim().toUpperCase();
    const discountNum = parseFloat(newCodeDiscount) / 100;
    if (!code || isNaN(discountNum) || discountNum <= 0 || discountNum >= 1) {
      setPromoMessage('Error: Enter valid code and percentage (e.g., 15 for 15%)');
      return;
    }
    onAddPromoCode(code, discountNum);
    setPromoMessage(`Promo code '${code}' (${newCodeDiscount}% OFF) created!`);
    setNewCodeName('');
    setTimeout(() => setPromoMessage(null), 4000);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 5000);
  };

  const filteredProducts = products.filter(
    (p) => p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(
    (o) => o.id.toLowerCase().includes(orderSearch.toLowerCase()) || o.shippingAddress.fullName.toLowerCase().includes(orderSearch.toLowerCase()) || o.trackingNumber.toLowerCase().includes(orderSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E5E5E5] pb-24">
      
      {/* Top Banner Header */}
      <div className="bg-[#121212] border-b border-white/10 px-4 sm:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] serif uppercase tracking-[0.3em] text-[#C5A059] mb-1">
              <ShieldCheck className="w-4 h-4 text-[#F1D592]" />
              <span>TREDNY Atelier Administration • Encrypted Control Panel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl serif font-light text-white">
              Boutique Store Manager
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setLocalAuthenticated(false);
                if (onLogout) onLogout();
                else onCloseAdmin();
              }}
              className="px-3 py-2 rounded-sm bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300 transition text-xs font-semibold uppercase tracking-wider cursor-pointer flex items-center gap-1.5"
              id="admin-logout-btn"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out & Lock</span>
            </button>
            <button
              onClick={() => {
                if (onLogout) onLogout();
                else onCloseAdmin();
              }}
              className="px-4 py-2 rounded-sm border border-gold text-[#F1D592] hover:bg-white hover:text-black transition text-xs font-semibold uppercase tracking-wider cursor-pointer"
              id="admin-exit-btn"
            >
              Exit to Storefront
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        
        {/* KPI Metrics Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-[#121212] border border-gold rounded-sm p-5 space-y-2">
            <div className="flex items-center justify-between text-[#C5A059]">
              <span className="text-[10px] uppercase tracking-[0.2em]">Gross Revenue</span>
              <DollarSign className="w-5 h-5" />
            </div>
            <p className="text-2xl font-semibold text-white serif">
              {formatPrice(totalRevenue, currency)}
            </p>
            <p className="text-[11px] text-white/40 font-light">
              From {orders.length} verified armored orders
            </p>
          </div>

          <div className="bg-[#121212] border border-gold rounded-sm p-5 space-y-2">
            <div className="flex items-center justify-between text-[#C5A059]">
              <span className="text-[10px] uppercase tracking-[0.2em]">Armored Dispatches</span>
              <Truck className="w-5 h-5" />
            </div>
            <p className="text-2xl font-semibold text-white serif">
              {orders.length} Orders
            </p>
            <p className="text-[11px] text-emerald-400 font-light flex items-center gap-1">
              <span>{orders.filter(o => o.status === 'Armored Transit').length} in transit</span>
            </p>
          </div>

          <div className="bg-[#121212] border border-gold rounded-sm p-5 space-y-2">
            <div className="flex items-center justify-between text-[#C5A059]">
              <span className="text-[10px] uppercase tracking-[0.2em]">Active Catalog</span>
              <Package className="w-5 h-5" />
            </div>
            <p className="text-2xl font-semibold text-white serif">
              {products.length} Creations
            </p>
            <p className="text-[11px] text-white/40 font-light">
              Est. Inventory: {formatPrice(inventoryValuation, currency)}
            </p>
          </div>

          <div className="bg-[#121212] border border-gold rounded-sm p-5 space-y-2">
            <div className="flex items-center justify-between text-[#C5A059]">
              <span className="text-[10px] uppercase tracking-[0.2em]">Gazette VIPs</span>
              <Users className="w-5 h-5" />
            </div>
            <p className="text-2xl font-semibold text-white serif">
              {subscribers.length} Members
            </p>
            <p className="text-[11px] text-white/40 font-light">
              Active Gazette Subscribers
            </p>
          </div>

        </div>

        {/* Tab Selection Bar */}
        <div className="flex items-center space-x-2 border-b border-white/10 pb-4 overflow-x-auto text-xs uppercase tracking-[0.2em]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-sm cursor-pointer transition ${
              activeTab === 'overview'
                ? 'bg-gold-gradient text-black font-semibold'
                : 'bg-[#121212] text-white/60 hover:text-white border border-white/5'
            }`}
            id="admin-tab-overview"
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-sm cursor-pointer transition flex items-center gap-2 ${
              activeTab === 'products'
                ? 'bg-gold-gradient text-black font-semibold'
                : 'bg-[#121212] text-white/60 hover:text-white border border-white/5'
            }`}
            id="admin-tab-products"
          >
            <Package className="w-4 h-4" />
            <span>Catalog ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-sm cursor-pointer transition flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-gold-gradient text-black font-semibold'
                : 'bg-[#121212] text-white/60 hover:text-white border border-white/5'
            }`}
            id="admin-tab-orders"
          >
            <Truck className="w-4 h-4" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('promos')}
            className={`px-4 py-2 rounded-sm cursor-pointer transition flex items-center gap-2 ${
              activeTab === 'promos'
                ? 'bg-gold-gradient text-black font-semibold'
                : 'bg-[#121212] text-white/60 hover:text-white border border-white/5'
            }`}
            id="admin-tab-promos"
          >
            <Tag className="w-4 h-4" />
            <span>Promos & Discounts</span>
          </button>

          <button
            onClick={() => setActiveTab('subscribers')}
            className={`px-4 py-2 rounded-sm cursor-pointer transition flex items-center gap-2 ${
              activeTab === 'subscribers'
                ? 'bg-gold-gradient text-black font-semibold'
                : 'bg-[#121212] text-white/60 hover:text-white border border-white/5'
            }`}
            id="admin-tab-subscribers"
          >
            <Users className="w-4 h-4" />
            <span>Gazette Broadcast</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-sm cursor-pointer transition flex items-center gap-2 ${
              activeTab === 'security'
                ? 'bg-gold-gradient text-black font-semibold'
                : 'bg-[#121212] text-white/60 hover:text-white border border-white/5'
            }`}
            id="admin-tab-security"
          >
            <Settings className="w-4 h-4" />
            <span>Security & Password</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW SUMMARY */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Recent Orders List */}
            <div className="bg-[#121212] border border-white/10 rounded-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-base serif text-white">Recent Armored Dispatches</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-[10px] uppercase tracking-wider text-[#C5A059] hover:underline"
                >
                  View All ({orders.length}) →
                </button>
              </div>

              <div className="space-y-3">
                {orders.slice(0, 4).map((order) => (
                  <div key={order.id} className="p-3 bg-[#1A1A1A] rounded-sm border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-white serif">{order.id}</span>
                      <p className="text-[11px] text-white/40">{order.shippingAddress.fullName} • {order.items.length} items</p>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-[#C5A059]">{formatPrice(order.total, currency)}</span>
                      <span className="block text-[9px] uppercase tracking-wider text-emerald-400">{order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions & Store Settings */}
            <div className="bg-[#121212] border border-white/10 rounded-sm p-6 space-y-4">
              <h3 className="text-base serif text-white border-b border-white/10 pb-3">
                Quick Atelier Actions
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleOpenAddModal}
                  className="p-4 bg-[#1A1A1A] hover:bg-[#222222] border border-gold rounded-sm text-left transition cursor-pointer"
                >
                  <Plus className="w-5 h-5 text-[#C5A059] mb-1" />
                  <span className="text-xs font-semibold text-white block">Add New Product</span>
                  <span className="text-[10px] text-white/40">Create high jewelry or apparel piece</span>
                </button>

                <button
                  onClick={() => setActiveTab('promos')}
                  className="p-4 bg-[#1A1A1A] hover:bg-[#222222] border border-gold rounded-sm text-left transition cursor-pointer"
                >
                  <Tag className="w-5 h-5 text-[#C5A059] mb-1" />
                  <span className="text-xs font-semibold text-white block">Manage Promo Codes</span>
                  <span className="text-[10px] text-white/40">Set up 10%, 20% or custom codes</span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className="p-4 bg-[#1A1A1A] hover:bg-[#222222] border border-gold rounded-sm text-left transition cursor-pointer"
                >
                  <Truck className="w-5 h-5 text-[#C5A059] mb-1" />
                  <span className="text-xs font-semibold text-white block">Track Armored Transit</span>
                  <span className="text-[10px] text-white/40">Update dispatch & delivery steps</span>
                </button>

                <button
                  onClick={() => setActiveTab('subscribers')}
                  className="p-4 bg-[#1A1A1A] hover:bg-[#222222] border border-gold rounded-sm text-left transition cursor-pointer"
                >
                  <Send className="w-5 h-5 text-[#C5A059] mb-1" />
                  <span className="text-xs font-semibold text-white block">Broadcast Gazette</span>
                  <span className="text-[10px] text-white/40">Reach {subscribers.length} VIP members</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: PRODUCTS CATALOG MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#121212] p-4 rounded-sm border border-white/10">
              <div className="relative flex-1 w-full sm:w-auto">
                <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search catalog by name or category..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                  id="admin-search-products"
                />
              </div>

              <button
                onClick={handleOpenAddModal}
                className="px-5 py-2 rounded-sm bg-gold-gradient text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer hover:brightness-110 shrink-0"
                id="admin-add-product-btn"
              >
                <Plus className="w-4 h-4" />
                <span>Add Creation</span>
              </button>
            </div>

            {/* Products Grid Table */}
            <div className="bg-[#121212] border border-white/10 rounded-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-white/80">
                  <thead className="bg-[#1A1A1A] text-[10px] uppercase tracking-[0.2em] text-[#C5A059] border-b border-white/10">
                    <tr>
                      <th className="p-4">Item</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Badges</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-white/5 transition">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={p.primaryImage}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 object-cover rounded-sm border border-white/10"
                          />
                          <div>
                            <p className="font-semibold text-white serif">{p.name}</p>
                            <p className="text-[10px] text-white/40 line-clamp-1">{p.tagline}</p>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="capitalize px-2 py-0.5 rounded-xs bg-[#1A1A1A] border border-white/10 text-[10px] text-white/70">
                            {p.category} • {p.subcategory}
                          </span>
                        </td>

                        <td className="p-4 font-semibold text-[#C5A059]">
                          {formatPrice(p.price, currency)}
                        </td>

                        <td className="p-4">
                          <div className="flex gap-1">
                            {p.isNew && (
                              <span className="px-1.5 py-0.5 rounded-xs bg-gold-gradient text-black text-[9px] font-bold">NEW</span>
                            )}
                            {p.isFeatured && (
                              <span className="px-1.5 py-0.5 rounded-xs bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 text-[9px]">FEATURED</span>
                            )}
                          </div>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditModal(p)}
                              className="p-1.5 rounded bg-[#1A1A1A] hover:bg-white hover:text-black transition text-white/70"
                              title="Edit item"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteProduct(p.id)}
                              className="p-1.5 rounded bg-[#1A1A1A] hover:bg-red-900/60 transition text-red-400"
                              title="Delete item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: ORDER DISPATCH MANAGER */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            <div className="bg-[#121212] p-4 rounded-sm border border-white/10 flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-white/40 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search orders by ID, Customer Name or Tracking..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <span className="text-xs text-white/40">
                Showing {filteredOrders.length} orders
              </span>
            </div>

            {/* Orders Table */}
            <div className="bg-[#121212] border border-white/10 rounded-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-white/80">
                  <thead className="bg-[#1A1A1A] text-[10px] uppercase tracking-[0.2em] text-[#C5A059] border-b border-white/10">
                    <tr>
                      <th className="p-4">Order ID & Date</th>
                      <th className="p-4">Recipient</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Tracking Code</th>
                      <th className="p-4">Armored Transit Status</th>
                      <th className="p-4 text-right">Inspect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-white/5 transition">
                        <td className="p-4 font-mono">
                          <span className="font-semibold text-white serif block">{order.id}</span>
                          <span className="text-[10px] text-white/40">{order.date}</span>
                        </td>

                        <td className="p-4">
                          <p className="font-medium text-white">{order.shippingAddress.fullName}</p>
                          <p className="text-[10px] text-white/40">{order.shippingAddress.city}, {order.shippingAddress.country}</p>
                        </td>

                        <td className="p-4 font-semibold text-[#C5A059]">
                          {formatPrice(order.total, currency)}
                        </td>

                        <td className="p-4 font-mono text-xs text-white/60">
                          {order.trackingNumber}
                        </td>

                        <td className="p-4">
                          <select
                            value={order.status}
                            onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                            className="bg-[#1A1A1A] border border-gold rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[#C5A059] cursor-pointer"
                          >
                            <option value="Order Placed">Order Placed</option>
                            <option value="Insured Quality Audit">Insured Quality Audit</option>
                            <option value="Armored Transit">Armored Transit</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>

                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 rounded bg-[#1A1A1A] hover:bg-[#262626] text-[#C5A059] transition"
                            title="View Order Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: PROMO CODES */}
        {activeTab === 'promos' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Create Promo Code Form */}
            <div className="bg-[#121212] border border-gold rounded-sm p-6 space-y-4">
              <h3 className="text-base serif text-white border-b border-white/10 pb-3">
                Create New Promo Code
              </h3>

              {promoMessage && (
                <div className="p-3 bg-[#1A1810] border border-gold text-[#F1D592] text-xs rounded-sm">
                  {promoMessage}
                </div>
              )}

              <form onSubmit={handleCreatePromo} className="space-y-4 text-xs">
                <div>
                  <label className="block text-white/60 text-[10px] uppercase tracking-wider mb-1">
                    Promo Code Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. TREDNY25 or VIPSUMMER"
                    value={newCodeName}
                    onChange={(e) => setNewCodeName(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm px-3 py-2 text-white focus:outline-none focus:border-[#C5A059] uppercase"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/60 text-[10px] uppercase tracking-wider mb-1">
                    Discount Percentage (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    placeholder="e.g. 20"
                    value={newCodeDiscount}
                    onChange={(e) => setNewCodeDiscount(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm px-3 py-2 text-white focus:outline-none focus:border-[#C5A059]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-sm bg-gold-gradient text-black font-semibold uppercase tracking-wider cursor-pointer hover:brightness-110"
                >
                  Activate Promo Code
                </button>
              </form>
            </div>

            {/* Existing Promo Codes List */}
            <div className="bg-[#121212] border border-white/10 rounded-sm p-6 space-y-4">
              <h3 className="text-base serif text-white border-b border-white/10 pb-3">
                Active Boutique Promo Codes
              </h3>

              <div className="space-y-2">
                {Object.entries(promoCodes).map(([code, discount]) => (
                  <div key={code} className="p-3 bg-[#1A1A1A] rounded-sm border border-white/5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#C5A059]" />
                      <span className="font-mono font-bold text-white">{code}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded-xs bg-[#121212] text-[#F1D592] border border-gold font-semibold">
                        {(Number(discount) * 100).toFixed(0)}% OFF
                      </span>
                      <button
                        onClick={() => onDeletePromoCode(code)}
                        className="text-white/40 hover:text-red-400 transition"
                        title="Delete code"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: GAZETTE VIP BROADCAST */}
        {activeTab === 'subscribers' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <div className="bg-[#121212] border border-white/10 rounded-sm p-6 space-y-4">
              <h3 className="text-base serif text-white border-b border-white/10 pb-3">
                Send Private Gazette Campaign
              </h3>

              {broadcastSent && (
                <div className="p-3 bg-emerald-950 border border-emerald-500 text-emerald-200 text-xs rounded-sm">
                  ✓ Gazette Campaign successfully broadcast to {subscribers.length} VIP members!
                </div>
              )}

              <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
                <div>
                  <label className="block text-white/60 text-[10px] uppercase tracking-wider mb-1">
                    Email Subject Line
                  </label>
                  <input
                    type="text"
                    value={broadcastSubject}
                    onChange={(e) => setBroadcastSubject(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm px-3 py-2 text-white focus:outline-none focus:border-[#C5A059]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/60 text-[10px] uppercase tracking-wider mb-1">
                    Gazette Message Body
                  </label>
                  <textarea
                    rows={4}
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-[#C5A059]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-sm bg-gold-gradient text-black font-semibold uppercase tracking-wider cursor-pointer hover:brightness-110 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Campaign Broadcast</span>
                </button>
              </form>
            </div>

            {/* Subscribers List */}
            <div className="bg-[#121212] border border-white/10 rounded-sm p-6 space-y-4">
              <h3 className="text-base serif text-white border-b border-white/10 pb-3">
                Subscribed VIP Email Addresses ({subscribers.length})
              </h3>

              <div className="space-y-2 max-h-80 overflow-y-auto">
                {subscribers.map((email, idx) => (
                  <div key={idx} className="p-3 bg-[#1A1A1A] rounded-sm border border-white/5 flex items-center justify-between text-xs">
                    <span className="text-white font-mono">{email}</span>
                    <span className="text-[10px] uppercase text-[#C5A059]">VIP Gazette Member</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 6: SECURITY & BOUTIQUE SETTINGS */}
        {activeTab === 'security' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Change Email & Password Form */}
            <div className="bg-[#121212] border border-gold rounded-sm p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <Key className="w-5 h-5 text-[#C5A059]" />
                <h3 className="text-base serif text-white">
                  Change Admin Email & Password
                </h3>
              </div>

              {securityMsg && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs rounded-sm font-medium">
                  {securityMsg}
                </div>
              )}
              {securityErr && (
                <div className="p-3 bg-red-950/80 border border-red-500/40 text-red-200 text-xs rounded-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{securityErr}</span>
                </div>
              )}

              <form onSubmit={handleChangeCredentials} className="space-y-4 text-xs">
                <div>
                  <label className="block text-white/60 text-[10px] uppercase tracking-wider mb-1">
                    Admin Email Address
                  </label>
                  <input
                    type="email"
                    value={editAdminEmail}
                    onChange={(e) => setEditAdminEmail(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm px-3 py-2 text-white focus:outline-none focus:border-[#C5A059]"
                    required
                    id="security-admin-email-input"
                  />
                </div>

                <div>
                  <label className="block text-white/60 text-[10px] uppercase tracking-wider mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter current password to authorize changes"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm px-3 py-2 text-white focus:outline-none focus:border-[#C5A059]"
                    required
                    id="security-current-pass-input"
                  />
                </div>

                <div>
                  <label className="block text-white/60 text-[10px] uppercase tracking-wider mb-1">
                    New Security Password
                  </label>
                  <input
                    type="password"
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm px-3 py-2 text-white focus:outline-none focus:border-[#C5A059]"
                    required
                    id="security-new-pass-input"
                  />
                </div>

                <div>
                  <label className="block text-white/60 text-[10px] uppercase tracking-wider mb-1">
                    Confirm New Security Password
                  </label>
                  <input
                    type="password"
                    placeholder="Re-type new security password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm px-3 py-2 text-white focus:outline-none focus:border-[#C5A059]"
                    required
                    id="security-confirm-pass-input"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-sm bg-gold-gradient text-black font-semibold uppercase tracking-wider cursor-pointer hover:brightness-110 flex items-center justify-center gap-2"
                  id="security-save-creds-btn"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Admin Credentials</span>
                </button>
              </form>
            </div>

            {/* Store Banner Announcement & Emergency Reset */}
            <div className="space-y-6">
              
              <div className="bg-[#121212] border border-white/10 rounded-sm p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <Globe className="w-5 h-5 text-[#C5A059]" />
                  <h3 className="text-base serif text-white">
                    Storefront Announcement Banner
                  </h3>
                </div>

                {bannerNoticeMsg && (
                  <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs rounded-sm font-medium">
                    {bannerNoticeMsg}
                  </div>
                )}

                <form onSubmit={handleSaveBannerNotice} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-white/60 text-[10px] uppercase tracking-wider mb-1">
                      Header Announcement Notice Text
                    </label>
                    <textarea
                      rows={3}
                      value={bannerNoticeInput}
                      onChange={(e) => setBannerNoticeInput(e.target.value)}
                      className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm p-3 text-white focus:outline-none focus:border-[#C5A059]"
                      required
                      id="security-banner-text-input"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-sm bg-[#1A1A1A] hover:bg-white hover:text-black border border-gold text-[#F1D592] font-semibold uppercase tracking-wider cursor-pointer transition flex items-center justify-center gap-2"
                    id="security-save-banner-btn"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Announcement Notice Live</span>
                  </button>
                </form>
              </div>

              <div className="bg-[#121212] border border-white/10 rounded-sm p-6 space-y-3 text-xs">
                <h4 className="text-white serif font-semibold border-b border-white/10 pb-2">
                  Emergency Credentials Reset
                </h4>
                <p className="text-white/60 text-[11px]">
                  Need to revert admin credentials back to initial defaults?
                </p>
                <button
                  type="button"
                  onClick={handleResetCredsToDefault}
                  className="px-4 py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 rounded-sm text-[11px] font-medium transition cursor-pointer"
                  id="security-reset-creds-btn"
                >
                  Restore Admin Credentials to Initial Default
                </button>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* MODAL: ADD / EDIT PRODUCT */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-[#121212] border border-gold rounded-xl max-w-lg w-full text-white p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg serif text-[#C5A059]">
                {editingProductId ? 'Edit Product Creation' : 'Add New Atelier Creation'}
              </h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-white/60 text-[10px] uppercase mb-1">Creation Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Celestial Diamond Pendant"
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm p-2 text-white focus:outline-none focus:border-[#C5A059]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/60 text-[10px] uppercase mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm p-2 text-white focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="jewelry">Jewelry</option>
                    <option value="fashions">Fashions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/60 text-[10px] uppercase mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm p-2 text-white focus:outline-none focus:border-[#C5A059]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/60 text-[10px] uppercase mb-1">Subcategory</label>
                <input
                  type="text"
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  placeholder="necklace, ring, gown, blazer, etc."
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm p-2 text-white focus:outline-none focus:border-[#C5A059]"
                  required
                />
              </div>

              <div>
                <label className="block text-white/60 text-[10px] uppercase mb-1">Primary Image URL</label>
                <input
                  type="text"
                  value={formData.primaryImage}
                  onChange={(e) => setFormData({ ...formData, primaryImage: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm p-2 text-white focus:outline-none focus:border-[#C5A059]"
                  required
                />
              </div>

              <div>
                <label className="block text-white/60 text-[10px] uppercase mb-1">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Short tagline string"
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm p-2 text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="block text-white/60 text-[10px] uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-white/10 rounded-sm p-2 text-white focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 rounded-sm border border-white/20 text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-sm bg-gold-gradient text-black font-semibold uppercase tracking-wider"
                >
                  Save Creation
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL: ORDER INSPECTION */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative bg-[#121212] border border-gold rounded-xl max-w-md w-full text-white p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] text-white/40 uppercase block">Order Reference</span>
                <span className="text-lg serif text-[#C5A059]">{selectedOrder.id}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#1A1A1A] p-3 rounded-sm border border-white/5 space-y-1">
                <span className="text-[10px] text-[#C5A059] uppercase block font-semibold">Recipient Shipping Address</span>
                <p className="font-medium text-white">{selectedOrder.shippingAddress.fullName}</p>
                <p className="text-white/60">{selectedOrder.shippingAddress.addressLine1}</p>
                <p className="text-white/60">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}</p>
                <p className="text-white/60">{selectedOrder.shippingAddress.country} • {selectedOrder.shippingAddress.email}</p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-white/40 uppercase block font-semibold">Purchased Atelier Items ({selectedOrder.items.length})</span>
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="p-2 bg-[#1A1A1A] rounded-sm flex items-center gap-3">
                    <img src={item.product.primaryImage} alt="" className="w-10 h-10 object-cover rounded-xs" />
                    <div className="flex-1">
                      <p className="font-serif text-white line-clamp-1">{item.product.name}</p>
                      <p className="text-[10px] text-white/40">Size: {item.selectedSize} | Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs text-[#C5A059]">{formatPrice(item.product.price * item.quantity, currency)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                <span className="text-xs text-white/60">Total Order Amount:</span>
                <span className="text-base font-semibold text-[#C5A059]">{formatPrice(selectedOrder.total, currency)}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-2 rounded-sm bg-gold-gradient text-black font-semibold text-xs uppercase tracking-wider"
              >
                Close Inspection
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
