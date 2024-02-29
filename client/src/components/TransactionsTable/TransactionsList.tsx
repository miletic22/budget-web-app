import { useState } from 'react';
import EditButton from '../buttons/EditButton';
import DeleteButton from '../buttons/DeleteButton';
import ViewButton from '../buttons/ViewButton';
import { Transaction } from './Modals/TransactionModals';
import { EditModalBox } from './Modals/TransactionEditModal';
import { CreateModalBox } from './Modals/TransactionCreateModal';
import { DeleteModalBox } from './Modals/TransactionDeleteModal';
import { ViewModalBox } from './Modals/TransactionViewModal';

interface CategoryListProps {
  transactions: Transaction[];
}

export default function CategoryList({ transactions }: CategoryListProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState("");

  const openModal = (category: Transaction | null, editMode: string) => {
    setSelectedTransaction(category);
    setIsEditMode(editMode);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEditClick = (category: Transaction) => {
    openModal(category, 'edit');
  };

  const handleDeleteClick = (category: Transaction) => {
    openModal(category, 'delete');
  };

  const handleViewClick = (category: Transaction) => {
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

    if (isEditMode === 'edit') {
      return (
        <EditModalBox
          transaction={selectedTransaction}
          onClose={handleCloseModal}
          fetchingUrl={`http://127.0.0.1:8000/transaction/${selectedTransaction?.id}`}
          entityTitle={'Transaction'}/>
      );
    } else if (isEditMode === 'delete') {
      return (
        <DeleteModalBox
          transaction={selectedTransaction}
          onClose={handleCloseModal}
          fetchingUrl={`http://127.0.0.1:8000/transaction/${selectedTransaction?.id}`}
          entityTitle={'Transaction'}
        />
      );
    } else if (isEditMode === 'view') {
      return (
        <ViewModalBox
          transaction={selectedTransaction}
          onClose={handleCloseModal} 
          entityTitle={'Transaction'}
        />
      )
      } else if (isEditMode === 'create') {
        return (
          <CreateModalBox
            onClose={handleCloseModal}
            entityTitle="Transaction"
            fetchingUrl="http://127.0.0.1:8000/transaction"
            transaction={null}
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
              <th>Note</th>
              <th>Category ID</th>
              <th>Actions</th>

            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.amount}</td>
                <td>{transaction.note}</td>
                <td>{transaction.category_id}</td>
                <td>
                  <EditButton onClick={() => handleEditClick(transaction)} />
                  <DeleteButton onClick={() => handleDeleteClick(transaction)} />
                  <ViewButton onClick={() => handleViewClick(transaction)} />
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
