import React, { useEffect, useState, FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { InventoryItem } from '../../../types/inventory';
import { useInventory } from '../../../contexts/InventoryContext';

const InventoryEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getItem, updateItem } = useInventory();
  
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    category: '',
    price: 0,
    quantity: 0,
    minimumStock: 0,
    supplier: '',
    sku: '',
    location: ''
  });

  useEffect(() => {
    const loadItem = async () => {
      if (id) {
        try {
          setLoading(true);
          const data = await getItem(id);
          if (data) {
            setItem(data);
            // Initialize form values with current item data
            setFormValues({
              name: data.name,
              description: data.description,
              category: data.category,
              price: data.price,
              quantity: data.quantity,
              minimumStock: data.minimumStock,
              supplier: data.supplier,
              sku: data.sku,
              location: data.location
            });
          }
        } catch (error) {
          console.error('Error loading item for editing:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadItem();
  }, [id, getItem]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [id]: ['price', 'quantity', 'minimumStock'].includes(id) ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!id || !item) return;
    
    try {
      setSaving(true);
      
      // Update the item with new values
      await updateItem(id, {
        ...formValues
      });
      
      // Show success message
      alert('Changes saved successfully!');
      
      // Navigate back to item details
      navigate(`/inventory/${id}`);
    } catch (error) {
      console.error('Error updating item:', error);
      alert(`Failed to save changes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p className="loading-message">Loading item for editing...</p>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="error-container">
        <div className="error-icon">!</div>
        <h3>Item Not Found</h3>
        <p>The requested inventory item could not be found.</p>
        <button onClick={() => navigate('/products')} className="btn-primary">
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="inventory-edit">
      <div className="page-header">
        <div className="header-left">
          <Link to="/products" className="back-button">
            <span className="material-icons">arrow_back</span>
            <span>Back to Products</span>
          </Link>
          <h1>Edit Item: {item.name}</h1>
        </div>
        <button onClick={() => navigate('/products')} className="btn-secondary">
          Cancel
        </button>
      </div>
      
      <form className="edit-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input 
            type="text" 
            id="name" 
            value={formValues.name} 
            onChange={handleInputChange}
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="sku">SKU</label>
          <input 
            type="text" 
            id="sku" 
            value={formValues.sku} 
            onChange={handleInputChange}
            required 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea 
            id="description" 
            value={formValues.description} 
            onChange={handleInputChange}
            rows={4}
          ></textarea>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input 
              type="text" 
              id="category" 
              value={formValues.category} 
              onChange={handleInputChange} 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="supplier">Supplier</label>
            <input 
              type="text" 
              id="supplier" 
              value={formValues.supplier} 
              onChange={handleInputChange} 
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price ($)</label>
            <input 
              type="number" 
              id="price" 
              value={formValues.price} 
              onChange={handleInputChange} 
              step="0.01" 
              min="0"
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input 
              type="number" 
              id="quantity" 
              value={formValues.quantity} 
              onChange={handleInputChange} 
              step="1" 
              min="0"
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="minimumStock">Minimum Stock</label>
            <input 
              type="number" 
              id="minimumStock" 
              value={formValues.minimumStock} 
              onChange={handleInputChange} 
              step="1" 
              min="0" 
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="location">Storage Location</label>
          <input 
            type="text" 
            id="location" 
            value={formValues.location} 
            onChange={handleInputChange} 
          />
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/products')} 
            className="btn-secondary"
            disabled={saving}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InventoryEdit;
