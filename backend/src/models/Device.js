const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
    {
        deviceId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ["online", "offline"],
            default: "offline",
        },
        dataSource: {
            type: String,
            enum: ["simulator","iot","import"],
            default: "simulator",
        },
        firmwareVersion: {
            type: String,
            default: "1.0.0",
        },
        lastSeenAt: {
            type: Date,
            default: null,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Device", deviceSchema);