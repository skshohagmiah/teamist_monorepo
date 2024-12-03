import express from 'express';
import { authController } from '../controllers/AuthService.js';
import { authMiddleware } from '../controllers/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);

// Protected routes
router.get('/profile', authMiddleware, authController.profile);

export default router;