import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// === COMPONENTS ===
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import ProfilePage from "./components/ProfilePage";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard from "./components/RoleGuard";
import Sidebar from "./components/Sidebar";

// === PAGES ===
import UserManagement from "./pages/UserManagement";
import ModeratorPanel from "./pages/ModeratorPanel";
import AdminDashboard from "./components/AdminDashboard";
import ActivityLogs from "./pages/ActivityLogs";

function App() {
  const [user, setUser] = useState(() => {
    const localUser = localStorage.getItem("user");
    if (!localUser || localUser === "undefined" || localUser === "null") return null;
    try {
      return JSON.parse(localUser);
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("accessToken")); // ← DÙNG accessToken

  // === XỬ LÝ LOGIN ===
  const handleLoginSuccess = (loggedInUser, accessToken) => {
    setIsAuthenticated(true);
    setUser(loggedInUser);
    localStorage.setItem("accessToken", accessToken); // ← LƯU accessToken
    localStorage.setItem("user", JSON.stringify(loggedInUser));
  };

  // === XỬ LÝ LOGOUT ===
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  // === CẬP NHẬT USER ===
  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // === TẢI USER TỪ DB KHI CÓ TOKEN ===
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token || token === "undefined" || token === "null") return;

      try {
        const res = await fetch("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data) {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        }
      } catch (err) {
        console.error("Lỗi lấy user từ DB:", err);
      }
    };

    if (isAuthenticated) fetchUser();
  }, [isAuthenticated]);

  return (
    <Router>
      <Routes>
        {/* ==================== PUBLIC ROUTES ==================== */}
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ==================== PROTECTED ROUTES ==================== */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} user={user} />}>
          <Route path="/" element={<Navigate to="/profile" replace />} />

          {/* PROFILE – TẤT CẢ USER */}
          <Route
            path="/profile"
            element={
              user?.role === 'admin' ? (
                <div style={{ display: 'flex' }}>
                  <Sidebar onLogout={handleLogout} />
                  <div style={{ marginLeft: '250px', width: '100%', padding: '20px' }}>
                    <ProfilePage
                      key={user?._id}
                      user={user}
                      onLogout={handleLogout}
                      onUpdate={handleUpdateUser}
                    />
                  </div>
                </div>
              ) : (
                <ProfilePage
                  key={user?._id}
                  user={user}
                  onLogout={handleLogout}
                  onUpdate={handleUpdateUser}
                />
              )
            }
          />

          {/* USER MANAGEMENT – MOD + ADMIN */}
          <Route
            path="/users"
            element={
              <RoleGuard allowedRoles={["moderator", "admin"]}>
                <div style={{ display: 'flex' }}>
                  <Sidebar onLogout={handleLogout} />
                  <div style={{ marginLeft: '250px', width: '100%', padding: '20px' }}>
                    <UserManagement />
                  </div>
                </div>
              </RoleGuard>
            }
          />

          {/* MODERATOR PANEL – CHỈ MOD */}
          <Route
            path="/mod"
            element={
              <RoleGuard allowedRoles={["moderator"]}>
                <div style={{ display: 'flex' }}>
                  <Sidebar onLogout={handleLogout} />
                  <div style={{ marginLeft: '250px', width: '100%', padding: '20px' }}>
                    <ModeratorPanel />
                  </div>
                </div>
              </RoleGuard>
            }
          />

          {/* ADMIN DASHBOARD – CHỈ ADMIN */}
          <Route
            path="/admin"
            element={
              <RoleGuard allowedRoles={["admin"]}>
                <div style={{ display: 'flex' }}>
                  <Sidebar onLogout={handleLogout} />
                  <div style={{ marginLeft: '250px', width: '100%', padding: '20px' }}>
                    {console.log("Rendering AdminDashboard in App.js")}
                    <AdminDashboard />
                  </div>
                </div>
              </RoleGuard>
            }
          />

          {/* ACTIVITY LOGS – CHỈ ADMIN */}
          <Route
            path="/logs"
            element={
              <RoleGuard allowedRoles={["admin"]}>
                <div style={{ display: 'flex' }}>
                  <Sidebar onLogout={handleLogout} />
                  <div style={{ marginLeft: '250px', width: '100%', padding: '20px' }}>
                    <ActivityLogs />
                  </div>
                </div>
              </RoleGuard>
            }
          />
        </Route>

        {/* ==================== 404 ==================== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;