require("dotenv").config();

const {API_URL, DEVICE_ID, INTERVAL_MS, ANOMALY_PROBABILITY} = require("./config");
const {generateReading} = require("./generator");

let isRunning = false;

const sendReading = async () => {
    try{
        const sensorData = generateReading({anomalyProbability: ANOMALY_PROBABILITY});
        const payload = {
            deviceId: DEVICE_ID,
            timestamp: new Date().toISOString(),
            ...sensorData,
            dataSource: "simulator",
        };
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
        });
        const result = await response.json();

        if(!response.ok){
            throw new Error(result.message || `HTTP ${response.status}`);
        }

        console.log(
            `[${new Date().toISOString()}] Reading stored | `+
            `pH=${sensorData.ph} | `+
            `Temp=${sensorData.temperature}°C | `+
            `DO=${sensorData.dissolvedOxygen} | `+
            `NH3=${sensorData.ammonia} | `+
            `NO3=${sensorData.nitrate}`
        );
    }catch(err){
        console.error("Failed to send reading: ", err.message);
    }
};

const startSimulator = async () => {
    if(isRunning){
        return;
    }
    isRunning = true;

    console.log("");
    console.log("============================================");
    console.log("      AquaCulture Sensor Simulator");
    console.log("============================================");
    console.log(`Device: ${DEVICE_ID}`);
    console.log(`API: ${API_URL}`);
    console.log(`Interval: ${INTERVAL_MS} ms`);
    console.log(`Anomaly probability: ${ANOMALY_PROBABILITY * 100}%`);
    console.log("============================================");
    console.log("");

    await sendReading();

    setInterval(sendReading, INTERVAL_MS);
};

startSimulator();