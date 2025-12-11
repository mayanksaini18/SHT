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


app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));


//heath cheaker 
app.get("/",(req,res)=>{
    res.json({msg : "server is running"})
})

app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
