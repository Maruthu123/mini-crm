const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env variables
dotenv.config();

// Connect DB
connectDB();

const app = express();

// Middleware
app.use(express.json());

// CORS
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      process.env.FRONTEND_URL
    ],
    credentials: true,
  })
);

// Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/leads', require('./routes/lead.routes'));
app.use('/api/companies', require('./routes/company.routes'));
app.use('/api/tasks', require('./routes/task.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));
app.use('/api/users', require('./routes/user.routes'));

// Test route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 Mini CRM API is running',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});