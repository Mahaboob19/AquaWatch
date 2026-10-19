require("dotenv").config();

const mongoose = require("mongoose");

const Threshold =
  require("../src/models/Threshold");

const thresholds = [
  {
    parameter: "ph",
    min: 6.5,
    max: 8.5,
    warningMin: 6.8,
    warningMax: 8.2,
    criticalMin: 6.0,
    criticalMax: 9.0,
    scope: "global",
    enabled: true,
  },

  {
    parameter: "temperature",
    min: 18,
    max: 30,
    warningMin: 19,
    warningMax: 29,
    criticalMin: 10,
    criticalMax: 35,
    scope: "global",
    enabled: true,
  },

  {
    parameter: "dissolvedOxygen",
    min: 5,
    max: 15,
    warningMin: 4,
    warningMax: 16,
    criticalMin: 3,
    criticalMax: 20,
    scope: "global",
    enabled: true,
  },

  {
    parameter: "turbidity",
    min: 0,
    max: 5,
    warningMin: null,
    warningMax: 5,
    criticalMin: null,
    criticalMax: 10,
    scope: "global",
    enabled: true,
  },

  {
    parameter: "tds",
    min: 0,
    max: 500,
    warningMin: null,
    warningMax: 500,
    criticalMin: null,
    criticalMax: 1000,
    scope: "global",
    enabled: true,
  },

  {
    parameter: "conductivity",
    min: 0,
    max: 1500,
    warningMin: null,
    warningMax: 1500,
    criticalMin: null,
    criticalMax: 3000,
    scope: "global",
    enabled: true,
  },

  {
    parameter: "salinity",
    min: 0,
    max: 1,
    warningMin: null,
    warningMax: 1,
    criticalMin: null,
    criticalMax: 2,
    scope: "global",
    enabled: true,
  },

  {
    parameter: "ammonia",
    min: 0,
    max: 0.5,
    warningMin: null,
    warningMax: 0.5,
    criticalMin: null,
    criticalMax: 1,
    scope: "global",
    enabled: true,
  },

  {
    parameter: "nitrite",
    min: 0,
    max: 1,
    warningMin: null,
    warningMax: 1,
    criticalMin: null,
    criticalMax: 2,
    scope: "global",
    enabled: true,
  },

  {
    parameter: "nitrate",
    min: 0,
    max: 20,
    warningMin: null,
    warningMax: 20,
    criticalMin: null,
    criticalMax: 40,
    scope: "global",
    enabled: true,
  },
];

const seedThresholds = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    await Threshold.deleteMany({
      scope: "global",
    });

    await Threshold.insertMany(
      thresholds
    );

    console.log(
      "Default thresholds inserted successfully."
    );

    await mongoose.disconnect();
  } catch (error) {
    console.error(
      "Threshold seed failed:",
      error.message
    );

    process.exit(1);
  }
};

seedThresholds();