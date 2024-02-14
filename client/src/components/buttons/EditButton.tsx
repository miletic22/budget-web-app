interface EditButtonProps {
  onClick: () => void;
}

export default function EditButton({ onClick }: EditButtonProps): JSX.Element {
  return (
    <button className="button edit-button" onClick={onClick}>
      Edit
    </button>
  );
}
