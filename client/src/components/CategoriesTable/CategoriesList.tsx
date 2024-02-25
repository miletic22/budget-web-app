import { useState } from 'react';
import EditButton from '../buttons/EditButton';
import { EditModalBox } from './Modals/EditModal'; 
import { DeleteModalBox } from './Modals/DeleteModal';
import { ViewModalBox } from './Modals/ViewModal'; 
import DeleteButton from '../buttons/DeleteButton';
import { Category } from './Modals/CategoryModals';
import ViewButton from '../buttons/ViewButton';
import { CreateModalBox } from './Modals/CreateModal';

interface CategoryListProps {
  categories: Category[];
}

export default function CategoryList({ categories }: CategoryListProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState("");

  const openModal = (category: Category | null, editMode: string) => {
    setSelectedCategory(category);
    setIsEditMode(editMode);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEditClick = (category: Category) => {
    openModal(category, 'edit');
  };

  const handleDeleteClick = (category: Category) => {
    openModal(category, 'delete');
  };

  const handleViewClick = (category: Category) => {
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
          category={selectedCategory}
          onClose={handleCloseModal}
          fetchingUrl={`http://127.0.0.1:8000/category/${selectedCategory?.id}`}
          entityTitle={'Category'}/>
      );
    } else if (isEditMode === 'delete') {
      return (
        <DeleteModalBox
          category={selectedCategory}
          onClose={handleCloseModal}
          fetchingUrl={`http://127.0.0.1:8000/category/${selectedCategory?.id}`}
          entityTitle={'Category'}
        />
      );
    } else if (isEditMode === 'view') {
      return (
        <ViewModalBox
          selectedCategory={selectedCategory}
          onClose={handleCloseModal} 
          entityTitle={'Category'}
        />
      )
      } else if (isEditMode === 'create') {
        return (
          <CreateModalBox
            onClose={handleCloseModal}
            entityTitle="Category"
            fetchingUrl="http://127.0.0.1:8000/category"
            category={null}
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
                  <ViewButton onClick={() => handleViewClick(category)} />
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
