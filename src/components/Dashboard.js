import React, { useEffect, useState } from "react";
import axiosInstance from "../lib/axiosInstance";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import TaskModal from "./TaskModal";
import TodoCard from "./TodoCard";
import EditTodoModal from "./EditTodoModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Dashboard = () => {
  const token = localStorage.getItem("auth-token");
  const navigate = useNavigate();

  const [todos, setTodos] = useState([]);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [currentTodoId, setCurrentTodoId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [expandedTask, setExpandedTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchTodos();
  }, [token, navigate]);

  useEffect(() => {
    if (todos.length > 0) {
      // Set the first Todo as the default selected Todo
      const firstTodo = todos[0];
      setCurrentTodoId(firstTodo.id);
      setCurrentTodo(firstTodo);
      fetchTasks(firstTodo.id);
    }
  }, [todos]);

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
      setTasks(response.data.data);
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
    fetchTasks(todo.id);
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

  const handleLogout = async () => {
    try {
      await axiosInstance.post(
        "/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("auth-token");
      navigate("/login");
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out!");
    }
  };

  const toggleDescription = (taskId, e) => {
    e.stopPropagation();
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const updateTodo = async (todoId, newTodoName) => {
    try {
      await axiosInstance.put(
        `/lists/${todoId}`,
        { name: newTodoName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Todo updated successfully!");
      fetchTodos();
      setShowEditModal(false);
    } catch (error) {
      toast.error("Failed to update todo.");
    }
  };

  // Calculate the number of completed tasks out of total tasks for each To-Do
  const getCompletedTaskCount = (todo) => {
    const completedTasks = todo.tasks.filter((task) => task.completed).length;
    const totalTasks = todo.tasks.length;
    return `${completedTasks}/${totalTasks}`;
  };

  // Open the Edit Todo modal
  const handleEditTodo = (todo) => {
    setTodoToEdit(todo);
    setShowEditModal(true);
  };

  return (
    <div className="dashboard-container">
      <button className="signout-btn" onClick={handleLogout}>
        Sign Out
      </button>
      <div className="todo-list-container">
        <h2 className="dashboard-header">Your To-Do Dashboard</h2>
        <button className="add-todo-btn" onClick={() => setShowTodoModal(true)}>
          Add New To-Do
        </button>

        {todos.map((todo) => (
          <div key={todo.id} onClick={() => handleTodoClick(todo)}>
            <TodoCard
              todo={todo}
              completedTaskCount={getCompletedTaskCount(todo)}
              onEdit={handleEditTodo}
            />
          </div>
        ))}
      </div>

      {/* Right panel - Task List */}
      {currentTodoId && (
        <div className="task-list-container">
          <h3>{currentTodo.name}</h3>
          {tasks.length === 0 ? (
            <p>No tasks available for this Todo.</p>
          ) : (
            <div className="list-group">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="list-group-item d-flex flex-column w-100"
                >
                  <div
                    className="task-item d-flex align-items-center justify-content-between w-100"
                    onClick={(e) => toggleDescription(task.id, e)} // Toggle description on task item click
                  >
                    <div className="d-flex align-items-center">
                      <input
                        type="checkbox"
                        checked={task.completed || false}
                        onClick={(e) => e.stopPropagation()} // Prevent description toggle when clicking checkbox
                        onChange={(e) =>
                          toggleTaskCompletion(task.id, task.completed)
                        } // Handle task completion
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
                    </div>

                    {/* Arrow icon */}
                    <span className="arrow-icon">
                      {expandedTask === task.id ? (
                        <FaChevronUp />
                      ) : (
                        <FaChevronDown />
                      )}
                    </span>
                  </div>

                  {/* Task description, conditionally rendered when expanded */}
                  {expandedTask === task.id && (
                    <div className="task-description mt-2 w-100">
                      <p>{task.description}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
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

      {/* Show the Edit Todo Modal */}
      {showEditModal && (
        <EditTodoModal
          todo={currentTodo}
          onClose={() => setShowEditModal(false)}
          onSubmit={(newTodoName) => updateTodo(currentTodo.id, newTodoName)}
        />
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
