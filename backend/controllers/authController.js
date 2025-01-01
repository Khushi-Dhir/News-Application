const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const transporter   = require('../config/nodemailer');
// Sign In
const signIn = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!password||!name || !email ) {
        return res.status(400).json({ message: 'Please Enter all the Credencials' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) { 
        return res.status(400).json({ message: 'User already exists' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        
        const token= generateToken(user._id);
        res.cookie('token', token,{httpOnly: true,secure: process.env.NODE_ENV === 'production',sameSite: process.env.NODE_ENV === 'production'?'none':'strict',maxAge: 30 * 24 * 60 * 60 * 1000});

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to dailyNews',
            text: `welcome to dailyNews! . Your account is created with email : ${email}`
        }
        await transporter.sendMail(mailOption)
        
        res.status(201).json({
            message: 'User registered. Please verify your email with the OTP.',
            userId: user._id,
            token:token
        });
    } catch (error) {
        res.status(500).send('Error registering user: ' + error.message);
    }
});


// send verify otp
const sendverifyOtp = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id; 
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: 'Email already verified.' });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        user.otp = otp;
        user.otpExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            text: `Welcome to dailyNews. Your OTP for account verification is: ${otp}`,
        };
        await transporter.sendMail(mailOptions);

        res.json({ message: 'OTP sent to your email.' });
    } catch (error) {
        res.status(500).json({ message: 'Error verifying email: ' + error.message });
    }
});

const verifyEmail = asyncHandler(async (req, res) => {
        const userId = req.user.id; 
        const {otp} = req.body;
    if(!otp|| !userId){
        return res.status(400).json({ message: 'Please Enter all the Credencials' });
    }
    try{
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ message: 'User Not Found' });
        }
        if(user.otp!== otp){
            console.log(`User otp : ${user.otp}, userId : ${user.userId}, otp : ${otp}`);
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        if(user.otpExpiry< Date.now()){
            res.status(400).json({ message: 'OTP has expired' });
        }
        user.isVerified=true
        user.otp = ''
        user.otpExpiry = 0
        await user.save();
        res.status(200).json({ message: 'Account verified successfully' });
    }catch(err){
        res.status(500).json({ message: 'Error verifying OTP: '+err.message });
    }
});



// Login
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = generateToken(user._id);
    res.cookie('token', token,{httpOnly: true,secure: process.env.NODE_ENV === 'production',sameSite: process.env.NODE_ENV === 'production'?'none':'strict',maxAge: 30 * 24 * 60 * 60 * 1000});
    
    if (!user.isVerified) {
        return res.status(403).json({ message: 'Please verify your email before logging in' });
    }else{
        res.status(200).json({ message: 'Login successful.', userId: user._id, token: generateToken(user._id) });
    } 

});

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: '30d' });//30days
}

const isAuthenticated = asyncHandler(async (req, res) => {
    try{
        return res.json({message: "Authenticated"})
    }catch(err){
        res.status(500).json({ message: err.message });
    }
})


//rest password otp

const sendResetOtp = asyncHandler(async (req, res) => {
    const {email} = req.body
    if(!email){
        return res.status(400).json({message: "Email is required"})
    }
    try{
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({message: "User not found"})
        }
        const otp = crypto.randomInt(100000, 999999).toString();
        user.resetotp = otp;
        user.resetotpExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Welcome to dailyNews. Your Reset Password  OTP is: ${otp}`,
        };
        await transporter.sendMail(mailOptions);

        res.json({ message: 'OTP sent to your email For Reseting the Password.' });

    }catch(err){
        res.status(500).json({ message: err.message });
    }
})

const ResetPassword = asyncHandler(async (req, res) => {
    const { email, password,otp} = req.body
    if(!email || !password|| !otp){
        return res.status(400).json({message: "Email, Password and OTP are required"})
    }
    try{
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({message: "User not found"})
        }
        if(user.resetotp!== otp){
            return res.status(400).json({ message: "Invalid OTP"})
        }
        if(user.resetotpExpiry< Date.now()){
            return res.status(400).json({ message: "OTP has expired"})
        }
        user.password = await bcrypt.hash(password, 10);
        user.resetotp = '';
        user.resetotpExpiry = 0 
        await user.save();
        res.json({ message: 'Password reset successfully' });
    }catch(error){
        res.status(500).json({ message: error.message });
    }

    })


module.exports = { signIn, login,ResetPassword, sendverifyOtp,sendResetOtp,verifyEmail,isAuthenticated };