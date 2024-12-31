import React, { useEffect, useState } from "react";
import axiosInstance from "../lib/axiosInstance";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import TaskModal from "./TaskModal";
import TodoCard from "./TodoCard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const token = localStorage.getItem("auth-token");
  const navigate = useNavigate();

  const [todos, setTodos] = useState([]);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [currentTodoId, setCurrentTodoId] = useState(null);
  const [tasks, setTasks] = useState([]); // For storing tasks of the selected todo

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchTodos();
  }, [token, navigate]);

  const fetchTodos = async () => {
    try {
      const response = await axiosInstance.get("/lists", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(response.data.data);
    } catch (error) {
      console.error("Error fetching To-Do lists:", error);
      toast.error("Failed to load To-Do lists!");
    }
  };

  const fetchTasks = async (todoId) => {
    try {
      const response = await axiosInstance.get(`lists/${todoId}/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data.data); // Store tasks for the selected todo
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTodo = async (name) => {
    try {
      await axiosInstance.post(
        "/lists",
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowTodoModal(false);
      fetchTodos();
      toast.success("To-Do list added successfully!");
    } catch (error) {
      console.error("Error adding To-Do:", error);
    }
  };

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
      fetchTasks(currentTodoId);
      fetchTodos();
      setShowTaskModal(false);
      toast.success("Task added successfully!");
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task!");
    }
  };

  const handleTodoClick = (todo) => {
    setCurrentTodoId(todo.id);
    setCurrentTodo(todo);
    setTasks(todo.tasks);
  };

  const toggleTaskCompletion = async (taskId, completed) => {
    try {
      await axiosInstance.patch(
        `/tasks/${taskId}/complete`,
        { completed: !completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks(currentTodoId);
      fetchTodos();
      toast.success("Task completion status updated!");
    } catch (error) {
      console.error("Error toggling task completion:", error);
      toast.error("Failed to update task completion status!");
    }
  };

  // Calculate the number of completed tasks out of total tasks for each To-Do
  const getCompletedTaskCount = (todo) => {
    const completedTasks = todo.tasks.filter((task) => task.completed).length;
    const totalTasks = todo.tasks.length;
    return `${completedTasks}/${totalTasks}`;
  };

  return (
    <div className="dashboard-container">
      <div className="todo-list-container">
        <h2 className="dashboard-header">Your To-Do Dashboard</h2>
        <button className="add-todo-btn" onClick={() => setShowTodoModal(true)}>
          Add New To-Do
        </button>

        {todos.map((todo) => (
          <div key={todo.id} onClick={() => handleTodoClick(todo)}>
            <TodoCard
              todo={todo}
              completedTaskCount={getCompletedTaskCount(todo)} // Pass completion count as prop
            />
          </div>
        ))}
      </div>

      {/* Right panel - Task List */}
      {currentTodoId && (
        <div className="task-list-container">
          <h3>Tasks for {currentTodo.name}</h3>
          {tasks.length === 0 ? (
            <p>No tasks available for this Todo.</p>
          ) : (
            <>
              <ul className="task-list">
                {tasks.map((task) => (
                  <li key={task.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={task.completed || false}
                        onChange={() =>
                          toggleTaskCompletion(task.id, task.completed)
                        }
                      />
                      <span
                        style={{
                          textDecoration: task.completed
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {task.title}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </>
          )}
          <button
            className="add-task-btn"
            onClick={() => setShowTaskModal(true)}
          >
            Add Task
          </button>
        </div>
      )}

      {/* Show the To-Do Modal */}
      {showTodoModal && (
        <Modal onClose={() => setShowTodoModal(false)} onSubmit={addTodo} />
      )}

      {/* Show the Task Modal */}
      {showTaskModal && (
        <TaskModal
          onClose={() => setShowTaskModal(false)}
          onSubmit={addTask}
          todoId={currentTodoId}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default Dashboard;
