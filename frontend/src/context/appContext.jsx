// import { createContext, useState, useEffect } from "react";
// import axios from "axios";

// export const AppContent = createContext();

// export const AppContextProvider = (props) => {
//   const backendUrl = "http://localhost:3000/";
//   const [isLoggedin, setIsLoggedIn] = useState(
//     JSON.parse(localStorage.getItem("isLoggedin")) || false
//   );
//   const [userData, setUserData] = useState(
//     JSON.parse(localStorage.getItem("userData")) || null
//   );
//   const getUserData = async()=>{
//     try{
//     const {data} = await axios.get(`${backendUrl}/api/get-me`)
//     if (data.success) {
//       setUserData(data.userData);
//       localStorage.setItem("userData", JSON.stringify(data.userData));
//     } else {
//       handleLogout(); 
//     }
//   } catch (error) {
//     console.error(error.message);
//   }
// }

//   const getAuthState = async () => {
//     try {
//       const { data } = await axios.get(`${backendUrl}/api/user/isauthenticated`);
//       if (data.success) {
//         setIsLoggedIn(true);
//         getUserData();

//         localStorage.setItem("isLoggedin", JSON.stringify(true));
//       } else {
//         handleLogout(); // Handle logout if not authenticated
//       }
//     } catch (error) {
//       console.error(error.message);
//       handleLogout(); // Logout if an error occurs
//     }
//   };

//   useEffect(() => {
//     getAuthState();
//   }, []);

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setUserData(null);
//     localStorage.removeItem("isLoggedin");
//     localStorage.removeItem("userData");
//   };

//   const value = {
//     backendUrl,
//     isLoggedin,
//     setIsLoggedIn,
//     userData,
//     setUserData,
//     handleLogout,
//     getUserData,
//   };

//   return (
//     <AppContent.Provider value={value}>
//       {props.children}
//     </AppContent.Provider>
//   );
// };
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = "http://localhost:3000/";
  const [isLoggedin, setIsLoggedIn] = useState(false); // State for login status
  const [userData, setUserData] = useState(null); // State for user data

  // Fetch user data if authenticated
  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/get-me`);
      if (data.success) {
        setUserData(data.userData);
        setIsLoggedIn(true);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  // Check authentication state
  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/isauthenticated`);
      if (data.success) {
        setIsLoggedIn(true);
        getUserData();
      } else {
        handleLogout(); // Logout if not authenticated
      }
    } catch (error) {
      console.error("Error checking authentication:", error.message);
      handleLogout();
    }
  };

  // Handle user logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
  };

  // Run authentication check on component mount
  useEffect(() => {
    getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedIn,
    userData,
    setUserData,
    handleLogout,
    getUserData,
  };

  return (
    <AppContent.Provider value={value}>
      {props.children}
    </AppContent.Provider>
  );
};
