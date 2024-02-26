import { useState } from "react";
import { Transaction } from "./TransactionModals";

interface EditModalBoxProps {
  transaction: Transaction | null;
  fetchingUrl: string;
  entityTitle: string;
  onClose: () => void;
}

export function EditModalBox({ transaction, fetchingUrl, entityTitle, onClose }: EditModalBoxProps): JSX.Element {
  const [note, setNote] = useState(transaction?.note || "");
  const [amount, setAmount] = useState(transaction?.amount || 0);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('JWTToken');
      const categoryId = transaction?.id;
  
      const updatedTransaction = {
        note,
        amount,
      };
  
      const response = await fetch(`http://127.0.0.1:8000/transaction/${categoryId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTransaction),
      });
  
      if (response.ok) {
        window.location.reload();
        // setMessage([{ text: `${entityTitle} updated`, title: 'success' }]);
        // setIsMessageVisible(true);
      } else {
        const errorData = await response.json();
        // setMessage([{ text: `Failed to update ${entityTitle.toLowerCase()}`, title: 'failure' }]);
        // setIsMessageVisible(true);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Delete {entityTitle}</h2>
        <div className="edit-modal-content">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" value={note} onChange={(e) => setNote(e.target.value)} />
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
  );
}
