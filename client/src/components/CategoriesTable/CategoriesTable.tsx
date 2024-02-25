import React, { useState, useEffect } from 'react';
import type { Category } from './Modals/CategoryModals';
import CategoryList from './CategoriesList';
import MessagePopup from '../Message/MessagePopup';
import './Table.css';
import './Modals/Modals.css'

interface Message {
  text: string;
  title: 'success' | 'failure';
}

export default function CategoriesTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('JWTToken');
        console.log(token);
        const response = await fetch('http://127.0.0.1:8000/category/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Network response was not ok');
        }

        const data = await response.json();
        console.log('Response:', data); 

        setCategories(data);
      } catch (error) {
        console.error('Error:', error);
        setMessages([{ text: (error as Error).message || 'An unexpected error occurred', title: 'failure' }]);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <CategoryList categories={categories} />
  
      {messages.map((message, index) => (
        <MessagePopup key={index} text={message.text} title={message.title} />
      ))}
    </div>
  );
  
}
