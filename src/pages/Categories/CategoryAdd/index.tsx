import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCategories } from '../../../contexts/CategoryContext';

const CategoryAdd: React.FC = () => {
  const navigate = useNavigate();
  const { categories, addCategory } = useCategories();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fix the type declaration to correctly type the form state
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    parentCategory: string | null;
    image: string;
    attributes: string[];
  }>({
    name: '',
    description: '',
    parentCategory: null,
    image: '',
    attributes: []
  });

  // Get top-level categories for parent dropdown
  const topLevelCategories = categories.filter(cat => cat.parentCategory === null);

  // State for managing attribute input fields
  const [attributeInput, setAttributeInput] = useState<string>('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'parentCategory') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value === '' ? null : value 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddAttribute = () => {
    if (attributeInput.trim() !== '' && !formData.attributes.includes(attributeInput.trim())) {
      setFormData(prev => ({
        ...prev,
        attributes: [...prev.attributes, attributeInput.trim()]
      }));
      setAttributeInput('');
    }
  };

  const handleRemoveAttribute = (attribute: string) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.filter(attr => attr !== attribute)
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name) {
        throw new Error('Category name is required');
      }

      // Create the new category
      await addCategory(formData);
      
      // Show success message
      alert('Category created successfully!');

      // Redirect to categories list
      navigate('/categories');
    } catch (err) {
      console.error('Error creating category:', err);
      setError(err instanceof Error ? err.message : 'Failed to create category. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <p className="loading-message">Creating category...</p>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-left">
          <Link to="/categories" className="back-button">
            <span className="material-icons">arrow_back</span>
            <span>Back to Categories</span>
          </Link>
          <h1>Add New Category</h1>
        </div>
      </div>

      {error && (
        <div className="error-container">
          <div className="error-icon">!</div>
          <h3 className="error-title">Error</h3>
          <p className="error-message">{error}</p>
        </div>
      )}

      <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-section">
          <h2 className="form-section-title">Category Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Category Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="parentCategory">
                Parent Category
              </label>
              <select
                id="parentCategory"
                name="parentCategory"
                className="form-select"
                value={formData.parentCategory || ''}
                onChange={handleChange}
              >
                <option value="">None (Top-Level Category)</option>
                {topLevelCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="form-help">Optional - Select a parent category to create a hierarchy</div>
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="image">
                Image URL
              </label>
              <input
                type="text"
                id="image"
                name="image"
                className="form-control"
                value={formData.image}
                onChange={handleChange}
                placeholder="category-image.jpg"
              />
              <div className="form-help">Leave empty for default image</div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2 className="form-section-title">Category Attributes</h2>
          <p className="form-section-description">Add attributes that will be used for products in this category</p>
          
          <div className="form-group">
            <label className="form-label" htmlFor="attributeInput">
              Add Attribute
            </label>
            <div className="input-group">
              <input
                type="text"
                id="attributeInput"
                className="form-control"
                value={attributeInput}
                onChange={(e) => setAttributeInput(e.target.value)}
                placeholder="e.g. color, size, material"
              />
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleAddAttribute}
              >
                Add
              </button>
            </div>
          </div>
          
          {formData.attributes.length > 0 && (
            <div className="attributes-list">
              <h3 className="attributes-title">Added Attributes:</h3>
              <div className="attributes-tags">
                {formData.attributes.map((attribute, index) => (
                  <div key={index} className="attribute-tag">
                    <span>{attribute}</span>
                    <button 
                      type="button"
                      className="attribute-remove"
                      onClick={() => handleRemoveAttribute(attribute)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="form-actions">
          <Link to="/categories" className="btn btn-secondary">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary">
            <span className="material-icons mr-1">add</span>
            Create Category
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryAdd;
