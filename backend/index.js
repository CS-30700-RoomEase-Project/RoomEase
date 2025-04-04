const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

const userRoutes = require("./routes/userRoutes");
const choreRoutes = require("./routes/choreRoutes");
const groceryRoutes = require("./routes/groceryRoutes");
const noteRoutes = require("./routes/roomNoteRoutes");
const updateProfileRoutes = require("./routes/updateProfileRoutes");
const billsRoutes = require("./routes/billsRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const roomRoutes = require("./routes/roomRoutes");
const inviteRoutes = require("./routes/inviteRoutes");
const quietHoursRoutes = require("./routes/quietHoursRoutes");
const roomStateRoutes = require("./routes/stateRoutes");
const ratingRoutes = require("./routes/ratingRoutes"); // ✅ NEW ROUTE
const fetchRatingRoutes = require("./routes/ratingFetchRoutes"); // ✅ NEW ROUTE
const clausesRoutes = require("./routes/clausesRoutes");

// Initialize app and HTTP server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Adjust for your frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/chores", choreRoutes);
app.use("/api/grocery", groceryRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/users", userRoutes);
app.use("/api/users/profile", updateProfileRoutes);
app.use("/api/bills", billsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/invite", inviteRoutes);
app.use("/api/quiethours", quietHoursRoutes);
app.use("/api/roomstate", roomStateRoutes);
app.use("/api/clauses", clausesRoutes);
app.use("/api/rating", ratingRoutes); // ✅ CORRECTED TO /api/rating
app.use("/api/ratingFetch", fetchRatingRoutes); // ✅ CORRECTED TO /api/ratingFetch
app.use("/api/disputes", require("./routes/disputesRoutes")); // ✅ NEW ROUTE
// Import and pass Socket.IO to group chat routes
const groupChatRoutes = require("./routes/groupChatRoutes")(io);
app.use("/api/groupchat", groupChatRoutes);

// Socket.IO Events
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a specific room
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
});

// Test route
app.get("/", (req, res) => {
  res.send("Express server is running");
});

// Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
