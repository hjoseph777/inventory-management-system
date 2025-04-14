import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createInventoryItem } from '../../../utils/api/inventory';
import { InventoryItem } from '../../../types/inventory';

const ProductAdd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    supplier: '',
    description: '',
    price: 0,
    quantity: 0,
    location: '',
    minimumStock: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: ['price', 'quantity', 'minimumStock'].includes(id) ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      
      console.log('Creating new product with data:', formData);

      // Create new inventory item with form data
      await createInventoryItem({
        ...formData,
        lastRestocked: new Date().toISOString()
      } as Omit<InventoryItem, 'id'>);
    
      console.log('Product created successfully');

      // Navigate back to products list
      navigate('/products');
    } catch (error) {
      console.error('Error creating product:', error);
    }
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
              <input 
                type="text" 
                id="name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="sku">SKU</label>
              <input 
                type="text" 
                id="sku" 
                value={formData.sku}
                onChange={handleChange}
                required 
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select 
                id="category" 
                value={formData.category}
                onChange={handleChange}
                required
              >
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
              <select 
                id="supplier"
                value={formData.supplier}
                onChange={handleChange}
              >
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
            <textarea 
              id="description" 
              rows={4}
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
        <div className="form-section">
          <h2>Stock Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price ($)</label>
              <input 
                type="number" 
                id="price" 
                min="0" 
                step="0.01" 
                value={formData.price}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input 
                type="number" 
                id="quantity" 
                min="0" 
                value={formData.quantity}
                onChange={handleChange}
                required 
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input 
                type="text" 
                id="location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="minimumStock">Minimum Stock</label>
              <input 
                type="number" 
                id="minimumStock" 
                min="0"
                value={formData.minimumStock}
                onChange={handleChange}
              />
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
