import React from 'react';
import { Link } from 'react-router-dom';

const Reports = () => {
  return (
    <div className="reports-page">
      <h1>Reports</h1>
      
      <div className="reports-grid">
        <div className="report-card">
          <h2>Inventory Status</h2>
          <p>View current inventory status and valuation</p>
          <Link to="/reports/inventory-status">View Report</Link>
        </div>
        
        <div className="report-card">
          <h2>Stock Movement</h2>
          <p>Track inventory movement over time</p>
          <Link to="/reports/stock-movement">View Report</Link>
        </div>
      </div>
    </div>
  );
};

export default Reports;
