import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import TaskItem from "./TaskItem";
import "../styles.css"; // Import global styles

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("priority");

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "medium",
  });

  useEffect(() => {
    fetchTasks();
  }, [filterStatus, searchTerm, sortBy, tasks.length]); // ✅ Include tasks.length to refresh list on updates

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      const params = { sortBy };
      if (filterStatus) params.status = filterStatus;
      if (searchTerm) params.search = searchTerm;

      const res = await axios.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      console.log("Fetched Tasks:", res.data);

      // ✅ Sorting by Priority (High → Medium → Low) OR Deadline (Earliest First)
      const sortedTasks = res.data.data.sort((a, b) => {
        if (sortBy === "priority") {
          const priorityOrder = { high: 1, medium: 2, low: 3 };
          return (
            (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2)
          );
        } else if (sortBy === "deadline") {
          return new Date(a.deadline) - new Date(b.deadline);
        }
        return 0;
      });

      setTasks(sortedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to fetch tasks. Please try again.");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to create a task.");
        return;
      }

      await axios.post("/tasks", newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNewTask({
        title: "",
        description: "",
        deadline: "",
        priority: "medium",
      });
      fetchTasks();
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2>Task List</h2>

      {/* ✅ Create Task Form */}
      <form onSubmit={handleCreateTask} className="task-form">
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={newTask.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Task Description"
          value={newTask.description}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="deadline"
          value={newTask.deadline}
          onChange={handleChange}
          required
        />

        <select
          name="priority"
          value={newTask.priority}
          onChange={handleChange}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button type="submit" className="add-task-btn">
          Add Task
        </button>
      </form>

      {/* ✅ Filtering UI */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          onChange={(e) => setFilterStatus(e.target.value)}
          value={filterStatus}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
          <option value="priority">Sort by Priority</option>
          <option value="deadline">Sort by Deadline</option>
        </select>
      </div>

      {loading && <p>Loading tasks...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="task-list">
        {tasks.length > 0
          ? tasks.map((task) => (
              <TaskItem key={task._id} task={task} fetchTasks={fetchTasks} />
            ))
          : !loading && <p>No tasks found.</p>}
      </div>
    </div>
  );
};

export default TaskList;
