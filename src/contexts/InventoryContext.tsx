import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  fetchInventoryItems, 
  fetchInventoryItem,
  createInventoryItem, 
  updateInventoryItem, 
  deleteInventoryItem,
  searchInventoryItems,
  resetInventoryData
} from '../utils/api/inventory';
import { InventoryItem, InventoryFilter } from '../types/inventory';

interface InventoryContextType {
  items: InventoryItem[];
  loading: boolean;
  error: string | null;
  refreshInventory: () => Promise<void>;
  getItem: (id: string) => Promise<InventoryItem | null>;
  addItem: (item: Omit<InventoryItem, 'id'>) => Promise<InventoryItem>;
  updateItem: (id: string, updates: Partial<InventoryItem>) => Promise<InventoryItem | null>;
  deleteItem: (id: string) => Promise<boolean>;
  searchItems: (filter: InventoryFilter) => Promise<InventoryItem[]>;
  resetData: () => Promise<void>;
  lastUpdated: Date | null;
  dataSource: string;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

interface InventoryProviderProps {
  children: ReactNode;
}

export const InventoryProvider: React.FC<InventoryProviderProps> = ({ children }) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [dataSource, setDataSource] = useState<string>('Not loaded yet');

  const refreshInventory = async () => {
    try {
      console.log('[DEBUG] InventoryContext: Starting refreshInventory()');
      setLoading(true);
      setError(null);
      
      const fetchedItems = await fetchInventoryItems();
      console.log(`[DEBUG] InventoryContext: fetchInventoryItems returned ${fetchedItems.length} items`);
      console.log('[DEBUG] InventoryContext: Item IDs:', fetchedItems.map(item => item.id).join(', '));
      
      // Track data source
      const storedData = localStorage.getItem('inventoryData');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          if (parsedData && parsedData.items && 
              JSON.stringify(parsedData.items.map(i => i.id).sort()) === 
              JSON.stringify(fetchedItems.map(i => i.id).sort())) {
            setDataSource('localStorage');
            console.log('[DEBUG] InventoryContext: Data source identified as localStorage');
          } else {
            setDataSource('API or fallback data');
            console.log('[DEBUG] InventoryContext: Data source identified as API/fallback');
          }
        } catch (e) {
          setDataSource('Error determining source');
          console.error('[DEBUG] InventoryContext: Error determining data source:', e);
        }
      } else {
        setDataSource('API or fallback data (no localStorage)');
        console.log('[DEBUG] InventoryContext: Data source identified as API/fallback (no localStorage)');
      }
      
      setItems(fetchedItems);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('[DEBUG] InventoryContext: Error refreshing inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const getItem = async (id: string) => {
    return fetchInventoryItem(id);
  };

  const addItem = async (item: Omit<InventoryItem, 'id'>) => {
    const newItem = await createInventoryItem(item);
    await refreshInventory(); // Refresh the list after adding
    return newItem;
  };

  const updateItem = async (id: string, updates: Partial<InventoryItem>) => {
    const updatedItem = await updateInventoryItem(id, updates);
    await refreshInventory(); // Refresh the list after updating
    return updatedItem;
  };

  const deleteItem = async (id: string) => {
    const result = await deleteInventoryItem(id);
    await refreshInventory(); // Refresh the list after deleting
    return result;
  };

  const searchItems = async (filter: InventoryFilter) => {
    return searchInventoryItems(filter);
  };

  const resetData = async () => {
    await resetInventoryData();
    await refreshInventory();
  };

  useEffect(() => {
    console.log('[DEBUG] InventoryContext: Initial load effect triggered');
    refreshInventory();
  }, []);

  const value = {
    items,
    loading,
    error,
    refreshInventory,
    getItem,
    addItem,
    updateItem,
    deleteItem,
    searchItems,
    resetData,
    lastUpdated,
    dataSource
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};