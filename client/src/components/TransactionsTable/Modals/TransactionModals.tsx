export interface Transaction {
  id: number;
  note: string;
  amount: number;
  category_id: number;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  budget_id: number;
}

interface ModalBoxProps {
  category: Transaction | null;
  onClose: () => void;
  isEditMode: boolean;
}