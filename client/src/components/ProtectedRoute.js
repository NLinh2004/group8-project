// src/components/ProtectedRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated, user }) => {
  const { accessToken } = useSelector((state) => state.auth); // ← BỔ SUNG: DÙNG REDUX

  const authenticated = isAuthenticated || !!accessToken;

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;