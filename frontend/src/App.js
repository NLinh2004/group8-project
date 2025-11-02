// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import ProfilePage from "./components/ProfilePage";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const [user, setUser] = useState(() => {
    const localUser = localStorage.getItem("user");
    return localUser ? JSON.parse(localUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  // Khi login thành công
  const handleLoginSuccess = (loggedInUser, token) => {
    setIsAuthenticated(true);
    setUser(loggedInUser);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
  };

  // Khi logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  // Khi update thông tin profile
  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <Router>
      <Routes>
        {/* Trang chủ */}
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/profile" : "/login"} />}
        />

        {/* Auth */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />

        {/* Profile - chỉ user đã login */}
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <ProfilePage
                user={user}
                onLogout={handleLogout}
                onUpdate={handleUpdateUser}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* ADMIN DASHBOARD - CHỈ ADMIN MỚI VÀO ĐƯỢC */}
        <Route
          path="/admin"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/profile" replace />
            )
          }
        />

        {/* 404 - Không tìm thấy trang */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;