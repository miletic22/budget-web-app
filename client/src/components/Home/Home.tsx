import React, { useState, useEffect } from 'react';
import MessagePopup from '../Message/MessagePopup';
import '../ServicesGlobal/Modals.css';
import BudgetTable from './BudgetList';
import { fetchWithInterceptor } from '../../utils/auth';

export interface Budget {
  amount: number;
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

interface Message {
  text: string;
  title: 'success' | 'failure';
}

export default function BudgetPage() {
  const [budget, setBudget] = useState<Budget | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const token = localStorage.getItem('JWTToken');
        const response = await fetchWithInterceptor('http://127.0.0.1:8000/budgets/', {
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

        const data: Budget = await response.json();
        console.log('Budget Data:', data);

        setBudget(data);
      } catch (error) {
        console.error('Error fetching budget:', error);
        setMessages([{ text: (error as Error).message || 'An unexpected error occurred', title: 'failure' }]);
      }
    };

    fetchBudget();
  }, []);

  return (
    <div>
      <BudgetTable budget={budget ? [budget] : []} />

      {messages.map((message, index) => (
        <MessagePopup key={index} text={message.text} title={message.title} />
      ))}
    </div>
  );
}
