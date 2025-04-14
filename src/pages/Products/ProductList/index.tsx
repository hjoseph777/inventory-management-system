import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchInventoryItems } from '../../../utils/api/inventory';
import { InventoryItem } from '../../../types/inventory';

const ProductList = () => {
  const [products, setProducts] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    loadProducts();
  }, [location]);

const loadProducts = async () => {
    setLoading(true);
    try {
      console.log('Fetching inventory items in ProductList...');
      const items = await fetchInventoryItems();
      console.log('Fetched items:', items);
      
      if (!items || items.length === 0) {
        console.log('No items found or empty array returned');
      }
      
      setProducts(items);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-list-page">
      <div className="page-header">
        <h1>Products</h1>
        <Link to="/products/add" className="btn-add">Add New Product</Link>
      </div>
      
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6}>No products found</td>
                </tr>
              ) : (
                products.map(product => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.sku}</td>
                    <td>{product.category}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.quantity}</td>
                    <td>
                      <Link to={`/inventory/${product.id}`}>View</Link>
                      <Link to={`/inventory/${product.id}/edit`}>Edit</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductList;
