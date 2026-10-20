const express = require("express");

const {getAlerts, getOpenAlerts, getAlertById, acknowledgeAlert, resolveAlert} = require("../controllers/alertController");

const router = express.Router();

router.get("/open", getOpenAlerts);
router.get("/", getAlerts);
router.get("/:id", getAlertById);

router.patch("/:id/acknowledge", acknowledgeAlert);
router.patch("/:id/resolve", resolveAlert);

module.exports = router;
