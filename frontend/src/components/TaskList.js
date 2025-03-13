import React, { useEffect, useState } from "react";
import axios from "axios"; // ✅ Import axios

import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";

const TaskList = () => {
  const [tasks, setTasks] = useState([]); // Initialize tasks as an empty array
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track API errors

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Ensure token is sent
      });

      console.log("API Response:", res.data); // Debugging
      setTasks(res.data.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to fetch tasks. Please try again.");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <TaskForm fetchTasks={fetchTasks} />
      <h2>Task List</h2>

      {/* Show Loading */}
      {loading && <p>Loading tasks...</p>}

      {/* Show Errors */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Show Tasks */}
      {tasks.length > 0
        ? tasks.map((task) => <TaskItem key={task._id} task={task} />)
        : !loading && <p>No tasks found.</p>}
    </div>
  );
};

export default TaskList;
