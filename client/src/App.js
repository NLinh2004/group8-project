import React, { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "./store/authSlice";

// === COMPONENTS ===
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import ProfilePage from "./components/ProfilePage";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleGuard from "./components/RoleGuard";

// === PAGES ===
import UserManagement from "./pages/UserManagement";
import ModeratorPanel from "./pages/ModeratorPanel";
import AdminDashboard from "./components/AdminDashboard";
import ActivityLogs from "./pages/ActivityLogs";

// === BỔ SUNG: DÙNG AXIOS INSTANCE (THAY localhost:5000) ===
import api from "./api/axiosInstance";

function App() {
  const dispatch = useDispatch();
  const { accessToken: reduxToken } = useSelector((state) => state.auth); // ← BỔ SUNG: DÙNG REDUX

  const [user, setUser] = useState(() => {
    const localUser = localStorage.getItem("user");
    if (!localUser || localUser === "undefined" || localUser === "null") return null;
    try {
      return JSON.parse(localUser);
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("accessToken"));

  // === XỬ LÝ LOGIN ===
  const handleLoginSuccess = (loggedInUser, accessToken) => {
    setIsAuthenticated(true);
    setUser(loggedInUser);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    dispatch(setCredentials({ user: loggedInUser, accessToken }));
  };

  // === XỬ LÝ LOGOUT ===
  const handleLogout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    dispatch(setCredentials({ user: null, accessToken: null }));
  }, [dispatch]);

  // === CẬP NHẬT USER ===
  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // === BỔ SUNG: TẢI USER TỪ API (THAY localhost:5000) ===
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token || token === "undefined" || token === "null") return;

      try {
        const res = await api.get("/profile"); // ← DÙNG api → tự động baseURL
        const data = res.data;
        if (data) {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
          dispatch(setCredentials({ user: data, accessToken: token }));
        } else {
          handleLogout();
        }
      } catch (err) {
        console.error("Lỗi lấy user từ DB:", err);
        handleLogout();
      }
    };

    if (isAuthenticated || reduxToken) fetchUser();
  }, [isAuthenticated, reduxToken, dispatch, handleLogout]);

  return (
    <Router>
      <Routes>
        {/* ==================== PUBLIC ROUTES ==================== */}
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ==================== PROTECTED ROUTES ==================== */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated || !!reduxToken} user={user} />}>

          <Route
            path="/profile"
            element={
              <ProfilePage
                key={user?._id}
                user={user}
                onLogout={handleLogout}
                onUpdate={handleUpdateUser}
              />
            }
          />

          <Route
            path="/admin/users"
            element={
              <RoleGuard allowedRoles={["admin"]}>
                <UserManagement />
              </RoleGuard>
            }
          />

          <Route
            path="/mod"
            element={
              <RoleGuard allowedRoles={["moderator"]}>
                <ModeratorPanel />
              </RoleGuard>
            }
          />

          <Route
            path="/admin"
            element={
              (isAuthenticated || reduxToken) && user?.role === "admin" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/profile" replace />
              )
            }
          />

          <Route
            path="/logs"
            element={
              (isAuthenticated || reduxToken) && user?.role === "admin" ? (
                <ActivityLogs />
              ) : (
                <Navigate to="/profile" replace />
              )
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
