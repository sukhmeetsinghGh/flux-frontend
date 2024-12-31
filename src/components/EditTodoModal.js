import React, { useState, useEffect } from "react";

const EditTodoModal = ({ todo, onClose, onSubmit }) => {
  const [todoName, setTodoName] = useState(todo.name);

  useEffect(() => {
    setTodoName(todo.name);
  }, [todo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(todoName);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2>Edit Todo</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={todoName}
            onChange={(e) => setTodoName(e.target.value)}
            placeholder="Todo Name"
          />
          <button type="submit">Update Todo</button>
        </form>
      </div>
    </div>
  );
};

export default EditTodoModal;
