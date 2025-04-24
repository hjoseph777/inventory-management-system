import { InventoryItem, InventoryFilter } from '../../types/inventory';
import { ApiResponse } from '../../types/common';
import { isHostedOnGitHub } from '../../helpers/environmentHelpers';

// Hard-coded inventory data as fallback
// This is the same as your inventory-data.json without the complete details for brevity
const fallbackInventoryData: { items: InventoryItem[] } = {
  items: [
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
      lastRestocked: "2025-03-15T10:30:00Z",
      minimumStock: 5,
      image: "laptop-dell-xps13.jpg",
      status: "in-stock",
      lastUpdated: "2025-04-20T08:45:00Z"
    },
    {
      id: "INV002",
      name: "Office Chair",
      description: "Ergonomic office chair with lumbar support",
      category: "Furniture",
      quantity: 3,
      price: 179.99,
      supplier: "Office Solutions",
      sku: "CHAIR-ERGO-002",
      location: "Warehouse B, Section 5",
      lastRestocked: "2025-02-20T14:15:00Z",
      minimumStock: 8,
      image: "office-chair.jpg",
      status: "low-stock",
      lastUpdated: "2025-04-18T11:20:00Z"
    },
    {
      id: "INV003",
      name: "Wireless Mouse",
      description: "Bluetooth wireless mouse with 6-month battery life",
      category: "Electronics",
      quantity: 0,
      price: 24.99,
      supplier: "Logitech",
      sku: "LOGI-MOUSE-003",
      location: "Warehouse A, Shelf 3",
      lastRestocked: "2025-01-15T09:45:00Z",
      minimumStock: 15,
      image: "wireless-mouse.jpg",
      status: "out-of-stock",
      lastUpdated: "2025-04-15T14:30:00Z"
    },
    {
      id: "INV004",
      name: "Apple MacBook Pro",
      description: "Apple MacBook Pro with M3 chip, 16GB RAM, 512GB SSD",
      category: "Electronics",
      quantity: 8,
      price: 1999.99,
      supplier: "Apple",
      sku: "APPLE-MBP-004",
      location: "Warehouse A, Shelf 1",
      lastRestocked: "2025-03-25T08:30:00Z",
      minimumStock: 5,
      image: "macbook-pro.jpg",
      status: "in-stock",
      lastUpdated: "2025-04-22T09:15:00Z"
    },
    {
      id: "INV005",
      name: "Desk Lamp",
      description: "LED desk lamp with adjustable brightness and color temperature",
      category: "Office Supplies",
      quantity: 42,
      price: 49.99,
      supplier: "Office Depot",
      sku: "LAMP-LED-005",
      location: "Warehouse B, Section 1",
      lastRestocked: "2025-02-10T13:20:00Z",
      minimumStock: 10,
      image: "desk-lamp.jpg",
      status: "in-stock",
      lastUpdated: "2025-04-10T16:45:00Z"
    },
    {
      id: "INV006",
      name: "Whiteboard Markers",
      description: "Pack of 10 assorted color whiteboard markers",
      category: "Office Supplies",
      quantity: 5,
      price: 12.99,
      supplier: "Office Depot",
      sku: "MARK-WHT-006",
      location: "Warehouse B, Section 3",
      lastRestocked: "2025-01-05T10:15:00Z",
      minimumStock: 8,
      image: "markers.jpg",
      status: "low-stock",
      lastUpdated: "2025-04-05T13:10:00Z"
    },
    {
      id: "INV007",
      name: "Wireless Keyboard",
      description: "Ergonomic wireless keyboard with numeric keypad",
      category: "Electronics",
      quantity: 12,
      price: 59.99,
      supplier: "Logitech",
      sku: "LOGI-KEYB-007",
      location: "Warehouse A, Shelf 3",
      lastRestocked: "2025-03-05T11:45:00Z",
      minimumStock: 10,
      image: "wireless-keyboard.jpg",
      status: "in-stock",
      lastUpdated: "2025-04-15T10:30:00Z"
    },
    {
      id: "INV008",
      name: "Monitor Stand",
      description: "Adjustable height monitor stand with cable management",
      category: "Office Supplies",
      quantity: 20,
      price: 34.99,
      supplier: "Office Solutions",
      sku: "STAND-MON-008",
      location: "Warehouse B, Section 2",
      lastRestocked: "2025-02-25T15:30:00Z",
      minimumStock: 5,
      image: "monitor-stand.jpg",
      status: "in-stock",
      lastUpdated: "2025-04-12T11:20:00Z"
    },
    {
      id: "INV009",
      name: "Work Boots",
      description: "Steel toe work boots, size 10",
      category: "Apparel",
      quantity: 0,
      price: 89.99,
      supplier: "SafetyFirst",
      sku: "BOOT-STL-009",
      location: "Warehouse C, Shelf 5",
      lastRestocked: "2024-12-10T09:00:00Z",
      minimumStock: 6,
      image: "work-boots.jpg",
      status: "out-of-stock",
      lastUpdated: "2025-04-08T15:40:00Z"
    },
    {
      id: "INV010",
      name: "Power Drill",
      description: "Cordless power drill with 2 batteries, 18V",
      category: "Tools",
      quantity: 7,
      price: 129.99,
      supplier: "DeWalt",
      sku: "DRILL-18V-010",
      location: "Warehouse C, Shelf 2",
      lastRestocked: "2025-02-15T16:20:00Z",
      minimumStock: 5,
      image: "power-drill.jpg",
      status: "in-stock",
      lastUpdated: "2025-04-20T14:15:00Z"
    }
  ]
};

// Storage keys
const STORAGE_KEY = 'inventoryData';
const LAST_UPDATED_KEY = 'inventoryLastUpdated';

// Helper function to save data to localStorage
const saveInventoryData = (data: any) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); // Ensure data is stringified
};

// Helper function to load data from localStorage
const loadInventoryData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null; // Parse only if data exists
};

// Helper function to get data from localStorage or fallback to embedded data
const getStoredInventoryData = (): { items: InventoryItem[] } => {
  try {
    const storedData = loadInventoryData();
    if (storedData && storedData.items && Array.isArray(storedData.items)) {
      console.log(`[DEBUG] getStoredInventoryData: Using localStorage data with ${storedData.items.length} items`);
      console.log('[DEBUG] getStoredInventoryData: Item IDs from localStorage:', 
        storedData.items.map((item: InventoryItem) => item.id).join(', '));
      return storedData;
    }
  } catch (error) {
    console.error('[DEBUG] getStoredInventoryData: Error reading from localStorage:', error);
  }
  
  console.log('[DEBUG] getStoredInventoryData: Using fallback inventory data');
  console.log('[DEBUG] getStoredInventoryData: Fallback item IDs:', 
    fallbackInventoryData.items.map(item => item.id).join(', '));
  return fallbackInventoryData;
};

// For demo purposes, we'll first try to load from JSON file
// If that fails, use our embedded data or localStorage
export const fetchInventoryItems = async (): Promise<InventoryItem[]> => {
  try {
    const storedData = loadInventoryData();
    if (storedData && storedData.items && Array.isArray(storedData.items)) {
      console.log(`[DEBUG] fetchInventoryItems: Using localStorage data with ${storedData.items.length} items`);
      const categorySet = new Set(storedData.items.map((item: InventoryItem) => item.category));
      console.log(
        '[DEBUG] fetchInventoryItems: Item categories from localStorage:',
        Array.from(categorySet).join(', ')
      ); // Fixed missing semicolon
      return storedData.items; // Ensure this line is properly placed
    }

    // Try to load from JSON file if localStorage doesn't have data
    console.log('[DEBUG] fetchInventoryItems: Attempting to load from JSON file');
    const response = await fetch('/data/inventory-data.json');
    
    if (response.ok) {
      const data = await response.json();
      console.log(`[DEBUG] fetchInventoryItems: Successfully loaded data from JSON file with ${data.items?.length || 0} items`);
      console.log('[DEBUG] fetchInventoryItems: Item IDs from JSON file:', 
        data.items?.map((item: InventoryItem) => item.id).join(', '));
      console.log('[DEBUG] fetchInventoryItems: Item categories from JSON file:', 
        Array.from(
          new Set(data.items?.map((item: InventoryItem) => item.category) || [])
        ).join(', '));
      
      if (data && data.items && Array.isArray(data.items)) {
        // Save to localStorage for future use
        saveInventoryData(data);
        return data.items;
      }
    } else {
      console.log(`[DEBUG] fetchInventoryItems: Failed to load from JSON file. Status: ${response.status}`);
    }
  } catch (fetchError) {
    console.log('[DEBUG] fetchInventoryItems: Error loading from JSON file:', fetchError);
  }

  // If we get here, the JSON file couldn't be loaded - use our embedded data
  console.log('[DEBUG] fetchInventoryItems: Using embedded inventory data as fallback');
  console.log(
    '[DEBUG] fetchInventoryItems: Item categories from fallback:',
    Array.from(new Set(fallbackInventoryData.items.map(item => item.category))).join(', ')
  ); // Add the missing closing parenthesis here
  
  // Store embedded data in localStorage for future CRUD operations
  saveInventoryData(fallbackInventoryData);
  
  // Return the embedded items data
  return fallbackInventoryData.items;
};

export const fetchInventoryItem = async (id: string): Promise<InventoryItem | null> => {
  const items = await fetchInventoryItems();
  return items.find(item => item.id === id) || null;
};

export const createInventoryItem = async (item: Omit<InventoryItem, 'id'>): Promise<InventoryItem> => {
  // Get current inventory data
  const currentData = getStoredInventoryData();
  
  // Generate a unique ID (simple implementation)
  const maxId = currentData.items
    .map(i => parseInt(i.id.replace('INV', ''), 10))
    .reduce((max, id) => Math.max(max, id), 0);
  
  const newId = `INV${(maxId + 1).toString().padStart(3, '0')}`;
  
  // Create the new item
  const newItem: InventoryItem = {
    ...item,
    id: newId
  };
  
  // Add to items array
  currentData.items.push(newItem);
  
  // Save updated data
  saveInventoryData(currentData);
  
  console.log(`[DEBUG] Created new item with ID: ${newId}`);
  return newItem;
};

export const updateInventoryItem = async (id: string, updatedItem: Partial<InventoryItem>): Promise<InventoryItem | null> => {
  try {
    console.log(`[DEBUG] Updating inventory item with ID: ${id}`, updatedItem);
    
    // Get current inventory data
    const currentData = await loadInventoryData();
    if (!currentData || !currentData.items) {
      console.error('[ERROR] No inventory data available for update');
      return null;
    }
    
    // Find the item index by ID
    const itemIndex = currentData.items.findIndex(item => item.id === id);
    
    // If item doesn't exist, return null
    if (itemIndex === -1) {
      console.log(`[DEBUG] Item with ID ${id} not found for update`);
      return null;
    }
    
    // Create updated item by merging existing item with updates
    // Important: We're preserving the original ID to prevent duplication
    const updatedItemWithId = {
      ...currentData.items[itemIndex],
      ...updatedItem,
      id: id, // Ensure ID remains the same
      lastUpdated: new Date().toISOString()
    };
    
    // Replace the existing item with the updated one
    currentData.items[itemIndex] = updatedItemWithId;
    
    // Save updated data
    saveInventoryData(currentData);
    
    console.log(`[DEBUG] Successfully updated item with ID: ${id}`);
    return updatedItemWithId;
  } catch (error) {
    console.error('[ERROR] Failed to update inventory item:', error);
    return null;
  }
};

export const deleteInventoryItem = async (id: string): Promise<boolean> => {
  // Get current inventory data
  const currentData = getStoredInventoryData();
  
  // Find the item index
  const itemIndex = currentData.items.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    console.log(`[DEBUG] Item with ID ${id} not found for deletion`);
    return false;
  }
  
  // Remove from array
  currentData.items.splice(itemIndex, 1);
  
  // Save updated data
  saveInventoryData(currentData);
  
  console.log(`[DEBUG] Deleted item with ID: ${id}`);
  return true;
};

export const searchInventoryItems = async (filter: InventoryFilter): Promise<InventoryItem[]> => {
  const items = await fetchInventoryItems();
  
  return items.filter(item => {
    // Filter by search term if provided
    if (filter.search && filter.search !== '') {
      const searchLower = filter.search.toLowerCase();
      const nameMatch = item.name.toLowerCase().includes(searchLower);
      const descMatch = item.description.toLowerCase().includes(searchLower);
      const skuMatch = item.sku.toLowerCase().includes(searchLower);
      if (!(nameMatch || descMatch || skuMatch)) {
        return false;
      }
    }

    // Filter by category if provided
    if (filter.category && filter.category !== '' && item.category !== filter.category) {
      return false;
    }
    
    // Filter by quantity range if provided
    if (filter.minQuantity !== undefined && item.quantity < filter.minQuantity) {
      return false;
    }
    if (filter.maxQuantity !== undefined && item.quantity > filter.maxQuantity) {
      return false;
    }
    
    // Filter by price range if provided
    if (filter.minPrice !== undefined && item.price < filter.minPrice) {
      return false;
    }
    if (filter.maxPrice !== undefined && item.price > filter.maxPrice) {
      return false;
    }
    
    // If all filters passed, include this item
    return true;
  });
};

// Reset to original data (useful for demos)
export const resetInventoryData = async (): Promise<InventoryItem[]> => {
  console.log('[DEBUG] Resetting inventory data to original state');
  saveInventoryData(fallbackInventoryData);
  return fallbackInventoryData.items;
};
