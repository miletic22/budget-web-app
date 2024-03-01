import { useState } from "react";
import MessagePopup from "../../Message/MessagePopup";
import { fetchWithInterceptor } from "../../../utils/auth";
import { Budget } from "../Home";

interface EditModalBoxProps {
  budget: Budget | null;
  fetchingUrl: string;
  entityTitle: string;
  onClose: () => void;
}

interface Message {
  text: string;
  title: 'success' | 'failure';
}

export function EditModalBox({ budget, fetchingUrl, entityTitle, onClose }: EditModalBoxProps): JSX.Element {
  const [amount, setAmount] = useState(budget?.amount || 0);
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [message, setMessage] = useState<Message[]>([]);
  const handleSave = async () => {
    try {
      const token = localStorage.getItem('JWTToken');
  
      const updatedBudget = {
        amount,
      };
  
      const response = await fetchWithInterceptor(fetchingUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBudget),
      });
  
      if (response.ok) {
        window.location.reload();
        setMessage([{ text: `${entityTitle} updated`, title: 'success' }]);
        setIsMessageVisible(true);
      } else {
        const errorData = await response.json();
        
        setMessage([{ text: `Failed to update ${entityTitle.toLowerCase()}`, title: 'failure' }]);
        setIsMessageVisible(true);
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
