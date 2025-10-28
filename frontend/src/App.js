import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import ProfilePage from "./components/ProfilePage";

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
        <Route path="/" element={<Navigate to={isAuthenticated ? "/profile" : "/login"} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <ProfilePage
                user={user}
                onLogout={handleLogout}
                onUpdate={handleUpdateUser} // truyền hàm cập nhật user
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
