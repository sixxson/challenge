// index.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const otpRoutes = require("./router/otpRouter");
const favoriteRoutes = require("./router/favoritesRouter");
const githubRouter = require("./router/githubRouter");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
mongoose.connect(process.env.MONGODB_URI);

// Routes
app.use("/api", otpRoutes);
app.use("/api/github", githubRouter);
app.use("/api/favorites", favoriteRoutes);

// Fallback route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
