import React from "react";

const TodoCard = ({ todo, completedTaskCount }) => {
  return (
    <div className="todo-card">
      <div className="todo-card-header">
        <h3>{todo.name}</h3>
        <p className="todo-task-status">{completedTaskCount} Tasks Completed</p>
      </div>
    </div>
  );
};

export default TodoCard;
