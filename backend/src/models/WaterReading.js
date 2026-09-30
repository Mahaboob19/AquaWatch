const mongoose = require("mongoose");

const waterReadingSchema = new mongoose.Schema(
    {
        timestamp: {
            type: Date,
            required: true,
        },
        deviceId: {
            type: String,
            required: true,
        },
        ph: {
            type: Number,
            default: null,
        },
        temperature: {
            type: Number,
            default: null,
        },
        dissolvedOxygen: {
            type: Number,
            default: null,
        },
        turbidity: {
            type: Number,
            default: null,
        },
        tds: {
            type: Number,
            default: null,
        },
        conductivity: {
            type: Number,
            default: null,
        },
        salinity: {
            type: Number,
            default: null,
        },
        ammonia: {
            type: Number,
            default: null,
        },
        nitrite: {
            type: Number,
            default: null,
        },
        nitrate: {
            type: Number,
            default: null,
        },
        dataSource: {
            type: String,
            enum: ["simulator","iot","import"],
            default: "simulator",
        },
    },
    {
        versionKey: false,
    }
);

module.exports = mongoose.model("WaterReading", waterReadingSchema, "waterReadings");