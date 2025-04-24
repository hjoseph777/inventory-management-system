import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  fetchCategories, 
  fetchCategory,
  createCategory, 
  updateCategory, 
  deleteCategory,
  searchCategories,
  resetCategoryData
} from '../utils/api/categories';
import { Category, CategoryFilter } from '../types/category';

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refreshCategories: () => Promise<void>;
  getCategory: (id: string) => Promise<Category | null>;
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'productCount'>) => Promise<Category>;
  updateCategory: (id: string, updates: Partial<Omit<Category, 'id' | 'createdAt' | 'productCount'>>) => Promise<Category>;
  deleteCategory: (id: string) => Promise<boolean>;
  searchCategories: (filter: CategoryFilter) => Promise<Category[]>;
  resetData: () => Promise<void>;
  lastUpdated: Date | null;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};

interface CategoryProviderProps {
  children: ReactNode;
}

export const CategoryProvider: React.FC<CategoryProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refreshCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error refreshing categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategory = async (id: string) => {
    return fetchCategory(id);
  };

  const addCategory = async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'productCount'>) => {
    const newCategory = await createCategory(categoryData);
    await refreshCategories(); // Refresh the list after adding
    return newCategory;
  };

  const updateCategoryItem = async (id: string, updates: Partial<Omit<Category, 'id' | 'createdAt' | 'productCount'>>) => {
    const updatedCategory = await updateCategory(id, updates);
    await refreshCategories(); // Refresh the list after updating
    return updatedCategory;
  };

  const deleteCategoryItem = async (id: string) => {
    const result = await deleteCategory(id);
    await refreshCategories(); // Refresh the list after deleting
    return result;
  };

  const searchCategoryItems = async (filter: CategoryFilter) => {
    return searchCategories(filter);
  };

  const resetData = async () => {
    await resetCategoryData();
    await refreshCategories();
  };

  useEffect(() => {
    refreshCategories();
  }, []);

  const value = {
    categories,
    loading,
    error,
    refreshCategories,
    getCategory,
    addCategory,
    updateCategory: updateCategoryItem,
    deleteCategory: deleteCategoryItem,
    searchCategories: searchCategoryItems,
    resetData,
    lastUpdated
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};