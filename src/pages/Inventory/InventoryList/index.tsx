import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InventoryList from '../../../components/inventory/InventoryList';
import InventoryFilters from '../../../components/inventory/InventoryFilters';
import { InventoryItem } from '../../../types/inventory';
import { fetchInventoryItems } from '../../../utils/api/inventory';

const InventoryListPage = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app, we'd fetch from API
    // For now, we'll simulate loading data
    setLoading(true);
    fetchInventoryItems()
      .then(data => setItems(data))
      .catch(error => console.error('Error fetching inventory:', error))
      .finally(() => setLoading(false));
  }, []);

  const handleItemSelect = (item: InventoryItem) => {
    navigate(`/inventory/${item.id}`);
  };

  return (
    <div className="inventory-list-page">
      <h1>Inventory Items</h1>
      <InventoryFilters />
      
      {loading ? (
        <p>Loading inventory...</p>
      ) : (
        <InventoryList items={items} onItemSelect={handleItemSelect} />
      )}
    </div>
  );
};

export default InventoryListPage;
