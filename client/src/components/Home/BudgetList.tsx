import { useState } from 'react';
import EditButton from '../buttons/EditButton';
import DeleteButton from '../buttons/DeleteButton';
import ViewButton from '../buttons/ViewButton';
import { Budget } from './Home';
import { CreateModalBox } from './Modals/BudgetCreateModal';
import { DeleteModalBox } from './Modals/BudgetDeleteModal';
import { ViewModalBox } from './Modals/BudgetViewModal';
import { EditModalBox } from './Modals/BudgetEditModal';

interface BudgetListProps {
  budget: Budget[];
}

export default function BudgetList({ budget }: BudgetListProps) {
  const [selectedBudget, setselectedBudget] = useState<Budget | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState("");

  const openModal = (budget: Budget | null, editMode: string) => {
    setselectedBudget(budget);
    setIsEditMode(editMode);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEditClick = (category: Budget) => {
    openModal(category, 'edit');
  };

  const handleDeleteClick = (category: Budget) => {
    openModal(category, 'delete');
  };

  const handleViewClick = (category: Budget) => {
    openModal(category, 'view');
  };

  const handleAddClick = () => {
    openModal(null, 'create')
  };

  const handleCreateClick = () => {
    openModal(null, 'create');
  };

  const renderModal = () => {
    if (!isModalOpen) return null;

    if (isEditMode === 'create') {
      return (
        <CreateModalBox
            onClose={handleCloseModal}
            entityTitle="Budget"
            fetchingUrl="http://127.0.0.1:8000/budgets"
            budget={null}
        />
      );
    } else if (isEditMode === 'delete') {
      return (
        <DeleteModalBox
          budget={selectedBudget}
          onClose={handleCloseModal}
          fetchingUrl="http://127.0.0.1:8000/budgets"
          entityTitle={'Transaction'}
        />
      );
    } else if (isEditMode === 'view') {
      return (
        <ViewModalBox
          budget={selectedBudget}
          onClose={handleCloseModal} 
          entityTitle={'Budget'}
        />
      )
      } else if (isEditMode === 'edit') {
        return (
          <EditModalBox
            onClose={handleCloseModal}
            entityTitle="Budget"
            fetchingUrl="http://127.0.0.1:8000/budgets"
            budget={null}
          />
        );

    }

    return null;
  };

  return (
    <div className="outer-table-wrapper">
      <div className='table-wrapper'>
        <table className='table'>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Created at</th>
              <th>Updated at</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {budget.map((budget) => (
              <tr key={budget.id}>
                <td>{budget.amount}</td>
                <td>{budget.created_at}</td>
                <td>{budget.updated_at}</td>
                <td>
                  <EditButton onClick={() => handleEditClick(budget)} />
                  <DeleteButton onClick={() => handleDeleteClick(budget)} />
                  <ViewButton onClick={() => handleViewClick(budget)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleAddClick} className="button add-button">&#43;</button>
        {renderModal()}
      </div>
    </div>
  );
}
