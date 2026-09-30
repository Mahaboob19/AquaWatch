const mongoose = require("mongoose");

const wciRecordSchema = new mongoose.Schema(
    {
        readingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WaterReading",
            required: true,
        },
        deviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Device",
            required: true,
        },
        timestamp: {
            type: Date,
            required: true,
        },
        wciScore: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["acceptable","contaminated"],
            required: true,
        },
        parameterScores: {
            type: Map,
            of: Number,
            default: {},
        },
        methodVersion: {
            type: String,
            default: "WCI-v1",
        }
    },
    {
        timestamps: true,
    }
);

wciRecordSchema.index({
    deviceId: 1,
    timestamp: -1,
});

module.exports = mongoose.model("WCIRecord", wciRecordSchema);