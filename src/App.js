// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./context/Usercontext"; // Import UserProvider
import Home from "./components/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Welcome from "./components/Welcome";

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/welcome" element={<Welcome />} />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
