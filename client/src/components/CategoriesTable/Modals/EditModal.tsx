import { useState } from "react";
import { Category } from "./CategoryModals";
import { StringLiteral } from "typescript";
import { fetchWithInterceptor } from "../../../utils/auth";

interface EditModalBoxProps {
  category: Category | null;
  fetchingUrl: string;
  entityTitle: string;
  onClose: () => void;
}

export function EditModalBox({ category, fetchingUrl, entityTitle, onClose }: EditModalBoxProps): JSX.Element {
  const [name, setName] = useState(category?.name || "");
  const [amount, setAmount] = useState(category?.amount || 0);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('JWTToken');
      const categoryId = category?.id;
  
      const updatedCategory = {
        name,
        amount,
      };
  
      const response = await fetchWithInterceptor(`http://127.0.0.1:8000/category/${categoryId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCategory),
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
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
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
