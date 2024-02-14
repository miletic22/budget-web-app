// DeleteButton.tsx
interface DeleteButtonProps {
  onClick: () => void;
}

export default function DeleteButton({ onClick }: DeleteButtonProps): JSX.Element {
  return (
    <button className="button delete-button" onClick={onClick}>
      Delete
    </button>
  );
}

