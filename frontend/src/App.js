import React, { useState, useEffect } from "react";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between register & login

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <div>
      <h1>Task Management App</h1>

      {!isAuthenticated ? (
        <>
          {isRegistering ? (
            <>
              <RegisterForm onRegister={() => setIsRegistering(false)} />
              <p>
                Already have an account?{" "}
                <button onClick={() => setIsRegistering(false)}>Login</button>
              </p>
            </>
          ) : (
            <>
              <LoginForm onLogin={handleLogin} />
              <p>
                Don't have an account?{" "}
                <button onClick={() => setIsRegistering(true)}>Register</button>
              </p>
            </>
          )}
        </>
      ) : (
        <>
          <button onClick={handleLogout}>Logout</button>

          <TaskList />
        </>
      )}
    </div>
  );
};

export default App;
