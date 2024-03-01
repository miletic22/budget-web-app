import { Budget } from "../Home";

interface ViewModalProps {
  budget: Budget | null;
  entityTitle: string;
  onClose: () => void;
}

export function ViewModalBox ({ 
    budget,
    entityTitle,
    onClose,
  }: ViewModalProps): JSX.Element {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>View {entityTitle}</h2>
        {budget ? (
          <div className="selected-category">
            <p>Amount: {budget.amount}</p>
            <p>Created at: {budget.created_at}</p>
            {budget.updated_at && <p>Updated at: {budget.updated_at}</p>}
            {budget.deleted_at && <p>Deleted At: {budget.deleted_at}</p>}
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
