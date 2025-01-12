import React, { useContext, useEffect, Suspense } from 'react';
import { gsap } from 'gsap';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContent } from '../context/appContext';
import { useNavigate } from 'react-router-dom';


const EmailVerifyLazy = React.lazy(() => import('./EmailVerify'));

const EmailVerify = () => {
  const inputRefs = React.useRef([]);
  const { isLoggedIn,userData, setIsLoggedIn, backendUrl, getUserData } = useContext(AppContent);
  const navigate = useNavigate();

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value);
      const otp = otpArray.join('');
      console.log('Submitting OTP:', otp);
  
      const { data } = await axios.post(
        `${backendUrl}/api/user/verify-email`, 
        { otp }, 
        { withCredentials: true }
      );
  
      console.log('API Response:', data);
  
      if (data.success) {
        toast.success(data.message);
        setIsLoggedIn(true);
        getUserData();
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      if (e.response) {
        console.error('Response Error:', e.response.data);
        console.error('Status Code:', e.response.status);
        toast.error(e.response.data.message || 'Error occurred');
      } else if (e.request) {
        console.error('Request Error:', e.request);
        toast.error('No response from the server');
      } else {
        console.error('Axios Error:', e.message);
        toast.error(e.message);
      }
    }
  };

  
  useEffect(() => {
    isLoggedIn && userData && userData.isVerified && navigate('/')
  },[isLoggedIn,userData])

  useEffect(() => {
    gsap.fromTo(
      '.email-verify-container',
      { opacity: 0, y: -30 }, // Starting state
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' } // Ending state
    );
    gsap.fromTo(
      '.email-verify-form',
      { opacity: 0, y: 30 }, // Starting state
      { opacity: 1, y: 0, duration: 0.5, delay: 0.2, ease: 'power2.out' } // Ending state
    );
  }, []);
  

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="email-verify-container">
        <form onSubmit={onSubmit}>
          <div className="email-verify-form">
            <h1>Email Verify OTP</h1>
            <p>Enter the 6-digit code sent to your email id</p>
            <div className="otp-inputs">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <input
                    type="text"
                    maxLength={1}
                    key={index}
                    required
                    className="otp-input"
                    ref={e => (inputRefs.current[index] = e)}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={(e) => handlePaste(e)}
                  />
                ))}
            </div>
            <button className="submit-btn">Verify</button>
          </div>
        </form>

        <style>{`
          .email-verify-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #f2f2f2;
          }

          .email-verify-form {
            background: #fff;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 400px;
            width: 100%;
          }

          h1 {
            font-family: 'Roboto', sans-serif;
            color: #333;
            margin-bottom: 20px;
          }

          p {
            font-family: 'Roboto', sans-serif;
            color: #666;
            margin-bottom: 30px;
          }

          .otp-inputs {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }

          .otp-input {
            width: 50px;
            height: 50px;
            font-size: 24px;
            text-align: center;
            border: 2px solid #ddd;
            border-radius: 8px;
            outline: none;
            transition: border-color 0.3s;
          }

          .otp-input:focus {
            border-color: #4caf50;
          }

          .submit-btn {
            background-color: #4caf50;
            color: white;
            padding: 12px 20px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.3s;
          }

          .submit-btn:hover {
            background-color: #45a049;
          }
        `}</style>
      </div>
    </Suspense>
  );
};

export default EmailVerify;
