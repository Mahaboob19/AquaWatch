require("dotenv").config();

const mongoose = require("mongoose");
const WaterReading = require("../src/models/WaterReading");

const seedReading = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const reading = await WaterReading.create({
            timestamp: new Date(),
            deviceId: "AQ-DEVICE-001",
            ph: 7.24,
            temperature: 27.8,
            dissolvedOxygen: 6.91,
            turbidity: 3.42,
            tds: 420.5,
            conductivity: 680.2,
            salinity: 0.34,
            ammonia: 0.21,
            nitrite: 0.08,
            nitrate: 12.4,
            dataSource: "simulator",
        });

        console.log("Water reading inserted");
        console.log(reading);

        await mongoose.disconnect();
    }catch(err) {
        console.error("Failed to insert reading: ", err.message);
        process.exit(1);
    }
};

seedReading();