import { useState } from "react";
import { Category } from "./CategoryModals";

interface EditModalBoxProps {
  category: Category | null;
  onClose: () => void;
}

export function EditModalBox({ category, onClose }: EditModalBoxProps): JSX.Element {
  const [name, setName] = useState(category?.name || "");
  const [amount, setAmount] = useState(category?.amount || 0);

  const handleSave = () => {
    // Perform save operation with updated name and amount

    onClose(); 
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Category</h2>
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
