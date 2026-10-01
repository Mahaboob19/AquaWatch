module.exports = {
    API_URL: process.env.SIMULATOR_API_URL || "http://localhost:5000/api/v1/readings",
    DEVICE_ID: process.env.SIMULATOR_DEVICE_ID || "AQ-DEVICE-001",
    INTERVAL_MS: Number(process.env.SIMULATOR_INTERVAL_MS) || 10000,
    ANOMALY_PROBABILITY: Number(process.env.SIMULATOR_ANOMALY_PROBABILITY) || 0.20,
};