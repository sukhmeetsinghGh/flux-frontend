import React, { useEffect, useState } from "react";
import axiosInstance from "../lib/axiosInstance";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal"; // Import the To-Do modal
import TaskModal from "../components/TaskModal"; // Import the Task modal

const Dashboard = () => {
  // Get token once at the top of the component
  const token = localStorage.getItem("auth-token");
  const navigate = useNavigate();

  // State hooks for todos, modals, and current task data
  const [todos, setTodos] = useState([]);
  const [showTodoModal, setShowTodoModal] = useState(false); // To control visibility of the To-Do modal
  const [showTaskModal, setShowTaskModal] = useState(false); // To control visibility of the Task modal
  const [currentTodoId, setCurrentTodoId] = useState(null); // To store the current To-Do ID when adding a task

  // Redirect to login if no token is found
  useEffect(() => {
    if (!token) {
      navigate("/login"); // If no token, navigate to login page
      return;
    }

    // Fetch todos if token is valid
    fetchTodos();
  }, [token, navigate]);

  // Fetch To-Do Lists
  const fetchTodos = async () => {
    try {
      const response = await axiosInstance.get("/lists", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(response.data.data);
    } catch (error) {
      console.error("Error fetching To-Do lists:", error);
    }
  };

  // Add a new To-Do List
  const addTodo = async (name) => {
    try {
      await axiosInstance.post(
        "/lists",
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowTodoModal(false);
      fetchTodos(); // Refresh the To-Do lists after adding
    } catch (error) {
      console.error("Error adding To-Do:", error);
    }
  };

  // Add a new Task within a To-Do List
  const addTask = async (title, description) => {
    try {
      await axiosInstance.post(
        "/tasks",
        {
          title,
          description,
          completed: false,
          list_id: currentTodoId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowTaskModal(false); // Close task modal
      fetchTodos(); // Refresh todos to show the new task
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Mark Task as Completed
  const toggleTaskCompletion = async (taskId, completed) => {
    try {
      await axiosInstance.patch(
        `/tasks/${taskId}/complete`,
        { completed: !completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTodos(); // Refresh todos to reflect task completion status
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-header">Your To-Do Dashboard</h2>

      {/* Button for adding a new To-Do */}
      <button className="add-todo-btn" onClick={() => setShowTodoModal(true)}>
        Add New To-Do
      </button>

      {/* Display the To-Do list */}
      <div className="todo-list-container">
        {todos.map((todo) => (
          <div key={todo.id} className="todo-card">
            <h3>{todo.name}</h3>
            {/* Button to add a new task to this To-Do */}
            <button
              className="add-task-btn"
              onClick={() => {
                setShowTaskModal(true);
                setCurrentTodoId(todo.id); // Set the current To-Do ID for task creation
              }}
            >
              Add Task
            </button>
            <ul className="task-list">
              {todo.tasks.length === 0 ? (
                <p>No tasks yet. Add some tasks!</p>
              ) : (
                todo.tasks.map((task) => (
                  <li key={task.id}>
                    <input
                      type="checkbox"
                      className="task-checkbox"
                      checked={task.completed}
                      onChange={() =>
                        toggleTaskCompletion(task.id, task.completed)
                      }
                    />
                    {task.title}
                  </li>
                ))
              )}
            </ul>
          </div>
        ))}
      </div>

      {/* To-Do Modal */}
      {showTodoModal && (
        <Modal onClose={() => setShowTodoModal(false)} onSubmit={addTodo} />
      )}

      {/* Task Modal */}
      {showTaskModal && (
        <TaskModal
          onClose={() => setShowTaskModal(false)}
          onSubmit={addTask}
          todoId={currentTodoId}
        />
      )}
    </div>
  );
};

export default Dashboard;
