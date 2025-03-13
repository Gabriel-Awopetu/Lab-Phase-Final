import React, { useState } from "react";
import axios from "../api/axios";

const TaskItem = ({ task, fetchTasks }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });

  const handleChange = (e) => {
    setEditedTask({ ...editedTask, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/tasks/${task._id}`, editedTask);
      setIsEditing(false);
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axios.delete(`/tasks/${task._id}`);
        fetchTasks();
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  return (
    <div className={`task-item ${task.priority}`}>
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

          <select
            name="status"
            value={editedTask.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            name="priority"
            value={editedTask.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
          <p>Status: {task.status}</p>
          <p className="priority-label">Priority: {task.priority}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={handleDelete} className="delete-btn">
            Delete
          </button>
        </>
      )}
    </div>
  );
};

export default TaskItem;
