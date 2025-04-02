import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryAdd = () => {
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, we would add the category
    // For now, just navigate back to categories list
    navigate('/categories');
  };

  return (
    <div className="category-add-page">
      <h1>Add New Category</h1>
      
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="categoryName">Category Name</label>
            <input type="text" id="categoryName" required />
          </div>
          
          <div className="form-group">
            <label htmlFor="categoryDescription">Description</label>
            <textarea id="categoryDescription" rows={3}></textarea>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/categories')}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              Save Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryAdd;
