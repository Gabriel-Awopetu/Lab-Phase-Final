import React, { useEffect, useState } from "react";
import axios from "../api/axios"; // ✅ Ensure correct path
import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";

const TaskList = () => {
  const [tasks, setTasks] = useState([]); // Holds tasks
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

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

      const res = await axios.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Fetched Tasks:", res.data);
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

      {loading && <p>Loading tasks...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {tasks.length > 0
        ? tasks.map((task) => (
            <TaskItem key={task._id} task={task} fetchTasks={fetchTasks} />
          ))
        : !loading && <p>No tasks found.</p>}
    </div>
  );
};

export default TaskList;
