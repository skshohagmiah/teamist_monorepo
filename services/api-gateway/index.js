import express from 'express';
import proxy from 'express-http-proxy';
import cors from 'cors';
import helmet from 'helmet';
import axios from 'axios';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 3001;
const AUTH_SERVICE_URL = 'http://auth-service:3002';

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests',
    status: 429
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: 'Too many authentication attempts',
    status: 429
  }
});

const userServiceLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: {
    error: 'Too many requests to user service',
    status: 429
  }
});

app.use(globalLimiter);
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));

const authenticateToken = async (req, res, next) => {
  if (req.path.includes('/login') || req.path.includes('/register')) {
    return next();
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
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
      res.status(403).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ error: 'Auth service unavailable' });
  }
};

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

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
      max: 300
    })
  },
  orders: {
    url: 'http://localhost:4002',
    limiter: rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200
    })
  }
};

app.use('/api/auth', [
  authLimiter,
  proxy(AUTH_SERVICE_URL, {
    proxyReqPathResolver: (req) => {
      const path = `/auth${req.url}`; // This will preserve the full path
      console.log(`Proxying to: ${path}`);
      return path;
    },
    proxyErrorHandler: (err, res, next) => {
      console.error('Proxy Error:', err);
      res.status(500).json({ error: 'Auth service unavailable' });
    }
  })
]);

// Other Services Proxy
Object.entries(SERVICES).forEach(([route, { url, limiter }]) => {
  if (route !== 'auth') {
    app.use(`/api/${route}`, [
      authenticateToken,
      limiter,
      proxy(url, {
        proxyReqPathResolver: (req) => {
          return req.url.replace(`/api/${route}`, '');
        },
        userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
          userRes.set('X-Powered-By', 'NodeJS API Gateway');
          if (userReq.user) {
            userRes.set('X-User-ID', userReq.user.id);
          }
          return proxyResData;
        }
      })
    ]);
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: Object.keys(SERVICES)
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'Endpoint does not exist'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`Services: ${Object.keys(SERVICES).join(', ')}`);
});