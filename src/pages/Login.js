// pages/Login.js
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/Usercontext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/Login.css"; // Import the CSS file for Login

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate("/welcome"); // Navigate to welcome page after successful login
      toast.success("Login successful");
    } catch (err) {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <ToastContainer />
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
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
      </form>
    </div>
  );
};

export default Login;
