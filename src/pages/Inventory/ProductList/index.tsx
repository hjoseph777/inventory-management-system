import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../../contexts/ProductContext';
import './productList.css';

const ProductList = () => {
  // Use ProductContext to get all 256 products
  const { products, loading, error } = useProducts();
  const navigate = useNavigate();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Debug logging
  useEffect(() => {
    console.log(`ProductList: Total products loaded: ${products?.length || 0}`);
  }, [products]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((products?.length || 0) / itemsPerPage);

  // Navigate to product detail
  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  // Page change handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="product-list-container">
      <h1>Product Catalog</h1>
      <div className="pagination-info">
        Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, products.length)} of {products.length} products
      </div>
      
      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <div className="product-grid">
            {currentProducts.map((product) => (
              <div 
                key={product.id} 
                className="product-card"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="product-image">
                  <img
                    src={`${process.env.PUBLIC_URL}/images/${product.image}`}
                    alt={product.name}
                    onError={(e) => {
                      e.currentTarget.src = `${process.env.PUBLIC_URL}/images/placeholder.jpg`;
                    }}
                  />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-category">{product.category}</p>
                  <p className="product-price">${product.price?.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="pagination">
            <button 
              onClick={() => paginate(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={currentPage === i + 1 ? 'active' : ''}
              >
                {i + 1}
              </button>
            ))}
            
            <button 
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;