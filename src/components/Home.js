import React from "react";
import { Link } from "react-router-dom";
import "../css/Home.css";

const Home = () => (
  <div className="home-container">
    <h1>Welcome to the Registration Process</h1>
    <div className="home-buttons">
      <Link to="/register" className="home-button">
        Register as New User
      </Link>
      <Link to="/login" className="home-button">
        Login
      </Link>
    </div>
  </div>
);

export default Home;
