import { FaEdit, FaTrash } from "react-icons/fa";

const ActionButtons = ({ onEdit, onDelete }) => {
  return (
    <div className="flex space-x-2 justify-center">
      <button
        className="text-yellow-500 hover:text-yellow-600"
        onClick={onEdit}
        title="Edit"
      >
        <FaEdit />
      </button>
      <button
        className="text-red-500 hover:text-red-600"
        onClick={onDelete}
        title="Delete"
      >
        <FaTrash />
      </button>
    </div>
  );
};

export default ActionButtons;
