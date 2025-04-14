import { InventoryItem } from '../../types/inventory';

export const fetchInventoryItems = async (): Promise<InventoryItem[]> => {
  const storedItems = localStorage.getItem('inventoryItems');
  if (storedItems) {
    return JSON.parse(storedItems);
  }
  
  try {
    const response = await fetch('/data/inventory-data.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    
    const data = await response.json();
    
    localStorage.setItem('inventoryItems', JSON.stringify(data.items));
    
    return data.items;
  } catch (error) {
    console.error('Error fetching inventory data:', error);
    return [];
  }
};

export const fetchInventoryItem = async (id: string): Promise<InventoryItem | null> => {
  const items = await fetchInventoryItems();
  const item = items.find(item => item.id === id);
  return item || null;
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

export const updateInventoryItem = async (
  id: string, 
  updates: Partial<InventoryItem>
): Promise<InventoryItem> => {
  const items = await fetchInventoryItems();
  const itemIndex = items.findIndex(item => item.id === id);
  
  if (itemIndex === -1) {
    throw new Error('Item not found');
  }
  
  const updatedItem = { ...items[itemIndex], ...updates };
  items[itemIndex] = updatedItem;
  
  localStorage.setItem('inventoryItems', JSON.stringify(items));
  
  return updatedItem;
};
