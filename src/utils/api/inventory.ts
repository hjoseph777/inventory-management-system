import { InventoryItem, InventoryFilter } from '../../types/inventory';
import { ApiResponse } from '../../types/common';

// For demo purposes, we'll use local data
// In a real app, this would make API calls
export const fetchInventoryItems = async (): Promise<InventoryItem[]> => {
  // Simulate API call
  const response = await fetch('/data/inventory-data.json');
  const data = await response.json();
  return data.items;
};

export const fetchInventoryItem = async (id: string): Promise<InventoryItem | null> => {
  const items = await fetchInventoryItems();
  return items.find(item => item.id === id) || null;
};

export const createInventoryItem = async (item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> => {
  // In real app, would POST to API
  // For now, just return mock data with generated ID
  const newItem = {
    ...item,
    id: `INV${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
  };
  
  return newItem;
};

export const updateInventoryItem = async (id: string, item: Partial<InventoryItem>): Promise<InventoryItem> => {
  // In real app, would PUT/PATCH to API
  // For now, simulate update
  const existingItem = await fetchInventoryItem(id);
  
  if (!existingItem) {
    throw new Error('Item not found');
  }
  
  return {
    ...existingItem,
    ...item
  };
};
