import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchInventoryItems } from '../../utils/api/inventory';
import { InventoryItem } from '../../types/inventory';
import { isLowStock } from '../../utils/helpers/dateHelpers';

const Dashboard = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const items = await fetchInventoryItems();
        setInventoryItems(items);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const lowStockItems = inventoryItems.filter(item => isLowStock(item.quantity, item.minimumStock));
  const totalItems = inventoryItems.length;
  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Group items by category
  const itemsByCategory = inventoryItems.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      
      {loading ? (
        <div className="loading">Loading dashboard data...</div>
      ) : (
        <>
          <div className="stats-container">
            <div className="stat-card">
              <h3>Total Products</h3>
              <div className="stat-value">{totalItems}</div>
              <Link to="/products" className="stat-link">View all products</Link>
            </div>
            <div className="stat-card">
              <h3>Low Stock</h3>
              <div className="stat-value">{lowStockItems.length}</div>
              <Link to="/stock/levels" className="stat-link">View low stock items</Link>
            </div>
            <div className="stat-card">
              <h3>Inventory Value</h3>
              <div className="stat-value">${totalValue.toFixed(2)}</div>
              <Link to="/reports/inventory-status" className="stat-link">View reports</Link>
            </div>
            <div className="stat-card">
              <h3>Categories</h3>
              <div className="stat-value">{Object.keys(itemsByCategory).length}</div>
              <Link to="/categories" className="stat-link">Manage categories</Link>
            </div>
          </div>
          
          <div className="dashboard-sections">
            <div className="dashboard-section">
              <h2>Recent Activity</h2>
              <div className="activity-list">
                <div className="activity-item">
                  <span className="activity-icon material-icons">add_circle</span>
                  <div className="activity-details">
                    <h4>New Product Added</h4>
                    <p>Laptop Dell XPS 15 added to inventory</p>
                    <span className="activity-time">Today, 10:30 AM</span>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="activity-icon material-icons">edit</span>
                  <div className="activity-details">
                    <h4>Product Updated</h4>
                    <p>Office Chair quantity updated from 25 to 20</p>
                    <span className="activity-time">Yesterday, 3:45 PM</span>
                  </div>
                </div>
                <div className="activity-item">
                  <span className="activity-icon material-icons">warning</span>
                  <div className="activity-details">
                    <h4>Low Stock Alert</h4>
                    <p>Wireless Mouse is below minimum stock level</p>
                    <span className="activity-time">Yesterday, 9:15 AM</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="dashboard-section">
              <h2>Low Stock Items</h2>
              {lowStockItems.length > 0 ? (
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Current Stock</th>
                      <th>Minimum</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockItems.map(item => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.minimumStock}</td>
                        <td>
                          <Link to={`/inventory/${item.id}`}>View</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No items are currently below minimum stock levels.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
