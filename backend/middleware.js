import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';


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

// Middleware to send verification email
export function verificationemail(email, token) {
    const transporter = nodemailer.createTransport({
        secure: true,
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Verify your email for Rate Your Instructor',
        html: `<h1>Verify your email</h1>
        <p>Click <a href="http://localhost:8000/api/user/verify/${token}">here</a> to verify your email.</p>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}