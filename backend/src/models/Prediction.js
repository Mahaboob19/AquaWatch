const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
    {
        deviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Device",
            required: true,
        },
        model: {
            type: String,
            enum: ["logistic_regression","random_forest","xgboost","lstm","gru","aodegru"],
            required: true,
        },
        modelVersion: {
            type: String,
            required: true,
        },
        predictionType: {
            type: String,
            enum: ["risk","anomaly","forecast","contamination"],
            required: true,
        },
        generatedAt: {
            type: Date,
            default: Date.now,
        },
        horizon: {
            type: String,
            required: true,
        },
        riskLevel: {
            type: String,
            enum: ["low","medium","high"],
            default: null,
        },
        probability: {
            type: Number,
            min: 0,
            max: 1,
            default: null,
        },
        predictedValues: {
            type: Map,
            of: Number,
            default: {},
        },
        contributingFactors: {
            type: [String],
            default: [],
        }
    },
    {
        timestamps: true,
    }
);

predictionSchema.index({
    deviceId: 1,
    generatedAt: -1,
});

module.exports = mongoose.model("Prediction", predictionSchema);