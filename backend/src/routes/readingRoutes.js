const express = require("express");

const {createReading, getLatestReading, getReadingHistory, getReadingById} = require("../controllers/readingController");

const router = express.Router();

router.post("/", createReading);
router.get("/latest/:deviceId", getLatestReading);
router.get("/history/:deviceId", getReadingHistory);
router.get("/:id", getReadingById);

module.exports = router;