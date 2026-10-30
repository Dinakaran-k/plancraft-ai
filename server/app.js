require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const { requireSession } = require('./middleware/sessionMiddleware');
const { standardApiLimiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorHandler');

const eventsRouter = require('./routes/events');
const budgetRouter = require('./routes/budget');
const timelineRouter = require('./routes/timeline');
const vendorsRouter = require('./routes/vendors');
const aiRouter = require('./routes/ai');

const app = express();

app.set('trust proxy', 1);

// Security Headers via Helmet with explicit CSP directives
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://*.onrender.com", "https://api.render.com"]
      }
    },
    frameguard: { action: 'deny' },
    crossOriginEmbedderPolicy: false
  })
);

// CORS Configuration
function corsOptionsDelegate(req, callback) {
  const origin = req.headers.origin;
  let isAllowed = false;

  if (!origin) {
    isAllowed = true;
  } else {
    try {
      const originUrl = new URL(origin);
      const hostHeader = req.get('host');
      const originHost = originUrl.host;

      if (originHost === hostHeader) {
        isAllowed = true;
      } else if (originHost.endsWith('.onrender.com')) {
        isAllowed = true;
      } else if (process.env.CORS_ORIGIN) {
        const allowedClean = process.env.CORS_ORIGIN.replace(/^https?:\/\//, '').replace(/\/$/, '');
        if (originHost === allowedClean) isAllowed = true;
      } else if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
        isAllowed = true;
      }
    } catch (e) {
      isAllowed = false;
    }
  }

  if (!isAllowed) {
    return callback(new Error('Not allowed by CORS'));
  }

  callback(null, {
    origin: true,
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-Session-Id']
  });
}

// Enable Gzip/Brotli response compression for efficient network payloads
app.use(compression());

app.use(express.json({ limit: '50kb' }));

// Health Check (Public, no session requirement)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'PlanCraft AI API',
    timestamp: new Date().toISOString()
  });
});

// Mount /api endpoints
app.use('/api', cors(corsOptionsDelegate));
app.use('/api', standardApiLimiter);
app.use('/api', requireSession);

app.use('/api/events', eventsRouter);
app.use('/api/budget', budgetRouter);
app.use('/api/timeline', timelineRouter);
app.use('/api/vendors', vendorsRouter);
app.use('/api/ai', aiRouter);

// Single Combined Deploy: Serve built client assets in production with HTTP caching
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(
  express.static(clientDistPath, {
    maxAge: process.env.NODE_ENV === 'production' ? '1d' : 0,
    etag: true,
    setHeaders: (res, filePath) => {
      // Hashed assets in assets/ are cacheable for 1 year
      if (filePath.includes(path.join('dist', 'assets'))) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      }
    }
  })
);

app.get(/^(?!\/api).*/, (req, res, next) => {
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) next();
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Centralized Error Handling
app.use(errorHandler);

if (require.main === module) {
  const PORT = process.env.PORT || 5002;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PlanCraft AI Server running on port ${PORT}`);
  });
}

module.exports = app;
