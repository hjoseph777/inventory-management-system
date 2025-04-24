import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../../../contexts/CategoryContext';
import { Category } from '../../../types/category';

const CategoryList: React.FC = () => {
  const { categories, loading, error, deleteCategory, refreshCategories } = useCategories();
  const [search, setSearch] = useState<string>('');
  const [sortField, setSortField] = useState<'id' | 'name' | 'description' | 'productCount' | 'createdAt' | 'updatedAt'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [deleteInProgress, setDeleteInProgress] = useState<boolean>(false);
  const selectAllRef = useRef<HTMLInputElement>(null);

  const handleSort = (field: 'id' | 'name' | 'description' | 'productCount' | 'createdAt' | 'updatedAt') => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleRowMouseEnter = (id: string) => {
    setHoveredRow(id);
  };

  const handleRowMouseLeave = () => {
    setHoveredRow(null);
  };

  const handleRowSelect = (id: string) => {
    const newSelectedRows = new Set(selectedRows);
    
    if (newSelectedRows.has(id)) {
      newSelectedRows.delete(id);
    } else {
      newSelectedRows.add(id);
    }
    
    setSelectedRows(newSelectedRows);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = filteredCategories.map(category => category.id);
      setSelectedRows(new Set(allIds));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm(`Are you sure you want to delete this category?`)) {
      try {
        setDeleteInProgress(true);
        const result = await deleteCategory(categoryId);
        if (result) {
          // If the category was in the selected rows, remove it
          if (selectedRows.has(categoryId)) {
            const newSelectedRows = new Set(selectedRows);
            newSelectedRows.delete(categoryId);
            setSelectedRows(newSelectedRows);
          }
          alert('Category deleted successfully!');
        } else {
          alert('Failed to delete category');
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        alert(`Error deleting category: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setDeleteInProgress(false);
      }
    }
  };

  const handleBulkAction = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const action = e.target.value;
    
    if (!action || selectedRows.size === 0) return;
    
    // Reset the select element
    e.target.value = '';
    
    // Implement bulk actions here
    switch (action) {
      case 'delete':
        if (confirm(`Delete ${selectedRows.size} selected categories? This action cannot be undone.`)) {
          setDeleteInProgress(true);
          try {
            const promises = Array.from(selectedRows).map(id => deleteCategory(id));
            await Promise.all(promises);
            setSelectedRows(new Set());
            alert(`Successfully deleted ${selectedRows.size} categories`);
            await refreshCategories();
          } catch (error) {
            console.error('Error performing bulk delete:', error);
            alert(`Error deleting categories: ${error instanceof Error ? error.message : 'Unknown error'}`);
          } finally {
            setDeleteInProgress(false);
          }
        }
        break;
      case 'export':
        alert(`Would export ${selectedRows.size} selected categories to CSV`);
        // Implementation for export would go here
        break;
      default:
        break;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Apply search filter
  const filteredCategories = categories.filter(category => {
    return category.name.toLowerCase().includes(search.toLowerCase()) ||
           category.description.toLowerCase().includes(search.toLowerCase());
  });

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = selectedRows.size > 0 && selectedRows.size < filteredCategories.length;
    }
  }, [selectedRows, filteredCategories.length]);

  // Apply sorting
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (a[sortField] < b[sortField]) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (a[sortField] > b[sortField]) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="loading-container">
        <p className="loading-message">Loading categories...</p>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">!</div>
        <h3 className="error-title">Error</h3>
        <p className="error-message">{error}</p>
        <button 
          className="btn btn-primary"
          onClick={() => refreshCategories()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Categories</h1>
        <Link to="/categories/add" className="btn btn-primary">
          <span className="material-icons">add</span>
          Add Category
        </Link>
      </div>

      <div className="controls-container">
        <div className="filter-container">
          <div className="search-container">
            <span className="material-icons search-icon">search</span>
            <input
              type="text"
              placeholder="Search categories..."
              className="search-input"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="actions-container">
          <span className="selected-count">
            {selectedRows.size > 0 ? `${selectedRows.size} selected` : ''}
          </span>
          <select
            className="action-select"
            onChange={handleBulkAction}
            disabled={selectedRows.size === 0 || deleteInProgress}
          >
            <option value="">Bulk Actions</option>
            <option value="delete">Delete Selected</option>
            <option value="export">Export Selected</option>
          </select>
        </div>
      </div>

      <div className="data-grid-container">
        <table className="data-grid">
          <thead>
            <tr>
              <th className="select-column">
                <input
                  type="checkbox"
                  ref={selectAllRef}
                  onChange={handleSelectAll}
                  checked={selectedRows.size > 0 && selectedRows.size === filteredCategories.length}
                  disabled={deleteInProgress}
                />
              </th>
              <th 
                className={`sortable ${sortField === 'name' ? 'active-sort' : ''}`}
                onClick={() => handleSort('name')}
              >
                Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>Description</th>
              <th 
                className={`sortable ${sortField === 'productCount' ? 'active-sort' : ''}`}
                onClick={() => handleSort('productCount')}
              >
                Products {sortField === 'productCount' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className={`sortable ${sortField === 'updatedAt' ? 'active-sort' : ''}`}
                onClick={() => handleSort('updatedAt')}
              >
                Last Updated {sortField === 'updatedAt' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedCategories.length === 0 ? (
              <tr className="no-results">
                <td colSpan={6}>No categories found. Create a new category to get started.</td>
              </tr>
            ) : (
              sortedCategories.map(category => (
                <tr
                  key={category.id}
                  className={`
                    ${hoveredRow === category.id ? 'row-hover' : ''}
                    ${selectedRows.has(category.id) ? 'row-selected' : ''}
                  `}
                  onMouseEnter={() => handleRowMouseEnter(category.id)}
                  onMouseLeave={handleRowMouseLeave}
                >
                  <td className="select-column">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(category.id)}
                      onChange={() => handleRowSelect(category.id)}
                      disabled={deleteInProgress}
                    />
                  </td>
                  <td>
                    <Link to={`/categories/${category.id}`} className="text-bold">
                      {category.name}
                    </Link>
                  </td>
                  <td>{category.description}</td>
                  <td>
                    <span className={category.productCount > 0 ? 'status-badge status-badge-info' : 'status-badge status-badge-neutral'}>
                      {category.productCount} products
                    </span>
                  </td>
                  <td>{formatDate(category.updatedAt)}</td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/categories/${category.id}`} className="btn-icon btn-view" title="View Category">
                        <span className="material-icons">visibility</span>
                      </Link>
                      <Link to={`/categories/${category.id}/edit`} className="btn-icon btn-edit" title="Edit Category">
                        <span className="material-icons">edit</span>
                      </Link>
                      <button 
                        className="btn-icon btn-delete" 
                        title="Delete Category" 
                        onClick={() => handleDeleteCategory(category.id)}
                        disabled={deleteInProgress}
                      >
                        <span className="material-icons">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="pagination-container">
        <div className="item-count">
          Showing {sortedCategories.length} of {categories.length} categories
        </div>
        <div className="pagination">
          <button className="pagination-button" disabled={true}>
            Previous
          </button>
          <span className="pagination-info">Page 1 of 1</span>
          <button className="pagination-button" disabled={true}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
