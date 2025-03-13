import React, { useState } from "react";
import axios from "../api/axios"; // Ensure correct path

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/auth/login", { email, password });

      const token = res.data.token; // Get token from response
      localStorage.setItem("token", token); // Store token in localStorage
      console.log("Login Successful! Token:", token);

      if (onLogin) onLogin(); // Callback to update UI
    } catch (error) {
      console.error("Login Failed:", error);
      setError(error.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default LoginForm;
