import React, { useState, useEffect } from 'react';

import TransactionList from './TransactionsList';
import MessagePopup from '../Message/MessagePopup';
import '../ServicesGlobal/Table.css';
import '../ServicesGlobal/Modals.css';
import { Transaction } from './Modals/TransactionModals';
import { fetchWithInterceptor } from '../../utils/auth';

interface Message {
  text: string;
  title: 'success' | 'failure';
}

export default function TransactionsTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('JWTToken');
        console.log(token);
        const response = await fetchWithInterceptor('http://127.0.0.1:8000/transaction', {
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

        setTransactions(data);
      } catch (error) {
        console.error('Error:', error);
        setMessages([{ text: (error as Error).message || 'An unexpected error occurred', title: 'failure' }]);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div>
      <TransactionList transactions={transactions} />
  
      {messages.map((message, index) => (
        <MessagePopup key={index} text={message.text} title={message.title} />
      ))}
    </div>
  );
  
}
