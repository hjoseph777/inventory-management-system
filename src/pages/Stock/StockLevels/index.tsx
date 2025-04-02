import React, { useEffect, useState } from 'react';
import { fetchInventoryItems } from '../../../utils/api/inventory';
import { InventoryItem } from '../../../types/inventory';
import { isLowStock } from '../../../utils/helpers/dateHelpers';

const StockLevels = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'low', 'normal', 'out'

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await fetchInventoryItems();
        setItems(data);
      } catch (error) {
        console.error('Error loading stock levels:', error);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'low') return isLowStock(item.quantity, item.minimumStock) && item.quantity > 0;
    if (filter === 'out') return item.quantity === 0;
    if (filter === 'normal') return !isLowStock(item.quantity, item.minimumStock);
    return true;
  });

  return (
    <div className="stock-levels-page">
      <h1>Stock Levels</h1>
      
      <div className="filter-controls">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Stock
        </button>
        <button 
          className={`filter-btn ${filter === 'low' ? 'active' : ''}`}
          onClick={() => setFilter('low')}
        >
          Low Stock
        </button>
        <button 
          className={`filter-btn ${filter === 'out' ? 'active' : ''}`}
          onClick={() => setFilter('out')}
        >
          Out of Stock
        </button>
        <button 
          className={`filter-btn ${filter === 'normal' ? 'active' : ''}`}
          onClick={() => setFilter('normal')}
        >
          Normal Stock
        </button>
      </div>
      
      {loading ? (
        <p>Loading stock levels...</p>
      ) : (
        <div className="stock-table">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Current Stock</th>
                <th>Minimum Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.sku}</td>
                  <td>{item.quantity}</td>
                  <td>{item.minimumStock}</td>
                  <td className={`status ${isLowStock(item.quantity, item.minimumStock) ? 'low' : 'ok'}`}>
                    {item.quantity === 0 ? 'Out of Stock' : 
                      isLowStock(item.quantity, item.minimumStock) ? 'Low Stock' : 'In Stock'}
                  </td>
                  <td>
                    <button>Adjust</button>
                    <button>Order</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StockLevels;
