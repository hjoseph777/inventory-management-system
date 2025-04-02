import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { InventoryItem } from '../../../types/inventory';
import { fetchInventoryItem } from '../../../utils/api/inventory';

const InventoryEdit = () => {
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
          console.error('Error loading item for editing:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadItem();
  }, [id]);

  if (loading) {
    return <div>Loading item for editing...</div>;
  }

  if (!item) {
    return <div>Item not found</div>;
  }

  return (
    <div className="inventory-edit">
      <h1>Edit Item: {item.name}</h1>
      <form className="edit-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" defaultValue={item.name} />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" defaultValue={item.description}></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input type="number" id="price" defaultValue={item.price} step="0.01" />
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input type="number" id="quantity" defaultValue={item.quantity} />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default InventoryEdit;
