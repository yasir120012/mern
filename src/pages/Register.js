// pages/Register.js
import React, { useContext, useState } from "react";
import UserContext from "../context/Usercontext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/Register.css"; // Import the CSS file

function Register() {
  const { register } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [degree, setDegree] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const userData = { username, email, password, degree };
    try {
      await register(userData);
      navigate("/welcome");
      toast.success("Registration successful");
    } catch (error) {
      toast.error("Registration failed");
      console.error(error);
    }
  };

  return (
    <div className="register-container">
      <ToastContainer />
      <h2>Register Page</h2>
      <form className="register-form" onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
        <select
          value={degree}
          onChange={(e) => setDegree(e.target.value)}
          required
        >
          <option value="">Select Degree</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Mechanical Engineering">Mechanical Engineering</option>
          <option value="Civil Engineering">Civil Engineering</option>
          <option value="Electrical Engineering">Electrical Engineering</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
