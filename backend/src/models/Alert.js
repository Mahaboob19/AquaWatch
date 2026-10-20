const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
    {
        deviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Device",
            required: true,
            index: true,
        },
        readingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WaterReading",
            default: null,
        },
        parameter: {
            type: String,
            required: true,
            enum: ["ph","temperature","dissolvedOxygen","turbidity","tds","conductivity","salinity","ammonia","nitrite","nitrate"],
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
            index: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
        occurrenceCount: {
            type: Number,
            required: true,
            trim: true,
        },
        lastSeenAt: {
            type: Date,
            default: Date.now,
        },
        acknowledgedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        resolvedBy: {
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
        },
        resolutionReason: {
            type: String,
            trim: true,
            default: null,
        },
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

alertSchema.index({
    deviceId: 1,
    parameter: 1,
    type: 1,
    status: 1,
});

module.exports = mongoose.model("Alert", alertSchema);