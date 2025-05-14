const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

// Load frontend URL from environment
const FRONTEND_URL = process.env.FRONTEND_URL;

// Route handlers
const userRoutes = require("./routes/userRoutes");
const choreRoutes = require("./routes/choreRoutes");
const groceryRoutes = require("./routes/groceryRoutes");
const noteRoutes = require("./routes/roomNoteRoutes");
const leaderboardRoutes = require("./routes/roomLeaderboardRoutes");
const updateProfileRoutes = require("./routes/updateProfileRoutes");
const billsRoutes = require("./routes/billsRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const roomRoutes = require("./routes/roomRoutes");
const inviteRoutes = require("./routes/inviteRoutes");
const quietHoursRoutes = require("./routes/quietHoursRoutes");
const roomStateRoutes = require("./routes/stateRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const fetchRatingRoutes = require("./routes/ratingFetchRoutes");
const rulesRoutes = require("./routes/rulesRoutes");
const clauseRoutes = require("./routes/clauseRoutes");
const memoryRoutes = require("./routes/memoryRoutes");
const disputesRoutes = require("./routes/disputesRoutes");

// Initialize app and HTTP server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Middleware: enable CORS for frontend and parse JSON
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// Register routes
app.use("/api/chores", choreRoutes);
app.use("/api/grocery", groceryRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/users/profile", updateProfileRoutes);
app.use("/api/bills", billsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/invite", inviteRoutes);
app.use("/api/quiethours", quietHoursRoutes);
app.use("/api/roomstate", roomStateRoutes);
app.use("/api/rules", rulesRoutes);
app.use("/api/rating", ratingRoutes);
app.use("/api/ratingFetch", fetchRatingRoutes);
app.use("/api/disputes", disputesRoutes);
app.use("/api/clauses", clauseRoutes);
const groupChatRoutes = require("./routes/groupChatRoutes")(io);
app.use("/api/groupchat", groupChatRoutes);
app.use("/api/memories", memoryRoutes);

// Socket.IO events
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
});

// Health check route
app.get("/", (req, res) => {
  res.send("Express server is running");
});

// Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
