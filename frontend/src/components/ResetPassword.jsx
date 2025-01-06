import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/appContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { gsap } from 'gsap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userData, setIsLoggedIn, backendUrl, getUserData } = useContext(AppContent);
  const inputRefs = useRef([]);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');  
  const [isEmailSent, setIsEmailSent] = useState('');
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    gsap.fromTo('.reset-form', { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1 });
    gsap.fromTo('.otp-inputs', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1, delay: 0.2 });
  }, []);

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

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/api/user/send-reset-pass-otp`, { email }, { withCredentials: true });
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setIsEmailSent(true);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    let otpArray = inputRefs.current.map(e => e.value);
    setOtp(otpArray.join(''));
    setIsOtpSubmitted(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();

    console.log('Sending request with data:', { email, otp, newPassword });  // Corrected variable name

    try {
      if (!email || !otp || !newPassword) {
        toast.error("Please fill all the fields correctly.");
        return;
      }

      if (newPassword.length < 6) { 
        toast.error("Password must be at least 6 characters.");
        return;
      }

      const resetData = {
        email,
        otp, 
        password: newPassword, 
      };

      const { data } = await axios.post(
        `${backendUrl}/api/user/reset-pass-otp`,
        resetData,
        {
          headers: {
            'Content-Type': 'application/json', 
          },
          withCredentials: true,
        }
      );

      console.log('Response data:', data);

      if (data.success) {
        toast.success(data.message);
        navigate('/login');
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      if (e.response) {
        console.error('Backend error:', e.response.data);
        toast.error(e.response.data.message || 'An error occurred');
      } else {
        console.error('Error:', e.message);
        toast.error(e.message);
      }
    }
  };

  return (
    <div className="reset-form" style={styles.container}>
      {!isEmailSent && 
        <form onSubmit={onSubmitEmail} style={styles.form}>
          <h1 style={styles.heading}>Reset Password</h1>
          <p style={styles.subHeading}>Enter Your Registered Email-Id</p>
          <input 
            type="email"
            placeholder="Your Email-Id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Submit</button>
        </form>
      }

      {!isOtpSubmitted && isEmailSent && 
        <form onSubmit={onSubmitOtp} style={styles.form}>
          <h1 style={styles.heading}>Reset Password OTP</h1>
          <p style={styles.subHeading}>Enter the 6-digit OTP sent to your Email-Id</p>
          <div className="otp-inputs" style={styles.otpContainer}>
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
                  style={styles.otpInput}
                />
              ))}
          </div>
          <button className="submit-btn" type="submit" style={styles.button}>Verify</button>
        </form>
      }

      {isEmailSent && isOtpSubmitted &&
        <form onSubmit={onSubmitNewPassword}  style={styles.form}>
          <h1 style={styles.heading}>New Password</h1>
          <p style={styles.subHeading}>Enter Your New Password Below</p>
          <div style={styles.passwordInputContainer}>
            <input 
              type={showPassword ? 'text' : 'password'}
              placeholder="Your New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={styles.input}
            />
            <button
              type="button"
              style={styles.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={`bi bi-eye${showPassword ? '-slash' : ''}`} />
            </button>
          </div>
          <button type="submit" style={styles.button}>Submit</button>
        </form>
      }
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    padding: '20px',
  },
  form: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  heading: {
    fontSize: '1.8rem',
    color: '#007bff',
    marginBottom: '15px',
    textAlign: 'center',
  },
  subHeading: {
    fontSize: '1rem',
    color: '#6c757d',
    marginBottom: '20px',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '1rem',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  otpContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  otpInput: {
    width: '50px',
    padding: '10px',
    textAlign: 'center',
    fontSize: '1.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  passwordInputContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  }
};

export default ResetPassword;