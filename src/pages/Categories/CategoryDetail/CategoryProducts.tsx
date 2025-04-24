import React, { useState } from 'react';
import { useProducts } from '../../../contexts/ProductContext';
import { InventoryItem } from '../../../types/inventory';

interface CategoryProductsProps {
  categoryId: string;
  categoryName: string;
}

const CategoryProducts: React.FC<CategoryProductsProps> = ({ categoryId, categoryName }) => {
  const { getProductsByCategory, loading, error } = useProducts();
  
  // Using simple useState calls
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  // Get products for this category
  const categoryProducts = getProductsByCategory(categoryId) || [];

  // Apply search filter
  const filteredProducts = categoryProducts.filter(product => 
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.sku.toLowerCase().includes(search.toLowerCase()) ||
    (product.description?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  // Apply sorting with comparisons
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    // Special handling for different field types
    if (sortField === 'status') {
      // Handle status field specifically
      const statusA = a.status || '';
      const statusB = b.status || '';
      return sortDirection === 'asc' 
        ? statusA.localeCompare(statusB)
        : statusB.localeCompare(statusA);
    } 
    else if (sortField === 'lastUpdated') {
      // Handle date comparison
      const dateA = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
      const dateB = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
    else {
      // Generic comparison for other fields - using indexing without type assertions
      const valueA = a[sortField];
      const valueB = b[sortField];
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc' 
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      
      if (valueA !== undefined && valueB !== undefined) {
        return sortDirection === 'asc'
          ? (valueA < valueB ? -1 : valueA > valueB ? 1 : 0)
          : (valueA < valueB ? 1 : valueA > valueB ? -1 : 0);
      }
      
      return 0;
    }
  });

  // Apply pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Format price as currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error loading products: {error}</p>
      </div>
    );
  }

  if (categoryProducts.length === 0) {
    return (
      <div className="detail-card">
        <div className="detail-header">
          <h2>{categoryName} Products</h2>
        </div>
        <div className="detail-content">
          <p>No products found in this category.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-card">
      <div className="detail-header">
        <h2>{categoryName} Products ({categoryProducts.length})</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </div>

      <div className="product-table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th 
                onClick={() => handleSort('sku')}
                className={sortField === 'sku' ? `sorted-${sortDirection}` : ''}
              >
                SKU {sortField === 'sku' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                onClick={() => handleSort('name')}
                className={sortField === 'name' ? `sorted-${sortDirection}` : ''}
              >
                Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                onClick={() => handleSort('price')}
                className={sortField === 'price' ? `sorted-${sortDirection}` : ''}
              >
                Price {sortField === 'price' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                onClick={() => handleSort('quantity')}
                className={sortField === 'quantity' ? `sorted-${sortDirection}` : ''}
              >
                Quantity {sortField === 'quantity' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                onClick={() => handleSort('status')}
                className={sortField === 'status' ? `sorted-${sortDirection}` : ''}
              >
                Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                onClick={() => handleSort('location')}
                className={sortField === 'location' ? `sorted-${sortDirection}` : ''}
              >
                Location {sortField === 'location' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                onClick={() => handleSort('lastUpdated')}
                className={sortField === 'lastUpdated' ? `sorted-${sortDirection}` : ''}
              >
                Last Updated {sortField === 'lastUpdated' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="no-results">No products match your search</td>
              </tr>
            ) : (
              currentProducts.map(product => (
                <tr key={product.id}>
                  <td>{product.sku}</td>
                  <td>{product.name}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <span className={`status-badge status-${product.status}`}>
                      {product.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td>{product.location}</td>
                  <td>{formatDate(product.lastUpdated)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(currentPage - 1)} 
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => handlePageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}
      
      <div className="product-count-info">
        Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
      </div>
    </div>
  );
};

export default CategoryProducts;