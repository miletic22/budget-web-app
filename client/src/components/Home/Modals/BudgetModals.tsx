export interface Budget {
  id: number;
  amount: number;
  user_id: number;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

interface ModalBoxProps {
  budget: Budget | null;
  onClose: () => void;
  isEditMode: boolean;
}