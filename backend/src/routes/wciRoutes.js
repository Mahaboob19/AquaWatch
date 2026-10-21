const express = require("express");
const {getWCIByReadingId} = require("../controllers/wciController");

const router = express.Router();

router.get("/reading/:readingId", getWCIByReadingId);

module.exports = router;