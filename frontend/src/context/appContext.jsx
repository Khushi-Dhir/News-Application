// import { createContext, useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";

// export const AppContent = createContext();

// export const AppContextProvider = (props) => {
//   const backendUrl = "http://localhost:3000";
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userData, setUserData] = useState(false);

//   const getAuthState = async () => {
//     try {
//       const { data } = await axios.get(backendUrl + "/api/user/isauthenticated", { withCredentials: true });
//       if (data.success) {
//         setIsLoggedIn(true);
//         getUserData();
//       } else {
//         setIsLoggedIn(false);
//         setUserData(false);
//         toast.error("You are not logged in");
//       }
//     } catch (err) {
//       console.error(err.message);
//     }
//   };

//   const getUserData = async () => {
//     try {
//       const { data } = await axios.get(backendUrl + "/api/get-me", { withCredentials: true });
//       if (data.success) {
//         setUserData(data.userData);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (err) {
//       console.error(err.message);
//     }
//   };

//   useEffect(() => {
//     getAuthState();
//   }, []);

//   const value = {
//     backendUrl,
//     isLoggedIn,
//     setIsLoggedIn,
//     userData,
//     setUserData,
//     getUserData,
//   };

//   return <AppContent.Provider value={value}>{props.children}</AppContent.Provider>;
// };
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContent = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = "http://localhost:3000";
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/isauthenticated`, {
        withCredentials: true,
      });

      if (data.success) {
        setIsLoggedIn(true);
        getUserData();
      } else {
        setIsLoggedIn(false);
        setUserData(null);
        toast.error("You are not logged in.");
      }
    } catch (error) {
      console.error("Authentication check failed:", error.message);
      setIsLoggedIn(false);
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/get-me`, {
        withCredentials: true,
      });

      if (data.success) {
        setUserData(data.userData);
      } else {
        setUserData(null);
        toast.error("Failed to retrieve user data.");
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error.message);
    }
  };

  const logOut = async () => {
    try {
      await axios.post(`${backendUrl}/api/logout`, {}, { withCredentials: true });
      setIsLoggedIn(false);
      setUserData(null);
      toast.success("You have been logged out.");
    } catch (error) {
      console.error("Logout failed:", error.message);
      toast.error("Failed to log out. Please try again.");
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
    logOut,
  };

  return <AppContent.Provider value={value}>{children}</AppContent.Provider>;
};
