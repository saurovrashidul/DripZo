import React from "react";
import { Navigate, Outlet } from "react-router";
import useAuth from "../contexts/useAuth"; // Make sure you have a useAuth hook

const PrivateRoute = () => {
  const { user } = useAuth(); // user should be null if not logged in

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the child routes
  return <Outlet />;
};

export default PrivateRoute;
