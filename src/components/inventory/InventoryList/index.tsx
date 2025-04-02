import React, { useState, useEffect } from 'react';
import { InventoryItem } from '../../../types/inventory';

interface InventoryListProps {
  items: InventoryItem[];
  onItemSelect: (item: InventoryItem) => void;
}

const InventoryList: React.FC<InventoryListProps> = ({ items, onItemSelect }) => {
  return (
    <div className="inventory-list">
      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.sku}</td>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.quantity}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>
                <button onClick={() => onItemSelect(item)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryList;
