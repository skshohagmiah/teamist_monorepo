import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import helmet from 'helmet';
import axios from 'axios';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 3001;
const AUTH_SERVICE_URL = 'http://localhost:3002'; 

// Global Rate Limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  standardHeaders: true, 
  legacyHeaders: false, 
  message: {
    error: 'Too many requests, please try again later',
    status: 429
  },
  handler: (req, res, next, options) => {
    res.status(options.statusCode).send(options.message);
  }
});

// Service-Specific Rate Limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit auth routes to 100 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later',
    status: 429
  }
});

const userServiceLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs
  message: {
    error: 'Too many requests to user service, please try again later',
    status: 429
  }
});

// In-Memory Rate Limiting Middleware
const inMemoryRateLimiter = () => {
  const requestCounts = new Map();

  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const windowStart = now - (15 * 60 * 1000); // 15 minutes ago

    // Clean up old entries
    for (let [key, data] of requestCounts.entries()) {
      if (data.timestamp < windowStart) {
        requestCounts.delete(key);
      }
    }

    // Get or create entry for this IP
    let ipData = requestCounts.get(ip) || { count: 0, timestamp: now };

    // Increment request count
    ipData.count++;
    ipData.timestamp = now;
    requestCounts.set(ip, ipData);

    // Check total request count
    if (ipData.count > 1000) {
      return res.status(429).json({
        error: 'Too many requests. Please try again later.',
        status: 429
      });
    }

    next();
  };
};

// Middleware Application
app.use(globalLimiter);
app.use(helmet());
app.use(express.json());
app.use(inMemoryRateLimiter());

// CORS Configuration
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

// Authentication Middleware
const authenticateToken = async (req, res, next) => {
  // Skip authentication for login and registration routes
  if (req.path.includes('/auth/login') || req.path.includes('/auth/register')) {
    return next();
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Validate token with auth service
    const response = await axios.post(`${AUTH_SERVICE_URL}/auth/verify`, 
      { token },
      { 
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000 
      }
    );

    if (response.data.valid) {
      req.user = response.data.user;
      next();
    } else {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(500).json({ error: 'Authentication service unavailable' });
  }
};

// Request Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Service Configurations
const SERVICES = {
  auth: {
    url: AUTH_SERVICE_URL,
    limiter: authLimiter
  },
  users: {
    url: 'http://localhost:4000',
    limiter: userServiceLimiter
  },
  products: {
    url: 'http://localhost:4001',
    limiter: rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
      message: {
        error: 'Too many requests to product service',
        status: 429
      }
    })
  },
  orders: {
    url: 'http://localhost:4002',
    limiter: rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200,
      message: {
        error: 'Too many requests to order service',
        status: 429
      }
    })
  }
};

// Proxy Middleware with Service-Specific Rate Limiting
Object.entries(SERVICES).forEach(([route, { url: target, limiter }]) => {
  app.use(`/api/${route}`, 
    route === 'auth' ? 
    [
      limiter,
      createProxyMiddleware({ 
        target, 
        changeOrigin: true,
        pathRewrite: {
          [`^/api/${route}`]: '', 
        },
      })
    ] :
    [
      authenticateToken,
      limiter,
      createProxyMiddleware({ 
        target, 
        changeOrigin: true,
        pathRewrite: {
          [`^/api/${route}`]: '', 
        },
        onProxyRes: (proxyRes, req, res) => {
          proxyRes.headers['X-Powered-By'] = 'NodeJS API Gateway';
          if (req.user) {
            proxyRes.headers['X-User-ID'] = req.user.id;
          }
        },
        onError: (err, req, res) => {
          console.error('Proxy Error:', err);
          res.status(500).json({
            error: 'Service unavailable',
            details: err.message
          });
        }
      })
    ]
  );
});

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: Object.keys(SERVICES)
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist'
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚪 API Gateway running on port ${PORT}`);
  console.log(`Proxying services: ${Object.keys(SERVICES).join(', ')}`);
});