const express = require('express');
const router = express.Router();
const { signIn,sendverifyOtp,logout,ResetPassword,sendResetOtp,login,verifyEmail,isAuthenticated } = require('../controllers/authController')
const {userAuth} = require('../middleware/authMiddleware') 

  //signin 
  router.post('/signin',signIn);
  
  // Verify Authentication
  router.post('/send-verify-otp',userAuth, sendverifyOtp);
  router.post('/verify-email',userAuth, verifyEmail);
  router.get('/isauthenticated',userAuth, isAuthenticated);
  
  // Login-Logout User
  router.post('/login',login);
  router.post('/logout',logout);

  //reset
  router.post('/send-reset-pass-otp',sendResetOtp);
  router.post('/reset-pass-otp',ResetPassword);
  
module.exports = router;
 