require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const notFound = require('./middlewares/notFound');

const app = express();

// Connect to db
connectDB();

// Middelwares
// app.use(cors({
//   origin: process.env.CLIENT_URL,
//   credentials: true,
// }));

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(notFound);
app.use(errorHandler);
app.use('/api/auth', authRoutes);

// Health check route
app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal server error',
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})