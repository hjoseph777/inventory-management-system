import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useCategories } from '../../../contexts/CategoryContext';
import { Category } from '../../../types/category';
import CategoryProducts from './CategoryProducts';

const CategoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCategory, deleteCategory } = useCategories();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteInProgress, setDeleteInProgress] = useState<boolean>(false);

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

  const handleDeleteCategory = async () => {
    if (!category) return;

    if (window.confirm(`Are you sure you want to delete ${category.name}?`)) {
      try {
        setDeleteInProgress(true);
        await deleteCategory(category.id);
        alert('Category deleted successfully');
        navigate('/categories');
      } catch (err) {
        console.error('Error deleting category:', err);
        setError(err instanceof Error ? err.message : 'Failed to delete category');
        setDeleteInProgress(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p className="loading-message">Loading category details...</p>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="error-container">
        <div className="error-icon">!</div>
        <h3>Error</h3>
        <p>{error || 'Category not found'}</p>
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
          <Link to="/categories" className="back-button">
            <span className="material-icons">arrow_back</span>
            <span>Back to Categories</span>
          </Link>
          <h1>{category.name}</h1>
        </div>
        <div className="header-actions">
          <Link to={`/categories/${category.id}/edit`} className="btn btn-secondary">
            <span className="material-icons">edit</span>
            Edit
          </Link>
          <button 
            className="btn btn-danger"
            onClick={handleDeleteCategory}
            disabled={deleteInProgress}
          >
            <span className="material-icons">delete</span>
            Delete
          </button>
        </div>
      </div>

      <div className="detail-container">
        <div className="detail-card">
          <div className="detail-header">
            <h2>Category Information</h2>
          </div>
          <div className="detail-content">
            <div className="detail-row">
              <div className="detail-label">Name</div>
              <div className="detail-value">{category.name}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Description</div>
              <div className="detail-value">{category.description}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Products Count</div>
              <div className="detail-value">
                <span className="status-badge status-badge-info">
                  {category.productCount} products
                </span>
              </div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Parent Category</div>
              <div className="detail-value">
                {category.parentCategory ? category.parentCategory : 'None (Top Level)'}
              </div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Created At</div>
              <div className="detail-value">{formatDate(category.createdAt)}</div>
            </div>
            <div className="detail-row">
              <div className="detail-label">Last Updated</div>
              <div className="detail-value">{formatDate(category.updatedAt)}</div>
            </div>
          </div>
        </div>

        {category.attributes && category.attributes.length > 0 && (
          <div className="detail-card">
            <div className="detail-header">
              <h2>Attributes</h2>
            </div>
            <div className="detail-content">
              <div className="attributes-list">
                {category.attributes.map((attribute, index) => (
                  <div key={index} className="attribute-tag">
                    {attribute}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {category.image && (
          <div className="detail-card">
            <div className="detail-header">
              <h2>Category Image</h2>
            </div>
            <div className="detail-content image-container">
              <img 
                src={`${window.location.origin}/images/${category.image}`} 
                alt={category.name}
                className="category-image"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = `${window.location.origin}/images/placeholder.jpg`;
                }}
              />
            </div>
          </div>
        )}
        
        <CategoryProducts 
          categoryId={category.id}
          categoryName={category.name}
        />
      </div>
    </div>
  );
};

export default CategoryDetail;