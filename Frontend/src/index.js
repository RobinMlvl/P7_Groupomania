import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import App from "./page/App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Feed from "./page/Feed";
import PrivateRoute from "./components/PrivateRoute";
import RestrictedRoute from "./components/RestrictedRoute";
import Auth from "./page/Authentification/Auth";
import Profile from "./page/Profile";

ReactDOM.render(
  <BrowserRouter>
    <React.StrictMode>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/auth"
          element={
            <RestrictedRoute>
              <Auth />
            </RestrictedRoute>
          }
        />
        <Route
          path="/feed"
          element={
            <PrivateRoute>
              <Feed />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </React.StrictMode>
  </BrowserRouter>,
  document.getElementById("root")
);
