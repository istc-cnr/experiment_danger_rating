const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(path.join(__dirname, '..')));

// Serve static files with correct MIME types
app.use(express.static(path.join(__dirname), {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const MONGODB_URI = process.env.MONGODB_URI;
app.post('/save-data', async (req, res) => {
    try {
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        
        const db = client.db('CNR_Danger_Rating');
        const collection = db.collection('user_responses');
        
        await collection.insertOne(req.body);
        await client.close();
        
        res.json({ success: true });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
