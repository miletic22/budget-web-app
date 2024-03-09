
import { useState, useEffect } from 'react';
import "./MessagePopup.css";

type MessagePopupProps = {
  text: string;
  title: string;
};


const MessagePopup: React.FC<MessagePopupProps> = ({ text, title }) => {
  const [showMessage, setShowMessage] = useState(true);
  const [exitAnimation, setExitAnimation] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExitAnimation(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 500);
    }, 10000);

    setEntered(true);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleClose = () => {
    setExitAnimation(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 500);
  };

  const messageClass = title === 'success' ? 'message-success' : 'message-failure';

  return (
    <div className="message-popup-container">
      {showMessage && (
        <div
          className={`message-popup ${exitAnimation ? "message-popup-exit" : ""} ${messageClass} ${
            entered ? "message-popup-entered" : ""
          }`}
        >
          <div className="message-top">
            <div className="message-title">
              {title === 'success' ? (
                <>
                  <h2 className="symbol green">&#10003;</h2>
                  <h2 className="green">{title.charAt(0).toUpperCase() + title.slice(1)}</h2>
                  <br />
                </>
              ) : (
                <>
                  <h2 className="symbol red">&#9888;</h2>
                  <h2 className="red">{title.charAt(0).toUpperCase() + title.slice(1)}</h2>
                  <br />
                </>
              )}
            </div>
            <button onClick={handleClose}>&#10005;</button>
          </div>
          <div className="message-bottom">
            <p>{text}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagePopup;
