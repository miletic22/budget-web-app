import React, { useState, useEffect } from "react";
import MessagePopup from "../../Message/MessagePopup";
import { Category } from "../../CategoriesTable/Modals/CategoryModals";
import { fetchWithInterceptor } from "../../../utils/auth";
import { Budget } from "../Home";

interface CreateModalBoxProps {
  budget: Budget | null;
  entityTitle: string;
  fetchingUrl: string;
  onClose: () => void;
}

interface Message {
  text: string;
  title: 'success' | 'failure';
}

export function CreateModalBox({ 
  budget = null,
  fetchingUrl,
  entityTitle,
  onClose,
}: CreateModalBoxProps): JSX.Element {
  const [amount, setAmount] = useState(budget?.amount || 0);
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [message, setMessage] = useState<Message[]>([]);

  const handleSave = async () => {
    const payload = {
      amount: amount,
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
            <label htmlFor="amount">Amount:</label>
            <input type="text" id="amount" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
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
