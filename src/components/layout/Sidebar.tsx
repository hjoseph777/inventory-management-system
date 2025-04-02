import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

interface SubMenuItem {
  name: string;
  path: string;
}

interface MenuItem {
  name: string;
  path?: string;
  icon?: string;
  subMenuItems?: SubMenuItem[];
}

const Sidebar: React.FC = () => {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    'Products': false,
    'Categories': false,
    'Stock Management': false,
    'Reports': false
  });

  const toggleSubMenu = (menuName: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const menuItems: MenuItem[] = [
    {
      name: 'Dashboard',
      path: '/',
      icon: 'dashboard'
    },
    {
      name: 'Products',
      icon: 'inventory',
      subMenuItems: [
        { name: 'List Products', path: '/products' },
        { name: 'Add Product', path: '/products/add' }
      ]
    },
    {
      name: 'Categories',
      icon: 'category',
      subMenuItems: [
        { name: 'List Categories', path: '/categories' },
        { name: 'Add Category', path: '/categories/add' }
      ]
    },
    {
      name: 'Stock Management',
      icon: 'inventory_2',
      subMenuItems: [
        { name: 'Stock Levels', path: '/stock/levels' },
        { name: 'Stock Adjustments', path: '/stock/adjustments' }
      ]
    },
    {
      name: 'Reports',
      icon: 'assessment',
      subMenuItems: [
        { name: 'Inventory Status', path: '/reports/inventory-status' },
        { name: 'Stock Movement', path: '/reports/stock-movement' }
      ]
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: 'settings'
    }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Inventory System</h2>
      </div>
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map(item => (
            <li key={item.name} className="sidebar-menu-item">
              {item.subMenuItems ? (
                <>
                  <div 
                    className="sidebar-menu-item-header"
                    onClick={() => toggleSubMenu(item.name)}
                  >
                    {item.icon && <span className="material-icons">{item.icon}</span>}
                    <span>{item.name}</span>
                    <span className="material-icons">
                      {expandedMenus[item.name] ? 'expand_less' : 'expand_more'}
                    </span>
                  </div>
                  {expandedMenus[item.name] && (
                    <ul className="sidebar-submenu">
                      {item.subMenuItems.map(subItem => (
                        <li key={subItem.name}>
                          <NavLink 
                            to={subItem.path}
                            className={({ isActive }) => 
                              isActive ? 'active submenu-link' : 'submenu-link'
                            }
                          >
                            {subItem.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <NavLink 
                  to={item.path || '/'}
                  className={({ isActive }) => 
                    isActive ? 'active menu-link' : 'menu-link'
                  }
                >
                  {item.icon && <span className="material-icons">{item.icon}</span>}
                  <span>{item.name}</span>
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
