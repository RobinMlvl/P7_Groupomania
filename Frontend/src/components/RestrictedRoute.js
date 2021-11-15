import React from "react";
import { Navigate } from "react-router-dom";

function RestrictedRoute({ children }) {
  let token = localStorage.getItem("token");

  return !token ? children : <Navigate to="/feed" />;
}

export default RestrictedRoute;
