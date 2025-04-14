import { InventoryItem, InventoryFilter } from '../../types/inventory';
import { ApiResponse } from '../../types/common';

// Function to get items from localStorage or fetch from JSON if not available
export const fetchInventoryItems = async (): Promise<InventoryItem[]> => {
  // Check if we have data in localStorage
  const storedItems = localStorage.getItem('inventoryItems');
  if (storedItems) {
    return JSON.parse(storedItems);
  }
  
  // If not, fetch from the JSON file (initial data)
  const response = await fetch('/data/inventory-data.json');
  const data = await response.json();
  
  // Store in localStorage for future use
  localStorage.setItem('inventoryItems', JSON.stringify(data.items));
  
  return data.items;
};

export const fetchInventoryItem = async (id: string): Promise<InventoryItem | null> => {
  const items = await fetchInventoryItems();
  const item = items.find(item => item.id === id);
  return item || null;
};

export const createInventoryItem = async (item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> => {
  // Generate a unique ID
  const id = `INV${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  
  // Create the new item
  const newItem: InventoryItem = {
    id,
    ...item
  };
  
  // Get current items
  const currentItems = await fetchInventoryItems();
  
  // Add new item
  const updatedItems = [...currentItems, newItem];
  
  // Save to localStorage
  localStorage.setItem('inventoryItems', JSON.stringify(updatedItems));
  
  return newItem;
};

export const updateInventoryItem = async (
  id: string, 
  updates: Partial<InventoryItem>
): Promise<InventoryItem> => {
  const items = await fetchInventoryItems();
  const itemIndex = items.findIndex(item => item.id === id);
  
  if (itemIndex === -1) {
    throw new Error('Item not found');
  }
  
  // Update the item
  const updatedItem = { ...items[itemIndex], ...updates };
  items[itemIndex] = updatedItem;
  
  // Save to localStorage
  localStorage.setItem('inventoryItems', JSON.stringify(items));
  
  return updatedItem;
};
