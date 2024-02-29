import { Transaction } from "./TransactionModals";

interface ViewModalProps {
  transaction: Transaction | null;
  entityTitle: string;
  onClose: () => void;
}

export function ViewModalBox ({ 
    transaction,
    entityTitle,
    onClose,
  }: ViewModalProps): JSX.Element {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>View {entityTitle}</h2>
        {transaction ? (
          <div className="selected-category">
            <p>ID: {transaction.id}</p>
            <p>Name: {transaction.note}</p>
            <p>Amount: {transaction.amount}</p>
            <p>Created At: {transaction.created_at}</p>
          </div>
        ) : (
          <p>No {entityTitle.toLowerCase()} selected.</p>
        )}
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
}
