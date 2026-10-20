const Threshold = require("../models/Threshold");
const Alert = require("../models/Alert");

const PARAMETERS = [
  "ph",
  "temperature",
  "dissolvedOxygen",
  "turbidity",
  "tds",
  "conductivity",
  "salinity",
  "ammonia",
  "nitrite",
  "nitrate",
];

const getThresholdForParameter = async (parameter, device) => {
  const deviceThreshold = await Threshold.findOne({
    parameter,
    scope: "device",
    deviceId: device._id,
    enabled: true,
  });

  if (deviceThreshold) return deviceThreshold;

  return Threshold.findOne({
    parameter,
    scope: "global",
    enabled: true,
  });
};

const evaluateReading = async (reading, device) => {
  const generatedAlerts = [];
  const now = reading.timestamp || new Date();

  for (const parameter of PARAMETERS) {
    const value = reading[parameter];

    if (value === undefined || value === null) continue;

    const threshold = await getThresholdForParameter(
      parameter,
      device
    );

    if (!threshold) continue;

    let severity = null;
    let type = null;
    let message = null;

    if (
      threshold.criticalMin != null &&
      value < threshold.criticalMin
    ) {
      severity = "critical";
      type = "low";
    } else if (
      threshold.criticalMax != null &&
      value > threshold.criticalMax
    ) {
      severity = "critical";
      type = "high";
    } else if (
      threshold.warningMin != null &&
      value < threshold.warningMin
    ) {
      severity = "warning";
      type = "low";
    } else if (
      threshold.warningMax != null &&
      value > threshold.warningMax
    ) {
      severity = "warning";
      type = "high";
    }

    const activeFilter = {
      deviceId: device._id,
      parameter,
      status: { $in: ["open", "acknowledged"] },
    };

    const activeAlerts = await Alert.find(activeFilter);

    // No abnormal condition: resolve any active alert
    // for this parameter, including alerts for an older direction.
    if (!severity) {
      if (activeAlerts.length > 0) {
        await Alert.updateMany(
          activeFilter,
          {
            $set: {
              status: "resolved",
              resolvedAt: now,
              resolutionReason:
                "Reading returned to the configured warning range.",
              value,
              lastSeenAt: now,
            },
          }
        );
      }

      continue;
    }

    message =
      `${parameter} is ${type === "high" ? "above" : "below"} ` +
      `the configured ${severity} threshold.`;

    // Reuse the alert for this same abnormal direction.
    let alert = activeAlerts.find((item) => item.type === type);

    // If the abnormal direction changed, close the old active
    // alert before creating the new one.
    const oppositeAlerts = activeAlerts.filter(
      (item) => item.type !== type
    );

    if (oppositeAlerts.length > 0) {
      await Alert.updateMany(
        {
          _id: { $in: oppositeAlerts.map((item) => item._id) },
        },
        {
          $set: {
            status: "resolved",
            resolvedAt: now,
            resolutionReason:
              "The abnormal direction changed.",
            lastSeenAt: now,
          },
        }
      );
    }

    if (alert) {
      alert.value = value;
      alert.severity = severity;
      alert.message = message;
      alert.lastSeenAt = now;
      alert.occurrenceCount += 1;
      alert.readingId = reading._id || null;

      // Preserve acknowledged status while updating the alert.
      await alert.save();
    } else {
      alert = await Alert.create({
        deviceId: device._id,
        readingId: reading._id || null,
        parameter,
        value,
        thresholdMin: threshold.min ?? null,
        thresholdMax: threshold.max ?? null,
        severity,
        type,
        status: "open",
        message,
        occurrenceCount: 1,
        lastSeenAt: now,
      });
    }

    generatedAlerts.push(alert);
  }

  return generatedAlerts;
};

module.exports = { evaluateReading };