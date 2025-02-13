const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

// Validate environment variables
const requiredEnvVars = ['MONGODB_URI', 'API_KEY'];
requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
});

const app = express();

// Security middleware with custom CSP
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'",
                "unpkg.com",
                "cdnjs.cloudflare.com"
            ],
            styleSrc: [
                "'self'",
                "'unsafe-inline'",
                "unpkg.com",
                "cdnjs.cloudflare.com"
            ],
            fontSrc: [
                "'self'",
                "cdnjs.cloudflare.com",
                "unpkg.com"
            ],
            imgSrc: ["'self'", "data:", "blob:"],
            connectSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'self'"],
        },
    }
}));
app.use(xss());
app.use(express.json({ limit: '10kb' }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 80 * 60 * 1000, // 80 minutes (80 * 60 seconds * 1000 milliseconds)
    max: 1000,
    message: 'Too many requests from this IP, please try again after 80 minutes'
});
app.use(limiter);

// Basic API key authentication middleware
const authenticateApiKey = (req, res, next) => {
    const apiKey = req.header('X-API-Key');
    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

// CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? 'https://your-production-domain.com' 
        : 'http://localhost:3000',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, '..')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const validateSaveData = [
    body('userID').isString().trim().isLength({ min: 1 }),
    body('trials').isArray(),
    body('trials.*.danger_rating').isInt({ min: 0, max: 9 }),
    body('trials.*.english').isString().trim(),
    body('trials.*.italian').isString().trim(),
    body('trials.*.response_time_ms').isInt({ min: 0 }),
    body('total_time_ms').isInt({ min: 0 })
];

app.post('/save-data', authenticateApiKey, validateSaveData, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const client = new MongoClient(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        await client.connect();
        
        // Sanitize data before saving
        const sanitizedData = {
            ...req.body,
            timestamp: new Date(),
            ipAddress: req.ip // Log IP address for security
        };
        
        const db = client.db('CNR_Danger_Rating');
        const collection = db.collection('user_responses');
        
        await collection.insertOne(sanitizedData);
        await client.close();
        
        res.json({ success: true });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
