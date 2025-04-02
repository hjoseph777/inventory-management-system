import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type Category = {
  id: string;
  name: string;
  productCount: number;
};

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating API fetch for categories
    setTimeout(() => {
      setCategories([
        { id: '1', name: 'Electronics', productCount: 24 },
        { id: '2', name: 'Furniture', productCount: 15 },
        { id: '3', name: 'Office Supplies', productCount: 40 },
        { id: '4', name: 'Apparel', productCount: 8 },
        { id: '5', name: 'Tools', productCount: 12 }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="category-list-page">
      <div className="page-header">
        <h1>Categories</h1>
        <Link to="/categories/add" className="btn-add">Add Category</Link>
      </div>
      
      {loading ? (
        <p>Loading categories...</p>
      ) : (
        <div className="categories-container">
          <table className="categories-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Products</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category.id}>
                  <td>{category.name}</td>
                  <td>{category.productCount}</td>
                  <td>
                    <button className="btn-edit">Edit</button>
                    <button className="btn-delete">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CategoryList;
