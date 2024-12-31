import React, { useState } from "react";

const TaskModal = ({ onClose, onSubmit, todoId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(title, description);
    setTitle(""); // Clear the input fields
    setDescription("");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2>Add New Task</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Task Title"
            required
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter Task Description"
            required
          />
          <button type="submit">Add</button>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
