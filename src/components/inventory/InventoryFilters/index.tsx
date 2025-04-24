import React, { useState } from 'react';
import { InventoryFilter } from '../../../types/inventory';

interface InventoryFiltersProps {
  onFilterChange?: (filters: InventoryFilter) => void;
}

const InventoryFilters: React.FC<InventoryFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<InventoryFilter>({
    search: '',
    category: ''
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, search: e.target.value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFilters = { ...filters, category: e.target.value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  return (
    <div className="inventory-filters">
      <div className="filter-group">
        <input
          type="text"
          placeholder="Search inventory..."
          value={filters.search}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      <div className="filter-group">
        <select 
          value={filters.category} 
          onChange={handleCategoryChange}
          className="category-select"
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Furniture">Furniture</option>
          <option value="Office Supplies">Office Supplies</option>
          <option value="Apparel">Apparel</option>
          <option value="Tools">Tools</option>
        </select>
      </div>
    </div>
  );
};

export default InventoryFilters;
