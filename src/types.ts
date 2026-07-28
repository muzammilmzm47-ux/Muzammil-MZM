export type ProductCategory = 'jewelry' | 'fashions';

export type JewelryType = 'ring' | 'necklace' | 'earrings' | 'bracelet' | 'watch';
export type ApparelType = 'gown' | 'blazer' | 'trench' | 'top' | 'trousers' | 'suit';

export interface DressingCoordinates {
  overlayType: 'necklace' | 'earring' | 'ring' | 'wrist' | 'outfit';
  defaultScale?: number;
  offsetY?: number;
  offsetX?: number;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  subcategory: JewelryType | ApparelType;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  primaryImage: string;
  hoverImage: string;
  description: string;
  materials: string[];
  colors: string[];
  sizes: string[];
  isNew?: boolean;
  isBestseller?: boolean;
  isFeatured?: boolean;
  specs: Record<string, string>;
  dressingCoordinates: DressingCoordinates;
}

export interface CartItem {
  id: string; // unique item id combining product.id + selected specs
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  selectedMetal?: string;
  engravingText?: string;
}

export interface FilterState {
  category: 'all' | 'jewelry' | 'fashions';
  subcategory: string;
  searchQuery: string;
  materials: string[];
  priceRange: [number, number];
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
  inStockOnly: boolean;
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY';

export interface CurrencyConfig {
  code: Currency;
  symbol: string;
  rate: number; // multiplier relative to USD
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  currency: Currency;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  status: 'Order Placed' | 'Insured Quality Audit' | 'Armored Transit' | 'Delivered';
  trackingNumber: string;
  estimatedDelivery: string;
}

export interface AvatarModel {
  id: string;
  name: string;
  skinTone: string;
  pose: string;
  image: string;
}

export interface AIStylingResponse {
  advice: string;
  styleConcept: string;
  recommendedJewelryId?: string;
  recommendedApparelId?: string;
  stylingTips?: string[];
}
