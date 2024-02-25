import { Category } from "./CategoryModals";

interface ViewModalProps {
  selectedCategory: Category | null;
  entityTitle: string;
  onClose: () => void;
}

export function ViewModalBox ({ 
    selectedCategory,
    entityTitle,
    onClose,
  }: ViewModalProps): JSX.Element {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>View {entityTitle}</h2>
        {selectedCategory ? (
          <div className="selected-category">
            <p>ID: {selectedCategory.id}</p>
            <p>Name: {selectedCategory.name}</p>
            <p>Amount: {selectedCategory.amount}</p>
            <p>Created At: {selectedCategory.created_at}</p>
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
