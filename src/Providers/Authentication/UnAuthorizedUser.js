import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./Authentication";

const UnAuthorizedUser = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/unauthorized" />;
  }
  if (user.user_metadata.role !== "admin") {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default UnAuthorizedUser;
