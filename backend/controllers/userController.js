const asyncHandler = require('express-async-handler');
const User = require('../models/userModel')

const getUserData = asyncHandler(async (req,res) =>{
    try{
        const userId = req.user.id;
        if(!userId){
            return res.status(401).json({ success: false,message: 'Unauthorized'})
        } 
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({ success: false,message: 'User not found'})
        }
        res.status(200).json({ 
            success: true,
            userData: {
            id: user._id,
            name: user.name,
            email: user.email,
            isVerified: user.isVerified
        }})
    }catch(err){
        res.status(404).json({ success: false,message: err.message});    
    }
})

module.exports = {getUserData};