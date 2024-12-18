import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();

// Middleware to generate JWT token
export function generateJWT(user) {
    const payload = { User_ID: user.User_ID, Email: user.Email, IsAdmin: user.admin_privileges };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }); // Token expires in 1 hour
    return token;
}

// Middleware to verify JWT token
export function verifyJWT(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token.' });
        }
        req.user = decoded; // Save decoded user info in request object
        next();
    });
}