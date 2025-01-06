// // import Main from './components/main';
// import './App.css'
// import Main from './components/main'
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Login from './components/login';
// import ResetPassword from './components/ResetPassword';
// import { Navigate } from "react-router-dom";
// import {ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const ProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem("token");
//   return token ? children : <Navigate to="/login" />;
// };

// const App = () => {
//   return (
//     <Router>
//       <ToastContainer />
//         <Routes>
//           <Route
//             path="/"
//             element={
//               <ProtectedRoute>
//                 <Main />
//               </ProtectedRoute>
//             }
//           />
//           <Route path="/login" element={<Login />} />
//           <Route path="/reset-password" element={<ResetPassword />} />
//         </Routes>
//     </Router>
//   );
// };

//   export default App;

import React from "react";
import "./App.css";
import Main from "./components/main";
import Login from "./components/login";
import ResetPassword from "./components/ResetPassword";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoutes"; // Import the updated ProtectedRoute
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/navbar";
import EmailVerify from "./components/EmailVerify";

const App = () => {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Main />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
};

export default App;
