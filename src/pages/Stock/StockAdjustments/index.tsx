import React, { useState } from 'react';
import { fetchInventoryItems } from '../../../utils/api/inventory';
import { InventoryItem } from '../../../types/inventory';

const StockAdjustments = () => {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [adjustmentQuantity, setAdjustmentQuantity] = useState(0);
  const [adjustmentReason, setAdjustmentReason] = useState('');

  const searchProducts = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const allItems = await fetchInventoryItems();
      const filtered = allItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.sku.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setItems(filtered);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    
    // In a real application, you would send this to your backend
    console.log('Adjustment submitted:', {
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      currentQuantity: selectedItem.quantity,
      adjustmentQuantity,
      newQuantity: selectedItem.quantity + adjustmentQuantity,
      reason: adjustmentReason,
      timestamp: new Date().toISOString()
    });
    
    // Reset form
    setSelectedItem(null);
    setAdjustmentQuantity(0);
    setAdjustmentReason('');
  };

  return (
    <div className="stock-adjustments-page">
      <h1>Stock Adjustments</h1>
      
      <div className="stock-adjustment-container">
        <div className="search-section">
          <h2>Find Product</h2>
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Search by product name or SKU" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchProducts()}
            />
            <button onClick={searchProducts}>Search</button>
          </div>
          
          {loading ? (
            <p>Searching...</p>
          ) : (
            items.length > 0 && (
              <div className="search-results">
                <h3>Search Results</h3>
                <ul className="product-list">
                  {items.map(item => (
                    <li 
                      key={item.id} 
                      className={selectedItem?.id === item.id ? 'selected' : ''}
                      onClick={() => setSelectedItem(item)}
                    >
                      <span className="product-name">{item.name}</span>
                      <span className="product-sku">{item.sku}</span>
                      <span className="product-quantity">Qty: {item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
        
        {selectedItem && (
          <div className="adjustment-section">
            <h2>Adjust Stock</h2>
            <div className="selected-product">
              <h3>{selectedItem.name}</h3>
              <p>Current Quantity: {selectedItem.quantity}</p>
            </div>
            
            <form onSubmit={handleSubmitAdjustment}>
              <div className="form-group">
                <label>Adjustment Quantity</label>
                <input 
                  type="number" 
                  value={adjustmentQuantity} 
                  onChange={(e) => setAdjustmentQuantity(parseInt(e.target.value))}
                  required
                />
                <small>Use positive values for stock additions, negative for removals</small>
              </div>
              
              <div className="form-group">
                <label>Reason for Adjustment</label>
                <select 
                  value={adjustmentReason} 
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  required
                >
                  <option value="">Select a reason</option>
                  <option value="inventory_count">Inventory Count</option>
                  <option value="damaged">Damaged Goods</option>
                  <option value="returned">Customer Return</option>
                  <option value="internal_use">Internal Use</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="adjustment-summary">
                <p>New Quantity: {selectedItem.quantity + adjustmentQuantity}</p>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  Submit Adjustment
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockAdjustments;
