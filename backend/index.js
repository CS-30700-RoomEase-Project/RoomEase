const express = require("express");
const cors = require("cors");
require('dotenv').config();
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const choreRoutes = require('./routes/choreRoutes');

// Initialize app after importing dependencies
const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Middlewares and routes
app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/chores', choreRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Express server is running");
});

// Start server after app is fully initialized
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
