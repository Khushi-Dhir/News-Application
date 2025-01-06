import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AppContent } from "../context/appContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedin, setIsLoggedIn } = useContext(AppContent);

  useEffect(() => {
    const loggedInState = JSON.parse(localStorage.getItem("isLoggedin"));
    if (loggedInState) setIsLoggedIn(true);
  }, [setIsLoggedIn]);

  return isLoggedin ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

