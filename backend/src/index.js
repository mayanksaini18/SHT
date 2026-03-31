require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const admin = require('firebase-admin');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const habitRoutes = require('./routes/habits');
const errorHandler = require('./middlewares/errorHandler');

// Initialize Firebase Admin (uses default credentials or service account)
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || 'smart-habit-tracker-39269',
  });
}

const app = express();
connectDB();

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

const allowedOrigins = [
  'http://localhost:5173',
  'https://www.smarthabittracker.online',
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy and running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
