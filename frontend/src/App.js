// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import ProfilePage from "./components/ProfilePage";
import AdminDashboard from "./components/AdminDashboard";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

function App() {
  const [user, setUser] = useState(() => {
    const localUser = localStorage.getItem("user");
    return localUser ? JSON.parse(localUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  const handleLoginSuccess = (loggedInUser, token) => {
    setIsAuthenticated(true);
    setUser(loggedInUser);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser); // CẬP NHẬT user state
    localStorage.setItem("user", JSON.stringify(updatedUser)); // CẬP NHẬT localStorage
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? "/profile" : "/login"} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Profile – THÊM key={user?._id} ĐỂ FORCE RE-RENDER */}
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <ProfilePage
                key={user?._id} // THAY ĐỔI → component mount lại
                user={user}
                onLogout={handleLogout}
                onUpdate={handleUpdateUser}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;