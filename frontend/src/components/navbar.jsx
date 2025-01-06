// import React, { useState, useContext } from 'react';
// import { AppContent } from '../context/appContext';
// import { useNavigate } from 'react-router-dom';
// import gsap from 'gsap';

// const Navbar = ({ onSearch, onCategorySelect }) => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const { userData, setIsLoggedIn,backendUrl, setUserData } = useContext(AppContent);
//   const navigate = useNavigate();

//   const handleSearch = (e) => {
//     e.preventDefault();
//     onSearch(searchQuery.trim());
//   };

//   const handleCategoryClick = (category) => {
//     onCategorySelect(category);
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     localStorage.clear();
//     navigate('/login');
//   };
//   const handleVerifying = () =>{

//   }

//   // GSAP dropdown animation
//   const toggleDropdown = () => {
//     setDropdownOpen(!dropdownOpen);
//     const dropdown = document.getElementById('userDropdownMenu');
//     if (!dropdownOpen) {
//       gsap.fromTo(
//         dropdown,
//         { opacity: 0, y: -10 },
//         { opacity: 1, y: 0, duration: 0.3 }
//       );
//     }
//   };

//   return (
//     <header style={{ backgroundColor: '#f8f9fa', boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)' }}>
//       <div style={{ padding: '1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="container">
//         <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0d6efd' }}>NewsHub</h1>
//         <nav style={{ display: 'flex', alignItems: 'center' }}>
//           {/* Search Form */}
//           <form style={{ display: 'flex', marginRight: '1rem' }} onSubmit={handleSearch}>
//             <input
//               type="text"
//               placeholder="Search news..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               style={{
//                 padding: '0.5rem 1rem',
//                 borderRadius: '30px',
//                 border: '1px solid #ccc',
//                 outline: 'none',
//                 transition: 'all 0.3s ease',
//               }}
//             />
//             <button style={{ marginLeft: '0.5rem', padding: '0.5rem 1rem', borderRadius: '30px', backgroundColor: '#0d6efd', color: '#fff', border: 'none' }}>
//               Search
//             </button>
//           </form>

//           {/* User Dropdown */}
//           <div style={{ position: 'relative' }}>
//             <button
//               onClick={toggleDropdown}
//               style={{
//                 border: '1px solid #0d6efd',
//                 backgroundColor: 'transparent',
//                 color: '#0d6efd',
//                 borderRadius: '30px',
//                 padding: '0.5rem 1rem',
//                 cursor: 'pointer',
//               }}
//             >
//               {userData ? <div>{userData.name[0].toUppercase()}</div> : 'User'}
//             </button>
//             <ul
//               id="userDropdownMenu"
//               style={{
//                 position: 'absolute',
//                 top: '100%',
//                 left: 0,
//                 display: dropdownOpen ? 'block' : 'none',
//                 backgroundColor: '#fff',
//                 boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//                 borderRadius: '10px',
//                 overflow: 'hidden',
//                 listStyle: 'none',
//                 margin: 0,
//                 padding: 0,
//                 zIndex: 1000,
//               }}
//             >
//               {userData.isVerified && <li>
//                 <button
//                   onClick={handleVerifying}
//                   style={{
//                     width: '100%',
//                     textAlign: 'left',
//                     padding: '0.5rem 1rem',
//                     backgroundColor: 'transparent',
//                     color: '#dc3545',
//                     border: 'none',
//                     cursor: 'pointer',
//                   }}
//                 >
//                   Verify-Email
//                 </button>
//               </li> }
              
//               <li>
//                 <button
//                   onClick={handleLogout}
//                   style={{
//                     width: '100%',
//                     textAlign: 'left',
//                     padding: '0.5rem 1rem',
//                     backgroundColor: 'transparent',
//                     color: '#dc3545',
//                     border: 'none',
//                     cursor: 'pointer',
//                   }}
//                 >
//                   Logout
//                 </button>
//               </li>
//             </ul>
//           </div>
//         </nav>
//       </div>

//       {/* Categories */}
//       <div style={{ backgroundColor: '#0d6efd', color: '#fff', padding: '0.5rem 0' }}>
//         <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }} className="container">
//           {['Politics', 'Business', 'Tech', 'Arts', 'Science', 'Health', 'Sports','All'].map((category) => (
//             <button
//               key={category}
//               onClick={() => handleCategoryClick(category)}
//               style={{
//                 border: '1px solid #fff',
//                 backgroundColor: 'transparent',
//                 color: '#fff',
//                 borderRadius: '30px',
//                 padding: '0.5rem 1rem',
//                 cursor: 'pointer',
//                 transition: 'all 0.3s ease',
//               }}
//             >
//               {category}
//             </button>
//           ))}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;
import React, { useState, useContext } from 'react';
import { AppContent } from '../context/appContext';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import axios from 'axios';

const Navbar = ({ onSearch, onCategorySelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { userData, setIsLoggedIn,backendUrl,setUserData } = useContext(AppContent);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery.trim());
  };

  const handleCategoryClick = (category) => {
    onCategorySelect(category);
  };
  
  const handleLogout = async () => {
    try{
      axios.defaults.withCredentials = true;
      const {data} = await axios.post(backendUrl+'/user/logout')
      data.success && setIsLoggedIn(false) 
      // data.success && setUserData(false);
      navigate('/login');
    }
    catch(err){
      console.error(err.message)
    }
  };

  const handleVerifying = () => {
    // Verification logic
  };

  // GSAP dropdown animation
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    const dropdown = document.getElementById('userDropdownMenu');
    if (!dropdownOpen) {
      gsap.fromTo(
        dropdown,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3 }
      );
    }
  };

  return (
    <header
      style={{
        backgroundColor: '#f8f9fa',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div
        style={{
          padding: '1rem 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        className="container"
      >
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0d6efd' }}>
          NewsHub
        </h1>
        <nav style={{ display: 'flex', alignItems: 'center' }}>
          {/* Search Form */}
          <form
            style={{ display: 'flex', marginRight: '1rem' }}
            onSubmit={handleSearch}
          >
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '30px',
                border: '1px solid #ccc',
                outline: 'none',
                transition: 'all 0.3s ease',
              }}
            />
            <button
              style={{
                marginLeft: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '30px',
                backgroundColor: '#0d6efd',
                color: '#fff',
                border: 'none',
              }}
            >
              Search
            </button>
          </form>

          {/* User Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={toggleDropdown}
              style={{
                border: '1px solid #0d6efd',
                backgroundColor: 'transparent',
                color: '#0d6efd',
                borderRadius: '30px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
              }}
            >
              {userData ? userData.name[0].toUpperCase() : 'User'}
            </button>
            <ul
              id="userDropdownMenu"
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                display: dropdownOpen ? 'block' : 'none',
                backgroundColor: '#fff',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                borderRadius: '10px',
                overflow: 'hidden',
                listStyle: 'none',
                margin: 0,
                padding: 0,
                zIndex: 1000,
              }}
            >

                <li>
                  <button
                    onClick={handleVerifying}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.5rem 1rem',
                      backgroundColor: 'transparent',
                      color: '#dc3545',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Verify-Email
                  </button>
                </li>

              <li>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.5rem 1rem',
                    backgroundColor: 'transparent',
                    color: '#dc3545',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Categories */}
      <div
        style={{ backgroundColor: '#0d6efd', color: '#fff', padding: '0.5rem 0' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
          }}
          className="container"
        >
          {[
            'Politics',
            'Business',
            'Tech',
            'Arts',
            'Science',
            'Health',
            'Sports',
            'All',
          ].map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              style={{
                border: '1px solid #fff',
                backgroundColor: 'transparent',
                color: '#fff',
                borderRadius: '30px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;