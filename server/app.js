const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const requestLogger = require('./middleware/logger');
const { errorHandler } = require('./utils/response');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const eventsRouter = require('./routes/events');
const authRouter = require('./routes/auth');

const app = express();

// CORS middleware
app.use(cors());

// Request logging
app.use(requestLogger);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/users', usersRouter);
app.use('/api/events', eventsRouter);
app.use('/api/auth', authRouter);

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler (should be last)
app.use(errorHandler);

module.exports = app;
