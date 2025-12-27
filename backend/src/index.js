require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const habitRoutes = require('./routes/habits');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
connectDB();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "https://www.smarthabittracker.online",
];

app.use(cors({ 
     origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

  credentials: true
}));


// Health check endpoint
app.get("/", (req, res) => {
    res.status(200).json({ status: "ok", message: "Server is healthy and running." });
})

app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
