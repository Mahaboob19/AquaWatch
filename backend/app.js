const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const readingRoutes = require("./src/routes/readingRoutes");

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Aquaculture Monitoring API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/v1/readings", readingRoutes);

module.exports = app;