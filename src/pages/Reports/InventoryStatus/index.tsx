import React, { useEffect, useState } from 'react';
import { fetchInventoryItems } from '../../../utils/api/inventory';
import { InventoryItem } from '../../../types/inventory';

const InventoryStatus = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await fetchInventoryItems();
        setItems(data);
      } catch (error) {
        console.error('Error loading inventory status:', error);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  // Calculate summary statistics
  const totalItems = items.length;
  const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const lowStockItems = items.filter(item => item.quantity <= item.minimumStock).length;

  // Group by category
  const categoryData = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = { count: 0, value: 0 };
    }
    acc[item.category].count += 1;
    acc[item.category].value += item.price * item.quantity;
    return acc;
  }, {} as Record<string, { count: number; value: number }>);

  return (
    <div className="inventory-status-report">
      <h1>Inventory Status Report</h1>
      
      {loading ? (
        <p>Loading report data...</p>
      ) : (
        <>
          <div className="report-summary">
            <div className="summary-card">
              <h3>Total Products</h3>
              <div className="summary-value">{totalItems}</div>
            </div>
            <div className="summary-card">
              <h3>Inventory Value</h3>
              <div className="summary-value">${totalValue.toFixed(2)}</div>
            </div>
            <div className="summary-card">
              <h3>Low Stock Items</h3>
              <div className="summary-value">{lowStockItems}</div>
            </div>
          </div>
          
          <div className="report-section">
            <h2>Category Breakdown</h2>
            <table className="report-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Products</th>
                  <th>Value</th>
                  <th>% of Total</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(categoryData).map(([category, data]) => (
                  <tr key={category}>
                    <td>{category}</td>
                    <td>{data.count}</td>
                    <td>${data.value.toFixed(2)}</td>
                    <td>{((data.value / totalValue) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="report-actions">
            <button className="btn-download">Download Report</button>
            <button className="btn-print">Print</button>
          </div>
        </>
      )}
    </div>
  );
};

export default InventoryStatus;
