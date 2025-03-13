const Task = require("../models/taskModel");

// ✅ Fetch tasks with filtering, searching, and sorting
const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    let { status, search, sortBy } = req.query;

    let query = { user: userId };

    // ✅ Filter by status
    if (status) {
      query.status = status.toLowerCase();
    }

    // ✅ Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // ✅ Custom sorting: Assign numerical values to priority levels
    const priorityOrder = { high: 1, medium: 2, low: 3 };

    let tasks = await Task.find(query);

    // ✅ Ensure tasks are sorted manually in JavaScript
    tasks = tasks.sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );

    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ✅ Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description, deadline, priority } = req.body;
    const userId = req.user?.id; // Ensure the user ID is extracted properly

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID found." });
    }

    if (!title || !deadline) {
      return res
        .status(400)
        .json({ message: "Title and deadline are required." });
    }

    const task = new Task({
      title,
      description,
      deadline,
      priority: priority || "medium", // ✅ Default priority if missing
      user: userId, // ✅ Ensure task is linked to the logged-in user
    });

    await task.save();
    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    console.error("❌ Error creating task:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// ✅ Update Task (including priority)
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const task = await Task.findOneAndUpdate(
      { _id: id, user: userId },
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

// ✅ Delete Task
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
