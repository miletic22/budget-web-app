import { useState, useEffect } from "react";
import MessagePopup from "../../Message/MessagePopup";
import { Category } from "./CategoryModals";

interface DeleteModalBoxProps {
  category: Category | null;
  fetchingUrl: string;
  entityTitle: string;
  onClose: () => void;
}

interface Message {
  text: string;
  title: 'success' | 'failure';
}

export function DeleteModalBox({
    category, 
    fetchingUrl,
    entityTitle,
    onClose 
  }: DeleteModalBoxProps): JSX.Element {
  const categoryId = category?.id;
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [message, setMessage] = useState<Message[]>([]);

  const handleCancelDelete = () => {
    onClose();
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('JWTToken');

      const response = await fetch(fetchingUrl, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        window.location.reload();
        setMessage([{ text: `${entityTitle} deleted`, title: 'success' }]);
        setIsMessageVisible(true);
      } else {
        const errorData = await response.json();
        setMessage([{ text: `Failed to delete ${entityTitle.toLowerCase()}`, title: 'failure' }]);
        setIsMessageVisible(true);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (isMessageVisible) {
      onClose();
    }
  }, [isMessageVisible, onClose]);

  return (
    <>
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Delete {entityTitle}</h2>
            <button className="close-button" onClick={onClose}>
              &times;
            </button>
          </div>
          <div>
            <p>Are you sure you want to delete this {entityTitle.toLowerCase()}?</p>
          </div>
          <div className="buttons-wrapper">
            <button className="button confirm-delete-button" onClick={handleConfirmDelete}>
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
      {message.map((message, index) => (
        <MessagePopup key={index} text={message.text} title={message.title} />
      ))}
    </>
  );
}
