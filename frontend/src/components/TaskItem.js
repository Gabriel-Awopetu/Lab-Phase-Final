import React, { useState } from "react";
import axios from "../api/axios"; // Use the correct path

const TaskItem = ({ task, fetchTasks }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setEditedTask({ ...editedTask, [e.target.name]: e.target.value });
  };

  // ✅ Handle Task Update
  const handleUpdate = async () => {
    try {
      const res = await axios.put(`/tasks/${task._id}`, editedTask);
      console.log("Task Updated:", res.data);
      setIsEditing(false);
      fetchTasks(); // Refresh task list
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // ✅ Handle Task Delete
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`/tasks/${task._id}`);
        fetchTasks(); // Refresh task list
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  return (
    <div>
      {isEditing ? (
        <>
          <input
            type="text"
            name="title"
            value={editedTask.title}
            onChange={handleChange}
          />
          <textarea
            name="description"
            value={editedTask.description}
            onChange={handleChange}
          />
          <input
            type="date"
            name="deadline"
            value={editedTask.deadline}
            onChange={handleChange}
          />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
          <p>Status: {task.status}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete} style={{ color: "red" }}>
            Delete
          </button>
        </>
      )}
    </div>
  );
};

export default TaskItem;
