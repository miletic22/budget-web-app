import React, { useState, useEffect } from "react";
import { Transaction } from "./TransactionModals";
import MessagePopup from "../../Message/MessagePopup";
import { Category } from "../../CategoriesTable/Modals/CategoryModals";
import { fetchWithInterceptor } from "../../../utils/auth";

interface CreateModalBoxProps {
  transaction: Transaction | null;
  entityTitle: string;
  fetchingUrl: string;
  onClose: () => void;
}

interface Message {
  text: string;
  title: 'success' | 'failure';
}

export function CreateModalBox({ 
  transaction = null,
  fetchingUrl,
  entityTitle,
  onClose,
}: CreateModalBoxProps): JSX.Element {
  const [amount, setAmount] = useState(transaction?.amount || 0);
  const [note, setNote] = useState(transaction?.note || "");
  const [categoryId, setCategoryId] = useState(transaction?.category_id || 0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [message, setMessage] = useState<Message[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('JWTToken');
        const response = await fetchWithInterceptor('http://127.0.0.1:8000/category/', {
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
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []); // ensures this effect runs only once when the component mounts

  const handleSave = async () => {
    const payload = {
      amount: amount,
      note: note,
      category_id: categoryId,
    };
  
    try {
      const token = localStorage.getItem('JWTToken');
  
      const response = await fetchWithInterceptor(fetchingUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        window.location.reload();
        setMessage([{ text: `${entityTitle} created`, title: 'success' }]);
        setIsMessageVisible(true);
        onClose();
      } else {
        setMessage([{ text: `${entityTitle} not created`, title: 'failure' }]);
        setIsMessageVisible(true);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };
  

  return (
    <>
      <div className="modal">
        <div className="modal-content">
          <h2>Create {entityTitle}</h2>
          <div className="edit-modal-content">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" value={note} onChange={(e) => setNote(e.target.value)} />
            <label htmlFor="amount">Amount:</label>
            <input type="text" id="amount" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            <label htmlFor="categoryId">Category:</label>
            <select
              id="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
            >
              <option value={0}>Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
          <div className="buttons-wrapper">
            <button className="button confirm-save-button" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
      {isMessageVisible && message.map((message, index) => (
        <MessagePopup key={index} text={message.text} title={message.title} />
      ))}
    </>
  );
}
