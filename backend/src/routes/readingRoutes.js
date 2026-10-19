const express = require("express");

const {createReading, getLatestReading, getReadingHistory, getReadingById} = require("../controllers/readingController");

const validate = require("../middleware/validate");

const {waterReadingSchema} = require("../validators/readingValidator");

const router = express.Router();

router.post("/", validate(waterReadingSchema), createReading);
router.get("/latest/:deviceId", getLatestReading);
router.get("/history/:deviceId", getReadingHistory);
router.get("/:id", getReadingById);

module.exports = router;