// Volume type for product variants
export interface Volume {
  volume: string; // e.g., "100ml", "250ml"
  price: number;
}

// Product type
export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  volumes: Volume[];
  categoryId: string;
  isLiked: boolean;
}

// Category type
export interface Category {
  id: string;
  name: string;
  slug: string;
}

// Product reference with recommended volume
export interface ProductReference {
  productId: string;
  recommendedVolumeIndex: number;
}

// Collection type
export interface Collection {
  id: string;
  name: string;
  description: string;
  productIds: ProductReference[];
}

// Cart item type
export interface CartItem {
  productId: string;
  volumeIndex: number;
  quantity: number;
}
