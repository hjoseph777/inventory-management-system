import React, { useEffect, useState } from 'react';
import { fetchInventoryItems } from '../../../utils/api/inventory';
import { InventoryItem } from '../../../types/inventory';
import { Link } from 'react-router-dom';

interface CategoryData {
  count: number;
  value: number;
}

const InventoryStatus = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<'category' | 'count' | 'value' | 'percent'>('category');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await fetchInventoryItems();
        setItems(data);
      } catch (error) {
        console.error('Error loading inventory status:', error);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  // Calculate summary statistics
  const totalItems = items.length;
  const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Fix: Use a predefined type for the accumulator
  const initialCategoryData: Record<string, CategoryData> = {};
  const categoryData = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = { count: 0, value: 0 };
    }
    acc[item.category].count += 1;
    acc[item.category].value += item.price * item.quantity;
    return acc;
  }, initialCategoryData);

  const handleSort = (field: 'category' | 'count' | 'value' | 'percent') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleRowSelect = (category: string) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(category)) {
      newSelectedRows.delete(category);
    } else {
      newSelectedRows.add(category);
    }
    setSelectedRows(newSelectedRows);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allCategories = Object.keys(categoryData);
      setSelectedRows(new Set(allCategories));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleBulkAction = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Placeholder for bulk actions
    e.target.value = '';
  };

  const categoryRows = Object.entries(categoryData).map(([category, data]) => {
    const percent = totalValue > 0 ? (data.value / totalValue) * 100 : 0;
    return {
      category,
      count: data.count,
      value: data.value,
      percent,
    };
  });

  const filteredRows = categoryRows.filter(row =>
    row.category.toLowerCase().includes(search.toLowerCase())
  );

  const sortedRows = [...filteredRows].sort((a, b) => {
    if (sortField === 'category') {
      return sortDirection === 'asc'
        ? a.category.localeCompare(b.category)
        : b.category.localeCompare(a.category);
    } else if (sortField === 'count') {
      return sortDirection === 'asc' ? a.count - b.count : b.count - a.count;
    } else if (sortField === 'value') {
      return sortDirection === 'asc' ? a.value - b.value : b.value - a.value;
    } else {
      return sortDirection === 'asc' ? a.percent - b.percent : b.percent - a.percent;
    }
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Inventory Status Report</h1>
        <div className="report-actions">
          <button className="btn btn-primary">
            <span className="material-icons">download</span> Download Report
          </button>
          <button className="btn btn-primary">
            <span className="material-icons">print</span> Print
          </button>
        </div>
      </div>
      <div className="controls-container">
        <div className="filter-container">
          <div className="search-container">
            <span className="material-icons search-icon">search</span>
            <input
              type="text"
              placeholder="Search categories..."
              className="search-input"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="actions-container">
          <span className="selected-count">
            {selectedRows.size > 0 ? `${selectedRows.size} selected` : ''}
          </span>
          <select
            className="action-select"
            onChange={handleBulkAction}
            disabled={selectedRows.size === 0}
          >
            <option value="">Bulk Actions</option>
            <option value="export">Export Selected</option>
          </select>
        </div>
      </div>
      <div className="data-grid-container">
        <table className="data-grid">
          <thead>
            <tr>
              <th className="select-column">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedRows.size > 0 && selectedRows.size === filteredRows.length}
                />
              </th>
              <th
                className={`sortable ${sortField === 'category' ? 'active-sort' : ''}`}
                onClick={() => handleSort('category')}
              >
                Category {sortField === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className={`sortable ${sortField === 'count' ? 'active-sort' : ''}`}
                onClick={() => handleSort('count')}
              >
                Products {sortField === 'count' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className={`sortable ${sortField === 'value' ? 'active-sort' : ''}`}
                onClick={() => handleSort('value')}
              >
                Value {sortField === 'value' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th
                className={`sortable ${sortField === 'percent' ? 'active-sort' : ''}`}
                onClick={() => handleSort('percent')}
              >
                % of Total {sortField === 'percent' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedRows.length === 0 ? (
              <tr className="no-results">
                <td colSpan={5}>No categories found.</td>
              </tr>
            ) : (
              sortedRows.map(row => (
                <tr key={row.category} className={selectedRows.has(row.category) ? 'row-selected' : ''}>
                  <td className="select-column">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(row.category)}
                      onChange={() => handleRowSelect(row.category)}
                    />
                  </td>
                  <td>{row.category}</td>
                  <td>{row.count}</td>
                  <td>${row.value.toFixed(2)}</td>
                  <td>{row.percent.toFixed(1)}%</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination-container">
        <div className="item-count">
          Showing {sortedRows.length} of {categoryRows.length} categories
        </div>
        <div className="pagination">
          <button className="pagination-button" disabled>
            Previous
          </button>
          <span className="pagination-info">Page 1 of 1</span>
          <button className="pagination-button" disabled>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryStatus;
