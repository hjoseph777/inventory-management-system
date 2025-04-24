import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createInventoryItem } from '../../../utils/api/inventory';
import { InventoryItem } from '../../../types/inventory';

const ProductAdd: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([]);
  const [suppliers, setSuppliers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category: '',
    price: '',
    cost: '',
    quantity: '',
    minimumStock: '',
    supplier: '',
    location: '',
    image: '',
    barcode: '',
    notes: '',
  });

  // Mock data - in a real app, fetch from API
  useEffect(() => {
    setCategories(['Electronics', 'Clothing', 'Food', 'Books', 'Other']);
    setSuppliers(['Supplier A', 'Supplier B', 'Supplier C', 'Other']);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name || !formData.sku || !formData.category || !formData.price) {
        throw new Error('Please fill in all required fields');
      }

      const quantity = parseInt(formData.quantity) || 0;
      const minimumStock = parseInt(formData.minimumStock) || 0;
      
      // Determine status based on quantity and minimumStock
      let status: 'in-stock' | 'low-stock' | 'out-of-stock';
      if (quantity === 0) {
        status = 'out-of-stock';
      } else if (quantity <= minimumStock) {
        status = 'low-stock';
      } else {
        status = 'in-stock';
      }

      // Prepare data for API
      const newProduct = {
        name: formData.name,
        sku: formData.sku,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price) || 0,
        cost: parseFloat(formData.cost) || 0,
        quantity: quantity,
        minimumStock: minimumStock,
        supplier: formData.supplier,
        location: formData.location,
        image: formData.image || 'default-product.jpg',
        barcode: formData.barcode,
        notes: formData.notes,
        status: status, // Add the required status property
        lastUpdated: new Date().toISOString(),
        lastRestocked: new Date().toISOString(),
      };

      // Submit to API
      await createInventoryItem(newProduct);
      
      // Show success message
      alert('Product created successfully!');
      
      // Redirect to products list
      navigate('/products');
      
    } catch (err) {
      console.error('Error creating product:', err);
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSku = () => {
    // Simple SKU generator - prefix + random number
    const prefix = formData.category ? formData.category.substring(0, 3).toUpperCase() : 'PRD';
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    setFormData(prev => ({ ...prev, sku: `${prefix}-${random}` }));
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <p className="loading-message">Creating product...</p>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-bg" style={{ background: '#f6f8fa', minHeight: '100vh', padding: '32px 0' }}>
      <div className="container" style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="card" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)', borderRadius: 12, padding: 32, background: '#fff' }}>
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: -1 }}>Add Product</h1>
              <div style={{ color: '#6c757d', fontSize: 15, marginTop: 2 }}>Fill in the details to add a new product to inventory</div>
            </div>
            <Link to="/products" className="btn btn-secondary" style={{ height: 36, display: 'flex', alignItems: 'center', gap: 4, fontSize: 15 }}>
              <span className="material-icons" style={{ fontSize: 20 }}>arrow_back</span>
              Back to Products
            </Link>
          </div>
          {error && (
            <div className="error-container" style={{ marginBottom: 16 }}>
              <div className="error-icon">!</div>
              <h3 className="error-title">Error</h3>
              <p className="error-message">{error}</p>
            </div>
          )}
          <form className="form-container" onSubmit={handleSubmit} autoComplete="off">
            <div className="form-section" style={{ marginBottom: 18 }}>
              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Product Name <span className="text-danger">*</span></label>
                  <input type="text" id="name" name="name" className="form-control" value={formData.name} onChange={handleChange} required autoFocus />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="sku">SKU <span className="text-danger">*</span></label>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input type="text" id="sku" name="sku" className="form-control" value={formData.sku} onChange={handleChange} required style={{ flex: 1 }} />
                    <button type="button" className="btn btn-secondary" onClick={generateSku} title="Generate SKU" style={{ padding: '0 10px' }}>
                      <span className="material-icons" style={{ fontSize: 18 }}>autorenew</span>
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="category">Category <span className="text-danger">*</span></label>
                  <select id="category" name="category" className="form-select" value={formData.category} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="supplier">Supplier</label>
                  <select id="supplier" name="supplier" className="form-select" value={formData.supplier} onChange={handleChange}>
                    <option value="">Select Supplier</option>
                    {suppliers.map((supplier) => (
                      <option key={supplier} value={supplier}>{supplier}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="form-section" style={{ marginBottom: 18 }}>
              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="price">Selling Price <span className="text-danger">*</span></label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ color: '#888' }}>$</span>
                    <input type="number" id="price" name="price" className="form-control" value={formData.price} onChange={handleChange} min="0" step="0.01" required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="cost">Cost Price</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ color: '#888' }}>$</span>
                    <input type="number" id="cost" name="cost" className="form-control" value={formData.cost} onChange={handleChange} min="0" step="0.01" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="quantity">Initial Quantity</label>
                  <input type="number" id="quantity" name="quantity" className="form-control" value={formData.quantity} onChange={handleChange} min="0" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="minimumStock">Minimum Stock Level</label>
                  <input type="number" id="minimumStock" name="minimumStock" className="form-control" value={formData.minimumStock} onChange={handleChange} min="0" />
                </div>
              </div>
            </div>
            <div className="form-section" style={{ marginBottom: 18 }}>
              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="description">Description</label>
                  <textarea id="description" name="description" className="form-control" value={formData.description} onChange={handleChange} rows={2} style={{ resize: 'vertical' }}></textarea>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="image">Image URL</label>
                  <input type="text" id="image" name="image" className="form-control" value={formData.image} onChange={handleChange} placeholder="product-image.jpg" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="location">Storage Location</label>
                  <input type="text" id="location" name="location" className="form-control" value={formData.location} onChange={handleChange} placeholder="e.g. Warehouse A, Shelf B3" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="barcode">Barcode / UPC</label>
                  <input type="text" id="barcode" name="barcode" className="form-control" value={formData.barcode} onChange={handleChange} />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label" htmlFor="notes">Notes</label>
                  <textarea id="notes" name="notes" className="form-control" value={formData.notes} onChange={handleChange} rows={2} style={{ resize: 'vertical' }}></textarea>
                </div>
              </div>
            </div>
            <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
              <Link to="/products" className="btn btn-secondary" style={{ minWidth: 90 }}>Cancel</Link>
              <button type="submit" className="btn btn-primary" style={{ minWidth: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <span className="material-icons" style={{ fontSize: 20 }}>add</span>
                Create Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductAdd;
