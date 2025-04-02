import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductAdd = () => {
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, we would submit the form data
    // For now, just navigate back to products list
    navigate('/products');
  };

  return (
    <div className="product-add-page">
      <h1>Add New Product</h1>
      
      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Basic Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input type="text" id="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="sku">SKU</label>
              <input type="text" id="sku" required />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select id="category" required>
                <option value="">Select a category</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Apparel">Apparel</option>
                <option value="Tools">Tools</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="supplier">Supplier</label>
              <select id="supplier">
                <option value="">Select a supplier</option>
                <option value="Dell Inc.">Dell Inc.</option>
                <option value="Office Solutions">Office Solutions</option>
                <option value="Logitech">Logitech</option>
                <option value="Apple">Apple</option>
                <option value="Samsung">Samsung</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" rows={4}></textarea>
          </div>
        </div>
        
        <div className="form-section">
          <h2>Stock Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price ($)</label>
              <input type="number" id="price" min="0" step="0.01" required />
            </div>
            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input type="number" id="quantity" min="0" required />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input type="text" id="location" />
            </div>
            <div className="form-group">
              <label htmlFor="minimumStock">Minimum Stock</label>
              <input type="number" id="minimumStock" min="0" />
            </div>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate('/products')}>
            Cancel
          </button>
          <button type="submit" className="btn-save">
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductAdd;
