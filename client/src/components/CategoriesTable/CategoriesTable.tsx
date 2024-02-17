import { useState, useEffect } from 'react';
import './CategoriesTable.css';

import type { Category } from './Modals/CategoryModals';
import CategoryList from './CategoriesList';


export default function CategoriesTable() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/category/all', {
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <CategoryList categories={categories} />
    </div>
  );
}
