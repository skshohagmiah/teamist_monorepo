import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    // Get token from header
    const token = req.body;

    // Check if no token
    if (!token) {
        return res.status(401).json({
            message: 'No token, authorization denied'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add user from payload
        res?.status(200).json({
            valid: true,
            user: decoded
        })
    } catch (error) {
        res.status(401).json({
            message: 'Token is not valid'
        });
    }
};