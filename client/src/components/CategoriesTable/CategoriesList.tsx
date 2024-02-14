import { useState } from 'react';
import EditButton from '../buttons/EditButton';
import { EditModalBox } from './Modals/CategoryEditModal'; // Import EditModalBox
import { DeleteModalBox } from './Modals/CategoryDeleteModal'; // Import DeleteModalBox
import DeleteButton from '../buttons/DeleteButton';
import { Category } from './Modals/CategoryModals';

interface CategoryListProps {
  categories: Category[];
}

export default function CategoryList({ categories }: CategoryListProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const openModal = (category: Category, editMode: boolean) => {
    setSelectedCategory(category);
    setIsEditMode(editMode);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEditClick = (category: Category) => {
    openModal(category, true);
  };

  const handleDeleteClick = (category: Category) => {
    openModal(category, false);
  };

  const renderModal = () => {
    if (!isModalOpen) return null;

    if (isEditMode) {
      return (
        <EditModalBox
          category={selectedCategory}
          onClose={handleCloseModal}
        />
      );
    } else {
      return (
        <DeleteModalBox
          onClose={handleCloseModal}
        />
      );
    }
  };

  return (
    <div>
      <table className='table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>ID</th>
            <th>Budget ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td>{category.amount}</td>
              <td>{category.id}</td>
              <td>{category.budget_id}</td>
              <td>
                <EditButton onClick={() => handleEditClick(category)} />
                <DeleteButton onClick={() => handleDeleteClick(category)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {renderModal()}
    </div>
  );
}
