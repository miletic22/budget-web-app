import { useState } from "react";

export interface Category {
  name: string;
  amount: number;
  id: number;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  budget_id: number;
}

interface ModalBoxProps {
  category: Category | null;
  onClose: () => void;
  isEditMode: boolean;
}