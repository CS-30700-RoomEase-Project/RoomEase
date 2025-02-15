const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Express server is running");
});

app.post("/log-message", (req, res) => {
  const { message } = req.body;
  console.log(`Message from front end: ${message}`);
  res.status(200).send("Message logged");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
