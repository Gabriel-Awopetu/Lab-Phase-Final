const express = require("express");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Secure Routes: User must be authenticated
router.post("/", authMiddleware, createTask); // Create a task
router.get("/", authMiddleware, getTasks); // Get tasks
router.put("/:id", authMiddleware, updateTask); // Update task
router.delete("/:id", authMiddleware, deleteTask); // Delete task

module.exports = router;
