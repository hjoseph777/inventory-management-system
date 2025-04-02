export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
  price: number;
  supplier: string;
  sku: string;
  location: string;
  lastRestocked: string;
  minimumStock: number;
  image?: string;
}

export interface InventoryFilter {
  search: string;
  category: string;
  minQuantity?: number;
  maxQuantity?: number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'price' | 'quantity' | 'category';
  sortOrder?: 'asc' | 'desc';
}
