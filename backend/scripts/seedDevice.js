require("dotenv").config();

const mongoose = require("mongoose");
const Device = require("../src/models/Device");

const seedDevice = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        const existingDevice = await Device.findOne({
            deviceId: "AQ-DEVICE-001",
        });
        if(existingDevice){
            console.log("Device already exists.");
            await mongoose.disconnect();
            return;
        }

        const device = await Device.create({
            deviceId: "AQ-DEVICE-001",
            name: "Aquaculture Pond 1",
            location: "Pond 1",
            status: "online",
            dataSource: "simulator",
            firmwareVersion: "1.0.0",
            lastSeenAt: new Date(),
        });

        console.log("Device Created: ");
        console.log(device);

        await mongoose.disconnect();
    }catch (err){
        console.error("Failed: ",err.message);
        process.exit(1);
    }
};

seedDevice();