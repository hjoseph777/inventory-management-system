import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { InventoryItem } from '../types/inventory';
import { useCategories } from './CategoryContext';
import { loadProducts, saveProductsToStorage, getProductsByCategory, resetProductData } from '../utils/api/products';

interface ProductContextType {
  products: InventoryItem[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  getProductById: (id: string) => InventoryItem | undefined;
  getProductsByCategory: (categoryId: string) => InventoryItem[];
  lastUpdated: Date | null;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const { categories } = useCategories();
  const [products, setProducts] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refreshProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchedProducts = loadProducts(categories);
      setProducts(fetchedProducts);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error refreshing products:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  const getProductsByCategoryId = (categoryId: string) => {
    return getProductsByCategory(categoryId, products);
  };

  const resetData = async () => {
    try {
      const resetProducts = resetProductData(categories);
      setProducts(resetProducts);
      setLastUpdated(new Date());
      return resetProducts;
    } catch (error) {
      console.error('Error resetting product data:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (categories.length > 0) {
      refreshProducts();
    }
  }, [categories]);

  const value = {
    products,
    loading,
    error,
    refreshProducts,
    getProductById,
    getProductsByCategory: getProductsByCategoryId,
    lastUpdated
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};