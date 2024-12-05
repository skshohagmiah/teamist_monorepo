import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../model/user.js';


export const authController = {
    async login(req, res) {
        const { email, password } = req.body;

        try {
            // Find user by email
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            // Compare passwords
            const isMatch = await bcryptjs.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({
                    message: 'Invalid credentials'
                });
            }

            // Generate JWT token
            const access_token = jwt.sign(
                {
                    id: user._id,
                    email: user.email
                },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Respond with token
            res.status(200).json({
                access_token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });

        } catch (error) {
            console.error('Login error', error);
            res.status(500).json({
                message: 'Server error during login',
                error: error.message
            });
        }
    },

    async verify(req, res) {
        const { token } = req?.body;

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        try {
            const decoded = await jwt.verify(token, process.env.JWT_SECRET);

            if (decoded && decoded.payload) {

                res?.status(200).json({
                    valid: true,
                    user: decoded?.payload
                })
                
            } else {
                return res.status(403).json({ message: 'Invalid token' });
            }
        } catch (error) {
            console.log('token verification error', error);

            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired' });
            }

            return res.status(403).json({ message: 'Token Verification Failed' });
        }
    },

    async register(req, res) {
        const { email, password, name } = req?.body;

        try {
            // Check if user already exists
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return res.status(400).json({
                    message: 'User already exists with this email'
                });
            }

            // Hash password
            const hashedPassword = await bcryptjs.hash(password, 10);

            // Create new user
            const newUser = new User({
                name,
                email,
                password: hashedPassword
            });

            // Save user to database
            await newUser.save();

            // Generate JWT token
            const access_token = jwt.sign(
                {
                    id: newUser._id,
                    email: newUser.email
                },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Respond with token
            res.status(201).json({
                access_token,
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email
                }
            });

        } catch (error) {
            console.error('User Registration Error', error);
            res.status(500).json({
                message: 'Server error during registration',
                error: error.message
            });
        }
    },

    async profile(req, res) {
        try {
            // Assuming req.user is set by a middleware that verifies the JWT token
            const user = await User.findById(req.user.id).select('-password');

            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            res.status(200).json({
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });

        } catch (error) {
            console.error('Profile fetch error', error);
            res.status(500).json({
                message: 'Server error while fetching profile',
                error: error.message
            });
        }
    },

    async forgotPassword(req, res) {
        const { email } = req.body;

        try {
            // Find user by email
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({
                    message: 'No user found with this email'
                });
            }

            // Generate password reset token
            const resetToken = jwt.sign(
                { id: user._id },
                process.env.JWT_RESET_SECRET,
                { expiresIn: '15m' }
            );

            // TODO: Implement email sending logic to send reset link
            // This typically involves:
            // 1. Creating a reset link with the token
            // 2. Sending an email to the user with the reset link

            res.status(200).json({
                message: 'Password reset instructions sent to email'
            });

        } catch (error) {
            console.error('Forgot password error', error);
            res.status(500).json({
                message: 'Server error during password reset process',
                error: error.message
            });
        }
    }
};