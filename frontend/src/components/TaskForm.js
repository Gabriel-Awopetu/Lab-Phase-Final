import { useState } from "react";
import axios from "../api/axios"; // Ensure this file exists

const TaskForm = ({ fetchTasks }) => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    deadline: "",
    status: "pending",
  });

  const [error, setError] = useState(""); // ✅ State to store errors

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state

    try {
      const token = localStorage.getItem("token"); // ✅ Get JWT token

      if (!token) {
        setError("No token found. Please log in again.");
        console.error("No token found in local storage.");
        return;
      }

      console.log("Sending Token:", token); // ✅ Debugging log

      const response = await axios.post("/tasks", task, {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Send token in headers
      });

      console.log("Task Created:", response.data); // ✅ Debugging log

      setTask({ title: "", description: "", deadline: "", status: "pending" });
      fetchTasks(); // ✅ Refresh task list after successful submission
    } catch (error) {
      console.error(
        "Error creating task:",
        error.response?.data || error.message
      );

      setError(error.response?.data || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Task Title"
        value={task.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Task Description"
        value={task.description}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="deadline"
        value={task.deadline}
        onChange={handleChange}
        required
      />
      <button type="submit">Add Task</button>

      {/* Display errors if any */}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default TaskForm;
