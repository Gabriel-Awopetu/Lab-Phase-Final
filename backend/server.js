const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("Task Management API Running");
});

app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(
      `✅ Route registered: ${middleware.route.stack[0].method.toUpperCase()} ${
        middleware.route.path
      }`
    );
  }
});

// Use environment variable for PORT or default to 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await // Connect to MongoDB
    connectDB();
    console.log(`🚀 Server running on port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
});
