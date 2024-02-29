import { useState } from "react";
import { Category } from "./CategoryModals";
import MessagePopup from "../../Message/MessagePopup";
import { fetchWithInterceptor } from "../../../utils/auth";

interface CreateModalBoxProps {
  category: Category | null;
  entityTitle: string;
  fetchingUrl: string;
  onClose: () => void;
}

interface Message {
  text: string;
  title: 'success' | 'failure';
}

export function CreateModalBox({ 
  category = null,
  fetchingUrl,
  entityTitle,
  onClose,
  }: CreateModalBoxProps): JSX.Element {
  const [name, setName] = useState(category?.name || "");
  const [amount, setAmount] = useState(category?.amount || 0);
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [message, setMessage] = useState<Message[]>([]);


  const handleSave = async () => {
    const payload = {
      name: name,
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
        setMessage([{ text: `${entityTitle} deleted`, title: 'success' }]);
        setIsMessageVisible(true);
        onClose();
      } else {
        setMessage([{ text: `${entityTitle} not created`, title: 'failure' }]);
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
    {message.map((message, index) => (
      <MessagePopup key={index} text={message.text} title={message.title} />
    ))}
    </>
  );
}
