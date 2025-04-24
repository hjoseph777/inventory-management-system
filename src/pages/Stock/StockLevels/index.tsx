import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface StockItem {
  id: string;
  productName: string;
  sku: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  reorderPoint: number;
  location: string;
  lastUpdated: string;
}

const StockLevels: React.FC = () => {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [sortField, setSortField] = useState<'id' | 'productName' | 'sku' | 'category' | 'currentStock' | 'minimumStock' | 'reorderPoint' | 'location' | 'lastUpdated'>('productName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // Mock categories - in a real app, fetch from API
  const categories = [
    'All Categories',
    'Electronics',
    'Clothing',
    'Food',
    'Books',
    'Office Supplies',
    'Furniture'
  ];

  useEffect(() => {
    const loadStockData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Mock data - in a real app, fetch from API
        const mockStockItems: StockItem[] = [
          {
            id: '1',
            productName: 'Smartphone X',
            sku: 'ELE-1234',
            category: 'Electronics',
            currentStock: 25,
            minimumStock: 10,
            reorderPoint: 15,
            location: 'Warehouse A, Shelf B3',
            lastUpdated: '2023-04-15T14:30:00Z'
          },
          {
            id: '2',
            productName: 'Laptop Pro',
            sku: 'ELE-5678',
            category: 'Electronics',
            currentStock: 8,
            minimumStock: 5,
            reorderPoint: 10,
            location: 'Warehouse A, Shelf B1',
            lastUpdated: '2023-04-14T11:45:00Z'
          },
          {
            id: '3',
            productName: 'Denim Jeans',
            sku: 'CLO-1122',
            category: 'Clothing',
            currentStock: 50,
            minimumStock: 20,
            reorderPoint: 30,
            location: 'Warehouse B, Shelf C2',
            lastUpdated: '2023-04-16T09:20:00Z'
          },
          {
            id: '4',
            productName: 'Wireless Headphones',
            sku: 'ELE-3456',
            category: 'Electronics',
            currentStock: 3,
            minimumStock: 10,
            reorderPoint: 15,
            location: 'Warehouse A, Shelf B4',
            lastUpdated: '2023-04-13T16:10:00Z'
          },
          {
            id: '5',
            productName: 'Office Chair',
            sku: 'FUR-7890',
            category: 'Furniture',
            currentStock: 12,
            minimumStock: 5,
            reorderPoint: 8,
            location: 'Warehouse C, Section D',
            lastUpdated: '2023-04-12T13:25:00Z'
          },
          {
            id: '6',
            productName: 'Notebook Set',
            sku: 'OFF-4321',
            category: 'Office Supplies',
            currentStock: 75,
            minimumStock: 25,
            reorderPoint: 40,
            location: 'Warehouse B, Shelf A1',
            lastUpdated: '2023-04-10T10:15:00Z'
          }
        ];
        
        // Simulate API delay
        setTimeout(() => {
          setStockItems(mockStockItems);
          setLoading(false);
        }, 500);
        
      } catch (err) {
        console.error('Error loading stock data:', err);
        setError('Failed to load stock levels. Please try again later.');
        setLoading(false);
      }
    };

    loadStockData();
  }, []);

  const handleSort = (field: 'id' | 'productName' | 'sku' | 'category' | 'currentStock' | 'minimumStock' | 'reorderPoint' | 'location' | 'lastUpdated') => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryFilter(e.target.value === 'All Categories' ? '' : e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handleRowMouseEnter = (id: string) => {
    setHoveredRow(id);
  };

  const handleRowMouseLeave = () => {
    setHoveredRow(null);
  };

  const handleRowSelect = (id: string) => {
    const newSelectedRows = new Set(selectedRows);
    
    if (newSelectedRows.has(id)) {
      newSelectedRows.delete(id);
    } else {
      newSelectedRows.add(id);
    }
    
    setSelectedRows(newSelectedRows);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = filteredStockItems.map(item => item.id);
      setSelectedRows(new Set(allIds));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleBulkAction = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const action = e.target.value;
    
    if (!action || selectedRows.size === 0) return;
    
    // Reset the select element
    e.target.value = '';
    
    // Implement bulk actions here
    switch (action) {
      case 'adjust':
        console.log('Bulk adjust stock for IDs:', Array.from(selectedRows));
        alert(`Opening bulk stock adjustment dialog for ${selectedRows.size} items`);
        break;
      case 'export':
        console.log('Export stock data for IDs:', Array.from(selectedRows));
        alert(`Exporting data for ${selectedRows.size} items`);
        break;
      default:
        break;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getStockStatus = (item: StockItem) => {
    if (item.currentStock <= 0) {
      return { status: 'Out of Stock', class: 'status-badge status-badge-danger' };
    } else if (item.currentStock < item.minimumStock) {
      return { status: 'Low Stock', class: 'status-badge status-badge-warning' };
    } else if (item.currentStock <= item.reorderPoint) {
      return { status: 'Reorder Soon', class: 'status-badge status-badge-info' };
    } else {
      return { status: 'In Stock', class: 'status-badge status-badge-success' };
    }
  };

  // Apply filters
  const filteredStockItems = stockItems.filter(item => {
    const matchesSearch = 
      item.productName.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
    
    let matchesStatus = true;
    if (statusFilter) {
      const status = getStockStatus(item).status;
      matchesStatus = status === statusFilter;
    }
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Apply sorting
  const sortedStockItems = [...filteredStockItems].sort((a, b) => {
    if (a[sortField] < b[sortField]) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (a[sortField] > b[sortField]) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Calculate stock statistics
  const totalItems = stockItems.length;
  const lowStockItems = stockItems.filter(item => item.currentStock < item.minimumStock).length;
  const outOfStockItems = stockItems.filter(item => item.currentStock <= 0).length;
  const reorderItems = stockItems.filter(item => 
    item.currentStock > item.minimumStock && 
    item.currentStock <= item.reorderPoint
  ).length;

  if (loading) {
    return (
      <div className="loading-container">
        <p className="loading-message">Loading stock levels...</p>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">!</div>
        <h3 className="error-title">Error</h3>
        <p className="error-message">{error}</p>
        <button 
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Stock Levels</h1>
        <div className="btn-group">
          <Link to="/stock/adjustments" className="btn btn-primary">
            <span className="material-icons">sync_alt</span>
            Adjust Stock
          </Link>
          <button className="btn btn-secondary">
            <span className="material-icons">file_download</span>
            Export Report
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: 'var(--color-info-light)' }}>
            <span className="material-icons">inventory_2</span>
          </div>
          <div className="stat-card-content">
            <p className="stat-card-title">Total Products</p>
            <h2 className="stat-card-value">{totalItems}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: 'var(--color-warning-light)' }}>
            <span className="material-icons">warning</span>
          </div>
          <div className="stat-card-content">
            <p className="stat-card-title">Low Stock</p>
            <h2 className="stat-card-value">{lowStockItems}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: 'var(--color-danger-light)' }}>
            <span className="material-icons">inventory</span>
          </div>
          <div className="stat-card-content">
            <p className="stat-card-title">Out of Stock</p>
            <h2 className="stat-card-value">{outOfStockItems}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: 'var(--color-primary-light)' }}>
            <span className="material-icons">shopping_cart</span>
          </div>
          <div className="stat-card-content">
            <p className="stat-card-title">Need Reordering</p>
            <h2 className="stat-card-value">{reorderItems}</h2>
          </div>
        </div>
      </div>

      <div className="controls-container">
        <div className="filter-container">
          <div className="search-container">
            <span className="material-icons search-icon">search</span>
            <input
              type="text"
              placeholder="Search products..."
              className="search-input"
              value={search}
              onChange={handleSearch}
            />
          </div>

          <div className="filter-group">
            <select
              className="filter-select"
              value={categoryFilter || 'All Categories'}
              onChange={handleCategoryChange}
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              className="filter-select"
              value={statusFilter}
              onChange={handleStatusChange}
            >
              <option value="">All Stock Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Reorder Soon">Reorder Soon</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
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
            <option value="adjust">Adjust Stock</option>
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
                  checked={selectedRows.size > 0 && selectedRows.size === filteredStockItems.length}
                />
              </th>
              <th 
                className={`sortable ${sortField === 'productName' ? 'active-sort' : ''}`}
                onClick={() => handleSort('productName')}
              >
                Product {sortField === 'productName' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className={`sortable ${sortField === 'sku' ? 'active-sort' : ''}`}
                onClick={() => handleSort('sku')}
              >
                SKU {sortField === 'sku' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className={`sortable ${sortField === 'category' ? 'active-sort' : ''}`}
                onClick={() => handleSort('category')}
              >
                Category {sortField === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className={`sortable ${sortField === 'currentStock' ? 'active-sort' : ''}`}
                onClick={() => handleSort('currentStock')}
              >
                Current Stock {sortField === 'currentStock' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>Status</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedStockItems.length === 0 ? (
              <tr className="no-results">
                <td colSpan={8}>No stock items found matching your criteria.</td>
              </tr>
            ) : (
              sortedStockItems.map(item => {
                const stockStatus = getStockStatus(item);
                return (
                  <tr
                    key={item.id}
                    className={`
                      ${hoveredRow === item.id ? 'row-hover' : ''}
                      ${selectedRows.has(item.id) ? 'row-selected' : ''}
                    `}
                    onMouseEnter={() => handleRowMouseEnter(item.id)}
                    onMouseLeave={handleRowMouseLeave}
                  >
                    <td className="select-column">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(item.id)}
                        onChange={() => handleRowSelect(item.id)}
                      />
                    </td>
                    <td>
                      <Link to={`/products/${item.id}`} className="text-bold">
                        {item.productName}
                      </Link>
                    </td>
                    <td>{item.sku}</td>
                    <td>{item.category}</td>
                    <td>
                      <span className="stock-count">
                        {item.currentStock}
                        <span className="stock-meta">
                          min: {item.minimumStock} | reorder: {item.reorderPoint}
                        </span>
                      </span>
                    </td>
                    <td>
                      <span className={stockStatus.class}>
                        {stockStatus.status}
                      </span>
                    </td>
                    <td>{item.location}</td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/stock/adjustments?product=${item.id}`} className="btn-icon btn-edit" title="Adjust Stock">
                          <span className="material-icons">sync_alt</span>
                        </Link>
                        <Link to={`/reports/stock-movement?product=${item.id}`} className="btn-icon btn-view" title="View History">
                          <span className="material-icons">history</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      <div className="pagination-container">
        <div className="item-count">
          Showing {sortedStockItems.length} of {stockItems.length} items
        </div>
        <div className="pagination">
          <button className="pagination-button" disabled={true}>
            Previous
          </button>
          <span className="pagination-info">Page 1 of 1</span>
          <button className="pagination-button" disabled={true}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockLevels;
