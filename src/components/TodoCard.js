import React from "react";
import { FaEdit } from "react-icons/fa";

const TodoCard = ({ todo, completedTaskCount, onEdit }) => {
  return (
    <div className="todo-card">
      <div className="todo-card-header">
        <h3>{todo.name}</h3>
        <button className="edit-todo-btn" onClick={() => onEdit(todo)}>
          <FaEdit />
        </button>
      </div>
      <p>{completedTaskCount} tasks completed</p>
    </div>
  );
};

export default TodoCard;
