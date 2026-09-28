// Display labels for categories and statuses are in the i18n dictionaries.
export const CATEGORIES = ["city", "mountain", "folding", "cargo", "road"] as const;
export type Category = (typeof CATEGORIES)[number];

export interface ProductSpecs {
  motorWatts: number;
  batteryWh: number;
  rangeKm: number;
  topSpeedKmh: number;
  weightKg: number;
}

export interface Product {
  id: string;
  slug: string;
  /** Arabic name (the store's main language). */
  name: string;
  /** Optional English name, shown when browsing in English. */
  nameEn: string | null;
  brand: string;
  category: Category;
  price: number;
  compareAtPrice: number | null;
  description: string;
  descriptionEn: string | null;
  imageUrl: string | null;
  accentColor: string;
  specs: ProductSpecs;
  stock: number;
  featured: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductInput = Omit<Product, "id" | "createdAt" | "updatedAt">;

export const ORDER_STATUSES = ["new", "contacted", "completed", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderItem {
  productId: string;
  slug: string;
  name: string;
  nameEn: string | null;
  price: number;
  qty: number;
}

export interface Customer {
  name: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
}

export interface Order {
  id: string;
  number: string;
  items: OrderItem[];
  total: number;
  customer: Customer;
  status: OrderStatus;
  createdAt: Date;
}
