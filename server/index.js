const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const path = require("path");

dotenv.config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.static(path.join(__dirname, "../client/build")));

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/build")));
app.use(express.static(path.join(__dirname, "../client/public")));

// Debugging middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

const router = express.Router();

// Get the Baserow token from environment variables
const BASEROW_TOKEN = process.env.BASEROW_TOKEN;

// Serve React app for all non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error("Error occurred:", err.message);
  res.status(500).send("Internal Server Error");
});

// Ensure the server listens on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
