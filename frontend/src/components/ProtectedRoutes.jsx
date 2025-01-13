// import React, { useContext, useEffect } from "react";
// import { Navigate } from "react-router-dom";
// import { AppContent } from "../context/appContext";

// const ProtectedRoute = ({ children }) => {
//   const { isLoggedIn, setIsLoggedIn } = useContext(AppContent);

//   useEffect(() => {
//     const token = localStorage.getItem("auth_token");
//     if (token) {
//       setIsLoggedIn(true);
//     } else {
//       setIsLoggedIn(false);
//     }
//   }, [setIsLoggedIn]);

//   return isLoggedIn ? children : <Navigate to="/login" />;
// };

// export default ProtectedRoute;
import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AppContent } from "../context/appContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AppContent);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (token) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error verifying authentication:", error.message);
        setIsLoggedIn(false);
      }
    };

    checkAuthState();
  }, [setIsLoggedIn]);

  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
