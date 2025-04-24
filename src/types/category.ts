export interface Category {
  id: string;
  name: string;
  description: string;
  parentCategory: string | null;
  image?: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
  attributes?: string[];
}

export interface CategoryFilter {
  search?: string;
  parentCategory?: string;
  sortBy?: 'name' | 'productCount' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}