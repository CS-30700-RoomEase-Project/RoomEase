const express = require("express");
const cors = require("cors");
require('dotenv').config();
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const choreRoutes = require('./routes/choreRoutes');
const updateProfileRoutes = require('./routes/updateProfileRoutes');
const billsRoutes = require('./routes/billsRoutes'); 
const notificationRoutes = require('./routes/notificationRoutes');
const roomRoutes = require('./routes/roomRoutes');

// Initialize app after importing dependencies
const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Middlewares and routes
app.use(cors());
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // or your frontend domain
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use('/api/chores', choreRoutes);
// Use different routes to avoid conflict
app.use('/api/users', userRoutes); // For user-related routes
app.use('/api/users/profile', updateProfileRoutes); // For profile update routes
app.use('/api/bills', billsRoutes); // For bills/expenses routes
app.use('/api/notifications', notificationRoutes); // For notification routes
app.use('/api/room', roomRoutes); // For room-related routes

// Test route
app.get("/", (req, res) => {
  res.send("Express server is running");
});

// Start server after app is fully initialized
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
