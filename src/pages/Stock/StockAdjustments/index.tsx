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
    <div className="dashboard-page">
      <h1>Stock Adjustments</h1>
      <div className="stats-container" style={{ justifyContent: 'center', marginBottom: 32 }}>
        <div className="stat-card" style={{ minWidth: 340 }}>
          <h2 style={{ fontSize: 20, marginBottom: 16 }}>Find Product</h2>
          <div className="search-container" style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input
              type="text"
              placeholder="Search by product name or SKU"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && searchProducts()}
              style={{ flex: 1 }}
            />
            <button className="btn btn-primary" type="button" onClick={searchProducts}>
              <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: 4 }}>search</span>
              Search
            </button>
          </div>
        </div>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: 32 }}>Searching...</div>
      ) : items.length > 0 ? (
        <div className="data-grid-container" style={{ marginTop: 32 }}>
          <table className="data-grid">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>SKU</th>
                <th>Current Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className={selectedItem?.id === item.id ? 'row-selected' : ''}>
                  <td>{item.name}</td>
                  <td>{item.sku}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={() => setSelectedItem(item)}
                    >
                      Adjust
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {selectedItem && (
        <div className="stats-container" style={{ justifyContent: 'center', marginTop: 40 }}>
          <div className="stat-card" style={{ minWidth: 340 }}>
            <h2 style={{ fontSize: 20, marginBottom: 12 }}>Adjust Stock</h2>
            <div className="selected-product" style={{ marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>{selectedItem.name}</h3>
              <p style={{ margin: 0, color: '#666' }}>Current Quantity: {selectedItem.quantity}</p>
            </div>
            <form onSubmit={handleSubmitAdjustment}>
              <div className="form-group" style={{ marginBottom: 12 }}>
                <label>Adjustment Quantity</label>
                <input
                  type="number"
                  value={adjustmentQuantity}
                  onChange={e => setAdjustmentQuantity(parseInt(e.target.value))}
                  required
                  style={{ width: '100%' }}
                />
                <small>Use positive values for stock additions, negative for removals</small>
              </div>
              <div className="form-group" style={{ marginBottom: 12 }}>
                <label>Reason for Adjustment</label>
                <select
                  value={adjustmentReason}
                  onChange={e => setAdjustmentReason(e.target.value)}
                  required
                  style={{ width: '100%' }}
                >
                  <option value="">Select a reason</option>
                  <option value="inventory_count">Inventory Count</option>
                  <option value="damaged">Damaged Goods</option>
                  <option value="returned">Customer Return</option>
                  <option value="internal_use">Internal Use</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="adjustment-summary" style={{ marginBottom: 12 }}>
                <p>New Quantity: {selectedItem.quantity + adjustmentQuantity}</p>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Submit Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockAdjustments;
