import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Inventory Management System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
