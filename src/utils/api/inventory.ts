import { InventoryItem } from '../../types/inventory';

export const fetchInventoryItems = async (): Promise<InventoryItem[]> => {
  console.log('Fetching inventory items...');
  
  const storedItems = localStorage.getItem('inventoryItems');
  if (storedItems) {
    console.log('Retrieved items from localStorage');
    return JSON.parse(storedItems);
  }
  
  try {
    console.log('No items in localStorage, fetching from JSON file');
    const response = await fetch('/data/inventory-data.json');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Fetched data:', data);
    
    if (!data || !data.items || !Array.isArray(data.items)) {
      console.error('Invalid data structure in inventory-data.json');
      return [];
    }
    
    localStorage.setItem('inventoryItems', JSON.stringify(data.items));
    
    return data.items;
  } catch (error) {
    console.error('Error fetching inventory data:', error);
    
    const defaultItems: InventoryItem[] = [
      {
        id: "INV001",
        name: "Laptop Dell XPS 13",
        description: "High-end laptop with 16GB RAM and 512GB SSD",
        category: "Electronics",
        quantity: 15,
        price: 1299.99,
        supplier: "Dell Inc.",
        sku: "DELL-XPS13-001",
        location: "Warehouse A, Shelf 2",
        lastRestocked: "2023-06-15T10:30:00Z",
        minimumStock: 5,
        image: "laptop-dell-xps13.jpg"
      }
    ];
    
    localStorage.setItem('inventoryItems', JSON.stringify(defaultItems));
    return defaultItems;
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
  
  try {
    const currentItems = await fetchInventoryItems();
    
    const updatedItems = [...currentItems, newItem];
    
    localStorage.setItem('inventoryItems', JSON.stringify(updatedItems));
    console.log('Item created and saved to localStorage:', newItem);
    
    return newItem;
  } catch (error) {
    console.error('Error creating inventory item:', error);
    throw error;
  }
};

export const updateInventoryItem = async (
  id: string, 
  updates: Partial<InventoryItem>
): Promise<InventoryItem> => {
  try {
    const items = await fetchInventoryItems();
    const itemIndex = items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      throw new Error('Item not found');
    }
    
    const updatedItem = { ...items[itemIndex], ...updates };
    items[itemIndex] = updatedItem;
  
    localStorage.setItem('inventoryItems', JSON.stringify(items));
    
    return updatedItem;
  } catch (error) {
    console.error('Error updating inventory item:', error);
    throw error;
  }
};
