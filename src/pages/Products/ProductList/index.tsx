import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useInventory } from '../../../contexts/InventoryContext';
import { InventoryItem, InventoryFilter } from '../../../types/inventory';

type SortField = 'name' | 'sku' | 'category' | 'price' | 'quantity';
type SortDirection = 'asc' | 'desc';

const ProductList = () => {
  const { items, loading, error, deleteItem, refreshInventory, lastUpdated } = useInventory();
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [categories, setCategories] = useState<string[]>([]);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [deleteInProgress, setDeleteInProgress] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<string>('Unknown');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 50; // Increased from 10 to 50 to show more products at once

  useEffect(() => {
    // Extract unique categories whenever items change
    if (items && items.length > 0) {
      const uniqueCategories = Array.from(new Set(items.map(item => item.category)));
      setCategories(uniqueCategories);
    }
  }, [items]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  // Add debug information
  useEffect(() => {
    if (items && items.length > 0) {
      // Check if data is from localStorage
      const storedData = localStorage.getItem('inventoryData');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          if (parsedData && parsedData.items && JSON.stringify(parsedData.items) === JSON.stringify(items)) {
            setDataSource('localStorage');
          } else {
            setDataSource('API or fallback data');
          }
        } catch (e) {
          setDataSource('API or fallback data (localStorage parse error)');
        }
      } else {
        setDataSource('API or fallback data (no localStorage)');
      }
      
      // Debug info
      setDebugInfo(`Total items loaded: ${items.length}\n` +
        `Item IDs: ${items.map(item => item.id).join(', ')}\n` + 
        `Data last updated: ${lastUpdated ? lastUpdated.toLocaleString() : 'unknown'}`);
    }
  }, [items, lastUpdated]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleRowSelection = (productId: string) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(productId)) {
      newSelectedRows.delete(productId);
    } else {
      newSelectedRows.add(productId);
    }
    setSelectedRows(newSelectedRows);
  };

  const toggleSelectAll = () => {
    // Only toggle selection for items on the current page
    if (selectedRows.size === paginatedProducts.length) {
      setSelectedRows(new Set());
    } else {
      const allIds = new Set(paginatedProducts.map(product => product.id));
      setSelectedRows(allIds);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm(`Are you sure you want to delete this product?`)) {
      try {
        setDeleteInProgress(true);
        const result = await deleteItem(productId);
        if (result) {
          // If the product was in the selected rows, remove it
          if (selectedRows.has(productId)) {
            const newSelectedRows = new Set(selectedRows);
            newSelectedRows.delete(productId);
            setSelectedRows(newSelectedRows);
          }
          
          // Show success message
          alert('Product deleted successfully!');
          
          // Immediately refresh inventory to update the list
          await refreshInventory();
        } else {
          alert('Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert(`Error deleting product: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setDeleteInProgress(false);
      }
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedRows.size === 0) return;
    
    console.log(`Performing ${action} on:`, Array.from(selectedRows));
    
    if (action === 'delete') {
      if (confirm(`Are you sure you want to delete ${selectedRows.size} selected item(s)?`)) {
        setDeleteInProgress(true);
        try {
          const promises = Array.from(selectedRows).map(id => deleteItem(id));
          await Promise.all(promises);
          setSelectedRows(new Set());
          alert(`Successfully deleted ${selectedRows.size} item(s)`);
          
          // Refresh inventory immediately after bulk deletion
          await refreshInventory();
        } catch (error) {
          console.error('Error performing bulk delete:', error);
          alert(`Error deleting items: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
          setDeleteInProgress(false);
        }
      }
    } else if (action === 'category') {
      const newCategory = prompt('Enter new category for selected items:');
      if (newCategory) {
        alert(`Would change category for ${selectedRows.size} item(s) to ${newCategory}`);
        // Implementation would go here
      }
    } else if (action === 'export') {
      alert(`Would export ${selectedRows.size} item(s) to CSV`);
      // Implementation would go here
    }
  };

  const filteredProducts = useMemo(() => {
    return items
      .filter(product => {
        const matchesSearch = search === '' || 
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.sku.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase());
        
        const matchesCategory = selectedCategory === '' || product.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        let comparison = 0;
        
        if (sortField === 'name') {
          comparison = a.name.localeCompare(b.name);
        } else if (sortField === 'sku') {
          comparison = a.sku.localeCompare(b.sku);
        } else if (sortField === 'category') {
          comparison = a.category.localeCompare(b.category);
        } else if (sortField === 'price') {
          comparison = a.price - b.price;
        } else if (sortField === 'quantity') {
          comparison = a.quantity - b.quantity;
        }
        
        return sortDirection === 'asc' ? comparison : -comparison;
      });
  }, [items, search, selectedCategory, sortField, sortDirection]);

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  
  // Make sure current page is valid
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Get paginated products for current page
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Handle page navigation
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Clear selection when changing pages
      setSelectedRows(new Set());
    }
  };

  const getStockStatus = (product: InventoryItem) => {
    if (product.quantity === 0) return 'out-of-stock';
    if (product.quantity <= product.minimumStock) return 'low-stock';
    return 'in-stock';
  };

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return null;
    return (
      <span className="sort-indicator">
        {sortDirection === 'asc' ? ' ▲' : ' ▼'}
      </span>
    );
  };

  const handleRetry = () => {
    console.log('Retrying data load...');
    setDebugInfo('Retrying data load...');
    refreshInventory();
  };

  return (
    <div className="product-list-page">
      <div className="page-header">
        <h1>Products</h1>
        <Link to="/products/add" className="btn-add">Add New Product</Link>
      </div>
      
      {/* Add debug panel */}
      <div className="debug-panel" style={{ 
        margin: '10px 0', 
        padding: '10px', 
        border: '1px solid #ddd', 
        borderRadius: '5px',
        backgroundColor: '#f9f9f9' 
      }}>
        <details>
          <summary>Debug Information (Data Source)</summary>
          <p><strong>Data Source:</strong> {dataSource}</p>
          <p><strong>Items Loaded:</strong> {items.length}</p>
          <p><strong>Last Updated:</strong> {lastUpdated ? lastUpdated.toLocaleString() : 'unknown'}</p>
          <button 
            onClick={() => {
              localStorage.removeItem('inventoryData');
              localStorage.removeItem('inventoryLastUpdated');
              refreshInventory();
              alert('localStorage cleared. Refreshing data...');
            }}
            style={{
              padding: '5px 10px',
              backgroundColor: '#ff9900',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Clear localStorage & Reload Data
          </button>
          <button 
            onClick={refreshInventory}
            style={{
              padding: '5px 10px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Refresh Data Only
          </button>
          <pre style={{
            marginTop: '10px',
            padding: '10px',
            backgroundColor: '#f1f1f1',
            borderRadius: '4px',
            maxHeight: '150px',
            overflow: 'auto',
            fontSize: '12px'
          }}>
            {debugInfo}
          </pre>
        </details>
      </div>
      
      <div className="spreadsheet-controls">
        <div className="search-filter-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
              disabled={loading || !!error}
            />
          </div>
          
          <div className="filter-box">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-filter"
              disabled={loading || !!error}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="bulk-actions">
          <select 
            onChange={(e) => {
              if (e.target.value !== '') {
                handleBulkAction(e.target.value);
                e.target.value = '';
              }
            }}
            className="bulk-action-select"
            disabled={selectedRows.size === 0 || loading || !!error || deleteInProgress}
          >
            <option value="">Bulk Actions</option>
            <option value="category">Change Category</option>
            <option value="delete">Delete Selected</option>
            <option value="export">Export Selected</option>
          </select>
          <span className="selected-count">
            {selectedRows.size} item{selectedRows.size !== 1 ? 's' : ''} selected
          </span>
        </div>
      </div>
      
      {loading ? (
        <div className="loading-container">
          <p className="loading-message">Loading products...</p>
          <div className="loading-spinner"></div>
        </div>
      ) : error ? (
        <div className="error-container">
          <div className="error-icon">!</div>
          <h3>Error Loading Products</h3>
          <p>{error}</p>
          <div className="error-help">
            <p>Possible solutions:</p>
            <ul>
              <li>Check if the data file exists at /data/inventory-data.json</li>
              <li>Verify your internet connection</li>
              <li>Check browser console for technical details</li>
              <li>Make sure your development server is running properly</li>
            </ul>
            <button className="retry-button" onClick={handleRetry}>
              Retry Loading
            </button>
          </div>
          <div className="debug-info">
            <details>
              <summary>Debug Information</summary>
              <p>Environment: {process.env.NODE_ENV || 'development'}</p>
              <p>Time: {new Date().toLocaleString()}</p>
              <p>Browser: {navigator.userAgent}</p>
              <p>Base URL: {window.location.origin}</p>
              <p>Path: {window.location.pathname}</p>
              <p>Debug Log:</p>
              <pre>{debugInfo}</pre>
            </details>
          </div>
        </div>
      ) : (
        <div className="spreadsheet-container">
          <table className="spreadsheet-table">
            <thead>
              <tr>
                <th className="select-column">
                  <input 
                    type="checkbox" 
                    checked={selectedRows.size === paginatedProducts.length && paginatedProducts.length > 0} 
                    onChange={toggleSelectAll}
                  />
                </th>
                <th onClick={() => handleSort('name')} className={`sortable ${sortField === 'name' ? 'active-sort' : ''}`}>
                  Name {renderSortIndicator('name')}
                </th>
                <th onClick={() => handleSort('sku')} className={`sortable ${sortField === 'sku' ? 'active-sort' : ''}`}>
                  SKU {renderSortIndicator('sku')}
                </th>
                <th onClick={() => handleSort('category')} className={`sortable ${sortField === 'category' ? 'active-sort' : ''}`}>
                  Category {renderSortIndicator('category')}
                </th>
                <th onClick={() => handleSort('price')} className={`sortable ${sortField === 'price' ? 'active-sort' : ''}`}>
                  Price {renderSortIndicator('price')}
                </th>
                <th onClick={() => handleSort('quantity')} className={`sortable ${sortField === 'quantity' ? 'active-sort' : ''}`}>
                  Stock {renderSortIndicator('quantity')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map(product => (
                  <tr 
                    key={product.id} 
                    onMouseEnter={() => setHoveredRow(product.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={`
                      ${hoveredRow === product.id ? 'hovered-row' : ''}
                      ${selectedRows.has(product.id) ? 'selected-row' : ''}
                      ${getStockStatus(product)}
                    `}
                  >
                    <td>
                      <input 
                        type="checkbox" 
                        checked={selectedRows.has(product.id)} 
                        onChange={() => toggleRowSelection(product.id)}
                      />
                    </td>
                    <td className="product-name-cell">
                      {product.image && (
                        <div className="product-thumbnail">
                          <img 
                            src={`${window.location.origin}/images/${product.image}`} 
                            alt={product.name} 
                            onError={function(e: React.SyntheticEvent<HTMLImageElement, Event>) {
                              const img = e.currentTarget;
                              console.log(`Failed to load image: ${img.src}`);
                              img.style.display = 'none';
                            }} 
                          />
                        </div>
                      )}
                      <span>{product.name}</span>
                    </td>
                    <td>{product.sku}</td>
                    <td>{product.category}</td>
                    <td className="price-cell">${product.price.toFixed(2)}</td>
                    <td className={`quantity-cell ${getStockStatus(product)}`}>
                      <span className="quantity-number">{product.quantity}</span>
                      {product.quantity <= product.minimumStock && product.quantity > 0 && (
                        <span className="low-stock-indicator">!</span>
                      )}
                      {product.quantity === 0 && (
                        <span className="out-of-stock-indicator">✕</span>
                      )}
                    </td>
                    <td className="actions-cell">
                      <div className="action-buttons">
                        <Link to={`/inventory/${product.id}`} className="btn-view" title="View details">
                          <span className="material-icons">visibility</span>
                        </Link>
                        <Link to={`/inventory/${product.id}/edit`} className="btn-edit" title="Edit product">
                          <span className="material-icons">edit</span>
                        </Link>
                        <button 
                          className="btn-delete" 
                          title="Delete product"
                          onClick={() => handleDeleteProduct(product.id)}
                          disabled={deleteInProgress}
                        >
                          <span className="material-icons">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="no-results">
                  <td colSpan={7}>No products found matching your criteria</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="spreadsheet-footer">
        <div className="item-count">
          Showing {paginatedProducts.length} of {filteredProducts.length} products
        </div>
        <div className="pagination">
          <button 
            className="page-button" 
            disabled={currentPage === 1} 
            onClick={() => goToPage(currentPage - 1)}
          >
            ← Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            className="page-button" 
            disabled={currentPage === totalPages} 
            onClick={() => goToPage(currentPage + 1)}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
