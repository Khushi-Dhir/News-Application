const jwt = require('jsonwebtoken');
const asyncHandlers = require('express-async-handler'); 

const userAuth = asyncHandlers(async (req, res, next) => {
    let token;

    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
        
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized, no token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id }; 
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Not authorized, invalid token.' });
    }
});


module.exports = { userAuth };