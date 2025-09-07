// backend/server.js

const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectRedis } = require('./utils/redisClient');
require('dotenv').config();

const app = express();

connectRedis()

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // or your frontend URL
  credentials: true
}));
// app.use(cors({
//   origin:'https:localhost:5173'
// }))
app.use(express.json());
app.use(cookieParser());

// Connect to DB
connectDB(process.env.MONGO_URI);

// Routes
app.use('/api/auth', require('./routes/auth'));

app.use('/api/snippets', require('./routes/snippetRoutes'));

app.use('/api/revision', require('./routes/revisionRoutes'));

app.use('/api/ai', require('./routes/aiRoutes'));

app.use('/api/dashboard', require('./routes/dashboardRoutes'));

app.use('/api/journal', require('./routes/journalRoutes'));

app.use('/api/concepts', require('./routes/conceptRoutes'));

// Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: 'NeuralStack API is working ✅' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
