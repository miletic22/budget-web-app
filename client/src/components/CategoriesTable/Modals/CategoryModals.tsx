import { useState } from "react";

export interface Category {
  name: string;
  amount: number;
  id: number;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  budget_id: number;
}

interface ModalBoxProps {
  category: Category | null;
  onClose: () => void;
  isEditMode: boolean;
}

export default function ModalBox({ category, onClose, isEditMode }: ModalBoxProps): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = () => {
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    // Perform delete operation
    onClose(); // Close the modal after delete confirmation
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    onClose(); // Close the modal after canceling delete
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{isEditMode ? 'Edit Category' : 'Delete Category'}</h2>
        {isEditMode ? (
          <div>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" value={category?.name} onChange={handleSave} />
            <label htmlFor="amount">Amount:</label>
            <input type="text" id="amount" value={category?.amount} onChange={handleSave} />
          </div>
        ) : (
          <div>
            <p>Are you sure you want to delete this category?</p>
          </div>
        )}
        <button className="button close-button" onClick={onClose}>
          Close
        </button>
        {isEditMode ? (
          <button className="button save-button" onClick={handleSave}>
            Save
          </button>
        ) : (
          <div>
            <button className="button confirm-delete-button" onClick={handleConfirmDelete}>
              Confirm Delete
            </button>
            <button className="button cancel-delete-button" onClick={handleCancelDelete}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
