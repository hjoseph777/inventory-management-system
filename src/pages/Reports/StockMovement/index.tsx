import React, { useState } from 'react';

type MovementRecord = {
  id: string;
  itemName: string;
  sku: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  date: string;
  user: string;
  reason?: string;
};

const StockMovement = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [movements, setMovements] = useState<MovementRecord[]>([]);

  const generateDummyData = () => {
    // In a real app, this would be an API call with the date filters
    setLoading(true);
    
    setTimeout(() => {
      const dummyData: MovementRecord[] = [
        {
          id: '1',
          itemName: 'Laptop Dell XPS 13',
          sku: 'DELL-XPS13-001',
          type: 'in',
          quantity: 10,
          date: '2023-06-10T08:30:00Z',
          user: 'John Smith',
          reason: 'Purchase Order #12345'
        },
        {
          id: '2',
          itemName: 'Office Chair',
          sku: 'CHAIR-ERGO-002',
          type: 'out',
          quantity: 2,
          date: '2023-06-12T14:45:00Z',
          user: 'Sarah Johnson',
          reason: 'Order #67890'
        },
        {
          id: '3',
          itemName: 'Wireless Mouse',
          sku: 'LOGI-MOUSE-003',
          type: 'adjustment',
          quantity: -3,
          date: '2023-06-15T11:20:00Z',
          user: 'Mike Davis',
          reason: 'Damaged Goods'
        }
      ];
      
      setMovements(dummyData);
      setLoading(false);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateDummyData();
  };

  return (
    <div className="stock-movement-report">
      <h1>Stock Movement Report</h1>
      
      <div className="report-filters">
        <form onSubmit={handleSubmit}>
          <div className="filter-group">
            <label htmlFor="startDate">Start Date</label>
            <input 
              type="date" 
              id="startDate" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="endDate">End Date</label>
            <input 
              type="date" 
              id="endDate" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          
          <button type="submit" className="btn-generate">Generate Report</button>
        </form>
      </div>
      
      {loading ? (
        <p>Loading report data...</p>
      ) : movements.length > 0 ? (
        <div className="movement-results">
          <table className="movement-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Product</th>
                <th>SKU</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>User</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {movements.map(movement => (
                <tr key={movement.id}>
                  <td>{new Date(movement.date).toLocaleString()}</td>
                  <td>{movement.itemName}</td>
                  <td>{movement.sku}</td>
                  <td className={`movement-type ${movement.type}`}>
                    {movement.type === 'in' ? 'Stock In' : 
                     movement.type === 'out' ? 'Stock Out' : 'Adjustment'}
                  </td>
                  <td>{movement.quantity}</td>
                  <td>{movement.user}</td>
                  <td>{movement.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="report-actions">
            <button className="btn-download">Download CSV</button>
            <button className="btn-print">Print</button>
          </div>
        </div>
      ) : (
        <div className="no-data">
          <p>Select a date range and generate the report to view stock movements.</p>
        </div>
      )}
    </div>
  );
};

export default StockMovement;
