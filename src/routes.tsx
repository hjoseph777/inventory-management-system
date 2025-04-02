import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Dashboard from './pages/Dashboard';
import InventoryList from './pages/Inventory/InventoryList';
import InventoryDetails from './pages/Inventory/InventoryDetails';
import InventoryEdit from './pages/Inventory/InventoryEdit';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// New pages for the enhanced menu structure
import ProductList from './pages/Products/ProductList';
import ProductAdd from './pages/Products/ProductAdd';
import CategoryList from './pages/Categories/CategoryList';
import CategoryAdd from './pages/Categories/CategoryAdd';
import StockLevels from './pages/Stock/StockLevels';
import StockAdjustments from './pages/Stock/StockAdjustments';
import InventoryStatus from './pages/Reports/InventoryStatus';
import StockMovement from './pages/Reports/StockMovement';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      
      {/* Original routes */}
      <Route path="/inventory" element={<InventoryList />} />
      <Route path="/inventory/:id" element={<InventoryDetails />} />
      <Route path="/inventory/:id/edit" element={<InventoryEdit />} />
      
      {/* Product management routes */}
      <Route path="/products" element={<ProductList />} />
      <Route path="/products/add" element={<ProductAdd />} />
      
      {/* Category management routes */}
      <Route path="/categories" element={<CategoryList />} />
      <Route path="/categories/add" element={<CategoryAdd />} />
      
      {/* Stock management routes */}
      <Route path="/stock/levels" element={<StockLevels />} />
      <Route path="/stock/adjustments" element={<StockAdjustments />} />
      
      {/* Report routes */}
      <Route path="/reports" element={<Reports />} />
      <Route path="/reports/inventory-status" element={<InventoryStatus />} />
      <Route path="/reports/stock-movement" element={<StockMovement />} />
      
      <Route path="/settings" element={<Settings />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default AppRoutes;
