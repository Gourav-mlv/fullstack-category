import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const res = await axios.post("/auth/login", credentials);
      localStorage.setItem("token", res.data.token);
      navigate("/category");
    } catch {
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={credentials.username}
          onChange={handleChange}
          required
          aria-label="Username"
        />
        <br></br>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          required
          aria-label="Password"
        />

        <button type="submit" disabled={!credentials.username || !credentials.password}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
