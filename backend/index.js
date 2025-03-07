const express = require("express");
const cors = require("cors");
require('dotenv').config();
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const choreRoutes = require('./routes/choreRoutes');
const groceryRoutes = require('./routes/groceryRoutes');
const updateProfileRoutes = require('./routes/updateProfileRoutes');
const billsRoutes = require('./routes/billsRoutes'); 
const notificationRoutes = require('./routes/notificationRoutes');
const roomRoutes = require('./routes/roomRoutes');
const roomStateRoutes = require('./routes/stateRoutes'); 
const hoursRoute = require('./routes/hoursRoute');

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
app.use('/api/grocery', groceryRoutes);
// Use different routes to avoid conflict
app.use('/api/users', userRoutes); // For user-related routes
app.use('/api/users/profile', updateProfileRoutes); // For profile update routes
app.use('/api/bills', billsRoutes); // For bills/expenses routes
app.use('/api/notifications', notificationRoutes); // For notification routes
app.use('/api/room', roomRoutes); // For room-related routes
app.use('/api/roomstate', roomStateRoutes);
app.use('/api/hours', hoursRoute);



// Test route
app.get("/", (req, res) => {
  res.send("Express server is running");
});

// Start server after app is fully initialized
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
