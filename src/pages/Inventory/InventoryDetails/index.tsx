import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { InventoryItem } from '../../../types/inventory';
import { fetchInventoryItem } from '../../../utils/api/inventory';

const InventoryDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItem = async () => {
      if (id) {
        try {
          const data = await fetchInventoryItem(id);
          setItem(data);
        } catch (error) {
          console.error('Error loading item details:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadItem();
  }, [id]);

  if (loading) {
    return <div>Loading item details...</div>;
  }

  if (!item) {
    return <div>Item not found</div>;
  }

  return (
    <div className="details-page">
      <div className="details-header">
        <h1>{item.name}</h1>
        <Link to="/products" className="btn btn-secondary back-button">
          <span className="material-icons">arrow_back</span>
          Back to Products
        </Link>
      </div>
      <div className="details-grid">
        <div className="detail-card">
          <h3>Basic Information</h3>
          <p><strong>SKU:</strong> {item.sku}</p>
          <p><strong>Category:</strong> {item.category}</p>
          <p><strong>Price:</strong> ${item.price.toFixed(2)}</p>
          <p><strong>Description:</strong> {item.description}</p>
        </div>
        <div className="detail-card">
          <h3>Stock Information</h3>
          <p><strong>Quantity:</strong> {item.quantity}</p>
          <p><strong>Minimum Stock:</strong> {item.minimumStock}</p>
          <p><strong>Location:</strong> {item.location}</p>
          <p><strong>Last Restocked:</strong> {new Date(item.lastRestocked).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="details-actions">
        <Link to={`/inventory/${item.id}/edit`} className="btn btn-primary">
          <span className="material-icons">edit</span>
          Edit
        </Link>
        <Link to="/products" className="btn btn-secondary">
          Return to List
        </Link>
      </div>
    </div>
  );
};

export default InventoryDetails;
