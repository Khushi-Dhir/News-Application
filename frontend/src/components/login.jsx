import React, { useContext, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AppContent } from '../context/appContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { gsap } from 'gsap';

const Login = () => {
  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetPassword, setResetPassword] = useState(false); // Reset Password State
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContent);
  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;

      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + 'api/user/signin', { name, email, password });
        if (data.success) { 
          
          setIsLoggedIn(true);
          getUserData();
          navigate('/');
        } else {
          toast.error(data.message);
        }
      } else if (state === 'Login') {
        const { data } = await axios.post(backendUrl + 'api/user/login', { email, password });
        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate('/');
        } else {
          toast.error(data.message);
        }
      } else if (resetPassword) {
        // Add your reset password logic here
        toast.success('Password reset link has been sent to your email');
        setResetPassword(false);
        setState('Login');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleResetPassword = () => {
    setState('Reset Password');
    setResetPassword(true);
  };

  // Animations using GSAP
  React.useEffect(() => {
    gsap.fromTo('.login-form', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1 });
    gsap.fromTo('.login-header', { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2 });
  }, []);

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="login-form shadow-lg p-5 rounded bg-white" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="login-header text-center text-primary mb-3">{state === 'Sign Up' ? 'Create Account' : state === 'Login' ? 'Login' : 'Reset Password'}</h2>
        <form onSubmit={onSubmitHandler}>
          <div className="mb-3">
            {state === 'Sign Up' && (
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  id="floatingName"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <label htmlFor="floatingName">Your Name</label>
              </div>
            )}
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="floatingEmail"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="floatingEmail">Your Email</label>
            </div>
            <div className="input-group mb-3">
              <div className="form-floating flex-grow-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  id="floatingPassword"
                  placeholder="Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="floatingPassword">Your Password</label>
              </div>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`bi bi-eye${showPassword ? '-slash' : ''}`} />
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 mb-3"
            style={{
              padding: '10px',
              borderRadius: '10px',
              fontSize: '1rem',
              backgroundColor: '#007bff', // Change background color
              borderColor: '#007bff', // Border color to match
            }}
          >
            {state === 'Sign Up' ? 'Sign Up' : state === 'Login' ? 'Login' : 'Reset Password'}
          </button>
          {state === 'Login' && !resetPassword && (
            <div className="text-center">
              <p className="text-muted">
                Forgot your password?{' '}
                <span
                  onClick={handleResetPassword}
                  style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Reset here
                </span>
              </p>
              <p className="text-muted">
                Don't have an account?{' '}
                <span
                  onClick={() => setState('Sign Up')}
                  style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Sign Up
                </span>
              </p>
            </div>
          )}
          {state === 'Sign Up' && (
            <p className="text-center text-muted">
              Already have an account?{' '}
              <span
                onClick={() => setState('Login')}
                style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Login Here
              </span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
