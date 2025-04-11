const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");
const path = require("path");
const pathToRegexp = require("path-to-regexp");

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
const BASEROW_TOKEN = process;
