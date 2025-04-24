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
    <div className="dashboard-page">
      <h1>Stock Movement Report</h1>
      <div className="stats-container" style={{ justifyContent: 'center', marginBottom: 32 }}>
        <form className="stat-card stock-movement-form" onSubmit={handleSubmit} style={{ minWidth: 340 }}>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="startDate" style={{ fontWeight: 500 }}>Start Date</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              style={{ width: '100%', marginTop: 4 }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="endDate" style={{ fontWeight: 500 }}>End Date</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              style={{ width: '100%', marginTop: 4 }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: 6 }}>table_view</span>
            Generate Report
          </button>
          <div style={{ fontSize: 13, color: '#666', marginTop: 12, textAlign: 'center' }}>
            Select a date range and generate the report to view stock move.
          </div>
        </form>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', marginTop: 32 }}>Loading report data...</div>
      ) : movements.length > 0 ? (
        <div className="data-grid-container" style={{ marginTop: 32 }}>
          <table className="data-grid">
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
                    {movement.type === 'in' ? 'Stock In' : movement.type === 'out' ? 'Stock Out' : 'Adjustment'}
                  </td>
                  <td>{movement.quantity}</td>
                  <td>{movement.user}</td>
                  <td>{movement.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="report-actions" style={{ marginTop: 20, display: 'flex', gap: 12 }}>
            <button className="btn btn-primary">
              <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: 6 }}>download</span>
              Download CSV
            </button>
            <button className="btn btn-primary">
              <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: 6 }}>print</span>
              Print
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default StockMovement;
