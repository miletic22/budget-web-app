// DeleteButton.tsx
interface ViewButtonProps {
  onClick: () => void;
}

export default function DeleteButton({ onClick }: ViewButtonProps): JSX.Element {
  return (
    <button className="button view-button" onClick={onClick}>
      View
    </button>
  );
}

