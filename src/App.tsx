import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AppRoutes from './routes';
import { InventoryProvider } from './contexts/InventoryContext';
import { CategoryProvider } from './contexts/CategoryContext';
import { ProductProvider } from './contexts/ProductContext';

// Import global styles
import './styles/sidebar.css';
import './styles/global.css';
import './styles/dashboard.css';
import './styles/productList.css';

function App() {
  return (
    <Router>
      <InventoryProvider>
        <CategoryProvider>
          <ProductProvider>
            <Layout>
              <AppRoutes />
            </Layout>
          </ProductProvider>
        </CategoryProvider>
      </InventoryProvider>
    </Router>
  );
}

export default App;
