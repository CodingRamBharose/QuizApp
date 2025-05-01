import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Check if token exists and not expired
        if (token) {
          // Set auth header for all requests
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Check token expiration
          const decoded = jwt_decode(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp < currentTime) {
            // Token expired
            localStorage.removeItem("token");
            setToken(null);
            setCurrentUser(null);
            setIsAuthenticated(false);
            delete axios.defaults.headers.common["Authorization"];
          } else {
            // Get user info
            const response = await axios.get("/api/auth/me");
            setCurrentUser(response.data.data);
            setIsAuthenticated(true);
          }
        }
      } catch (err) {
        localStorage.removeItem("token");
        setToken(null);
        setCurrentUser(null);
        setIsAuthenticated(false);
        delete axios.defaults.headers.common["Authorization"];
        setError("Authentication failed. Please log in again.");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  // Register user
  const register = async (email, password) => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.post("/api/auth/register", {
        email,
        password,
      });
      const { token, user } = response.data;

      // Save token to local storage
      localStorage.setItem("token", token);
      setToken(token);

      // Set user
      setCurrentUser(user);
      setIsAuthenticated(true);

      // Set auth header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return { success: true };
    } catch (err) {
      setError(
        err.response?.data?.error || "Registration failed. Please try again."
      );
      return {
        success: false,
        error: err.response?.data?.error || "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.post("/api/auth/login", { email, password });
      const { token, user } = response.data;

      // Save token to local storage
      localStorage.setItem("token", token);
      setToken(token);

      // Set user
      setCurrentUser(user);
      setIsAuthenticated(true);

      // Set auth header
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return { success: true };
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Login failed. Please check your credentials."
      );
      return {
        success: false,
        error: err.response?.data?.error || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    // Remove token from local storage
    localStorage.removeItem("token");

    // Remove auth header
    delete axios.defaults.headers.common["Authorization"];

    // Reset state
    setToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
