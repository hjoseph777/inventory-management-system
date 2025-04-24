import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="logo">
        <Link to="/">Inventory Management System</Link>
      </div>
      <div className="header-right">
        <div className="user-profile">
          <span className="material-icons">account_circle</span>
          <span className="username">Admin User</span>
        </div>
        <div className="notifications">
          <span className="material-icons">notifications</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
