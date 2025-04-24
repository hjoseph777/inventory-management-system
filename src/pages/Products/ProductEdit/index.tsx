import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Edit Product</h1>
        <Link to="/products" className="btn btn-secondary">
          <span className="material-icons">arrow_back</span>
          Back to Products
        </Link>
      </div>

      {/* Form code */}
      <form>
        {/* Form fields */}
        <div className="form-group">
          <label htmlFor="productName">Product Name</label>
          <input type="text" id="productName" name="productName" className="form-control" />
        </div>
        <div className="form-group">
          <label htmlFor="productPrice">Product Price</label>
          <input type="number" id="productPrice" name="productPrice" className="form-control" />
        </div>
        {/* Add more fields as necessary */}
      </form>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">Update Product</button>
        <Link to="/products" className="btn btn-secondary">Cancel</Link>
      </div>
    </div>
  );
};

export default ProductEdit;