
interface DeleteModalBoxProps {
  onClose: () => void;
}

export function DeleteModalBox({ onClose }: DeleteModalBoxProps): JSX.Element {
  const handleCancelDelete = () => {
    onClose();
  };

  const handleConfirmDelete = () => {
    // Perform delete operation for the category
    // ...

    onClose(); 
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Delete Category</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div>
          <p>Are you sure you want to delete this category?</p>
        </div>
        <div className="buttons-wrapper">
          <button className="button confirm-delete-button" onClick={handleConfirmDelete}>
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}
