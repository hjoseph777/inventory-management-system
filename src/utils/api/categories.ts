import { Category, CategoryFilter } from '../../types/category';

// Default categories for initial data
const defaultCategories: Category[] = [
  {
    id: "CAT001",
    name: "Electronics",
    description: "Electronic devices and accessories",
    parentCategory: null,
    image: "category-electronics.jpg",
    productCount: 42,
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-04-10T14:45:00Z",
    attributes: ["brand", "model", "warranty", "power"]
  },
  {
    id: "CAT002",
    name: "Furniture",
    description: "Office and home furniture",
    parentCategory: null,
    image: "category-furniture.jpg",
    productCount: 18,
    createdAt: "2025-02-15T14:45:00Z",
    updatedAt: "2025-03-30T09:45:00Z",
    attributes: ["material", "color", "dimensions", "weight"]
  },
  {
    id: "CAT003",
    name: "Office Supplies",
    description: "General office supplies and accessories",
    parentCategory: null,
    image: "category-office-supplies.jpg",
    productCount: 29,
    createdAt: "2025-03-01T11:20:00Z",
    updatedAt: "2025-04-01T15:30:00Z",
    attributes: ["type", "brand", "quantity"]
  },
  {
    id: "CAT004",
    name: "Apparel",
    description: "Clothing and wearable items",
    parentCategory: null,
    image: "category-apparel.jpg",
    productCount: 78,
    createdAt: "2025-01-20T09:15:00Z",
    updatedAt: "2025-04-05T11:30:00Z",
    attributes: ["size", "color", "material", "gender"]
  },
  {
    id: "CAT005",
    name: "Tools",
    description: "Hand and power tools",
    parentCategory: null,
    image: "category-tools.jpg",
    productCount: 35,
    createdAt: "2025-02-05T13:45:00Z",
    updatedAt: "2025-03-22T16:20:00Z",
    attributes: ["type", "power source", "voltage", "brand"]
  },
  {
    id: "CAT006",
    name: "Books",
    description: "Printed materials and publications",
    parentCategory: null,
    image: "category-books.jpg",
    productCount: 63,
    createdAt: "2025-02-10T08:00:00Z",
    updatedAt: "2025-04-15T10:10:00Z",
    attributes: ["author", "publisher", "genre", "pages"]
  }
];

// Storage keys
const STORAGE_KEY = 'categoryData';
const LAST_UPDATED_KEY = 'categoryLastUpdated';

// Helper function to get data from localStorage or fallback to default data
const getStoredCategories = (): Category[] => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (Array.isArray(parsedData)) {
        console.log(`[DEBUG] Using localStorage data with ${parsedData.length} categories`);
        return parsedData;
      }
    }
  } catch (error) {
    console.error('[DEBUG] Error reading categories from localStorage:', error);
  }
  
  console.log('[DEBUG] Using default category data');
  return defaultCategories;
};

// Helper function to save data to localStorage
const saveCategories = (categories: Category[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    localStorage.setItem(LAST_UPDATED_KEY, new Date().toISOString());
    console.log(`[DEBUG] Saved ${categories.length} categories to localStorage`);
  } catch (error) {
    console.error('[DEBUG] Error saving categories to localStorage:', error);
  }
};

// CRUD operations
export const fetchCategories = async (): Promise<Category[]> => {
  return getStoredCategories();
};

export const fetchCategory = async (id: string): Promise<Category | null> => {
  const categories = getStoredCategories();
  return categories.find(category => category.id === id) || null;
};

export const createCategory = async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'productCount'>): Promise<Category> => {
  const categories = getStoredCategories();
  
  // Generate a new ID based on the highest existing ID
  const maxId = categories
    .map(c => parseInt(c.id.replace('CAT', ''), 10))
    .reduce((max, id) => Math.max(max, id), 0);
  
  const newId = `CAT${(maxId + 1).toString().padStart(3, '0')}`;
  
  // Create new category with current timestamp
  const now = new Date().toISOString();
  const newCategory: Category = {
    ...categoryData,
    id: newId,
    productCount: 0, // New category starts with 0 products
    createdAt: now,
    updatedAt: now
  };
  
  // Add to categories array
  categories.push(newCategory);
  
  // Save updated categories
  saveCategories(categories);
  
  return newCategory;
};

export const updateCategory = async (id: string, updates: Partial<Omit<Category, 'id' | 'createdAt' | 'productCount'>>): Promise<Category> => {
  const categories = getStoredCategories();
  
  // Find the category to update
  const categoryIndex = categories.findIndex(category => category.id === id);
  if (categoryIndex === -1) {
    throw new Error(`Category with ID ${id} not found`);
  }
  
  // Update the category
  const updatedCategory = {
    ...categories[categoryIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  // Replace in the array
  categories[categoryIndex] = updatedCategory;
  
  // Save updated categories
  saveCategories(categories);
  
  return updatedCategory;
};

export const deleteCategory = async (id: string): Promise<boolean> => {
  const categories = getStoredCategories();
  
  // Find the category index
  const categoryIndex = categories.findIndex(category => category.id === id);
  if (categoryIndex === -1) {
    return false;
  }
  
  // Remove from array
  categories.splice(categoryIndex, 1);
  
  // Save updated categories
  saveCategories(categories);
  
  return true;
};

export const searchCategories = async (filter: CategoryFilter): Promise<Category[]> => {
  const categories = getStoredCategories();
  
  return categories.filter(category => {
    // Filter by search term if provided
    if (filter.search && filter.search !== '') {
      const searchLower = filter.search.toLowerCase();
      const nameMatch = category.name.toLowerCase().includes(searchLower);
      const descMatch = category.description.toLowerCase().includes(searchLower);
      
      if (!(nameMatch || descMatch)) {
        return false;
      }
    }
    
    // Filter by parent category if provided
    if (filter.parentCategory !== undefined) {
      if (filter.parentCategory === 'null') {
        // Looking for top-level categories (with null parent)
        if (category.parentCategory !== null) {
          return false;
        }
      } else if (category.parentCategory !== filter.parentCategory) {
        return false;
      }
    }
    
    // If all filters passed, include this category
    return true;
  });
};

// Reset to original data (useful for demos)
export const resetCategoryData = async (): Promise<Category[]> => {
  saveCategories(defaultCategories);
  return defaultCategories;
};