const mongoose = require("mongoose");

const thresholdSchema = new mongoose.Schema(
    {
        parameter: {
            type: String,
            required: true,
            enum: ["ph","temperature","dissolvedOxygen","turbidity","tds","conductivity","salinity","ammonia","nitrite","nitrate"],
        },
        min: {
            type: Number,
            required: true,
        },
        max: {
            type: Number,
            required: true,
        },
        warningMin: {
            type: Number,
            default: null,
        },
        warningMax: {
            type: Number,
            default: null,
        },
        criticalMin: {
            type: Number,
            default: null,
        },
        criticalMax: {
            type: Number,
            default: null,
        },
        scope: {
            type: String,
            enum: ["global","device"],
            default: "global",
        },
        deviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Device",
            default: null,
        },
        enabled: {
            type: Boolean,
            default: true,
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        }
    },
    {
        timestamps: true,
    }
);

thresholdSchema.index({
    parameter: 1,
    scope: 1,
    deviceId: 1,
});

module.exports = mongoose.model("Threshold", thresholdSchema);