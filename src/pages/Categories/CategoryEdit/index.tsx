import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useCategories } from '../../../contexts/CategoryContext';
import { Category } from '../../../types/category';

const CategoryEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCategory, updateCategory, categories } = useCategories();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  
  // Form state
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
  
  // Input for adding new attributes
  const [attributeInput, setAttributeInput] = useState<string>('');

  // Get top-level categories for parent dropdown (excluding current category)
  const topLevelCategories = categories.filter(
    cat => cat.parentCategory === null && cat.id !== id
  );

  useEffect(() => {
    const loadCategory = async () => {
      if (!id) {
        setError('Category ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getCategory(id);
        if (data) {
          setCategory(data);
          setFormData({
            name: data.name,
            description: data.description,
            parentCategory: data.parentCategory,
            image: data.image || '',
            attributes: data.attributes || []
          });
        } else {
          setError('Category not found');
        }
      } catch (err) {
        console.error('Error loading category:', err);
        setError(err instanceof Error ? err.message : 'Failed to load category details');
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [id, getCategory]);

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
    
    if (!id || !category) return;
    
    try {
      setSaving(true);
      setError(null);
      
      await updateCategory(id, formData);
      
      alert('Category updated successfully');
      navigate(`/categories/${id}`);
    } catch (err) {
      console.error('Error updating category:', err);
      setError(err instanceof Error ? err.message : 'Failed to update category');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p className="loading-message">Loading category details...</p>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error && !category) {
    return (
      <div className="error-container">
        <div className="error-icon">!</div>
        <h3>Error</h3>
        <p>{error}</p>
        <Link to="/categories" className="btn btn-primary">
          Back to Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-left">
          <Link to={`/categories/${id}`} className="back-button">
            <span className="material-icons">arrow_back</span>
            <span>Back to Category Details</span>
          </Link>
          <h1>Edit Category: {category?.name}</h1>
        </div>
      </div>

      {error && (
        <div className="error-container">
          <div className="error-icon">!</div>
          <h3>Error</h3>
          <p>{error}</p>
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
                {topLevelCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
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
              <div className="form-help">Leave empty for no image</div>
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
              <h3 className="attributes-title">Attributes:</h3>
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
          <Link to={`/categories/${id}`} className="btn btn-secondary">
            Cancel
          </Link>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryEdit;