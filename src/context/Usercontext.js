import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const response = await axios.get("http://localhost:5000/api/auth/me");
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching user data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const register = async (userData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        userData
      );
      setUser(response.data.user);
      localStorage.setItem("token", response.data.token);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;
      navigate("/welcome");
    } catch (error) {
      console.error("Registration error:", error);
      throw error; // Re-throw to handle it in the component
    }
  };

  const login = async (userData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        userData
      );
      setUser(response.data.user);
      localStorage.setItem("token", response.data.token);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.token}`;
      navigate("/welcome");
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Re-throw to handle it in the component
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  return (
    <UserContext.Provider value={{ user, register, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
