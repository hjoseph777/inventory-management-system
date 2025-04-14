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

export const fetchInventoryItems = async (): Promise<InventoryItem[]> => {
  const storedItems = localStorage.getItem('inventoryItems');
  if (storedItems) {
    return JSON.parse(storedItems);
  }
  
  const response = await fetch('/data/inventory-data.json');
  const data = await response.json();
  
  localStorage.setItem('inventoryItems', JSON.stringify(data.items));
  return data.items;
};

export const createInventoryItem = async (item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> => {
  const id = `INV${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  const newItem: InventoryItem = {
    id,
    ...item
  };
  
  const currentItems = await fetchInventoryItems();
  
  const updatedItems = [...currentItems, newItem];
  
  localStorage.setItem('inventoryItems', JSON.stringify(updatedItems));
  
  return newItem;
};
