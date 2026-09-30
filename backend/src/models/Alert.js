const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
    {
        deviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Device",
            required: true,
        },
        readingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WaterReading",
            required: true,
        },
        parameter: {
            type: String,
            required: true,
        },
        value: {
            type: Number,
            required: true,
        },
        thresholdMin: {
            type: Number,
            default: null,
        },
        thresholdMax: {
            type: Number,
            default: null,
        },
        severity: {
            type: String,
            enum: ["warning", "critical"],
            required: true,
        },
        type: {
            type: String,
            enum: ["high","low"],
            required: true,
        },
        status: {
            type: String,
            enum: ["open","acknowledged","resolved"],
            default: "open",
        },
        message: {
            type: String,
            required: true,
        },
        acknowledgedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        acknowledgedAt: {
            type: Date,
            default: null,
        },
        resolvedAt: {
            type: Date,
            default: null,
        }
    },
    {
        timestamps: true,
    }
);

alertSchema.index({
    deviceId: 1,
    status: 1,
    createdAt: -1,
});

module.exports = mongoose.model("Alert", alertSchema);