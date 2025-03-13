const Task = require("../models/taskModel");

// ✅ Fetch tasks for logged-in user
const getTasks = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from token
    const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 }); // Fetch user-specific tasks
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ✅ Create a task for the authenticated user
const createTask = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    const userId = req.user.id; // Ensure the request has a valid user

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID found." });
    }

    const task = new Task({
      title,
      description,
      deadline,
      user: userId, // Assign task to logged-in user
    });

    await task.save();
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Update Task (Only the owner can update)
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await Task.findOneAndUpdate(
      { _id: id, user: userId }, // Ensure task belongs to user
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });
    }

    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Delete Task (Only the owner can delete)
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await Task.findOneAndDelete({ _id: id, user: userId });

    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found or unauthorized" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
