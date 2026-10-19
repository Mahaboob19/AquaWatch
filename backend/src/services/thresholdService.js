const Threshold = require("../models/Threshold");
const Alert = require("../models/Alert");

const PARAMETERS = [
    "ph", "temperature", "dissolvedOxygen", "turbidity", "tds", "conductivity", "salinity", "ammonia", "nitrite", "nitrate"
];

const getThresholdForParameter = async (parameter, device) => {
    const deviceThreshold = await Threshold.findOne({
        parameter,
        scope: "device",
        deviceId: device._id,
        enabled: true,
    });
    if(deviceThreshold){
        return deviceThreshold;
    }

    return Threshold.findOne({
        parameter,
        scope: "global",
        enabled: true,
    });
};

const evaluateReading = async (reading, device) => {
    const alerts = [];
    for(const parameter of PARAMETERS){
        const value = reading[parameter];
        if(value === undefined || value === null){
            continue;
        }
        const threshold = await getThresholdForParameter(parameter, device);
        if(!threshold){
            continue;
        }
        let severity = null;
        let type = null;
        let message = null;

        if(threshold.criticalMin !== null && value < threshold.criticalMin){
            severity = "critical";
            type = "low";
            message = `${parameter} is below the critical minimum.`;
        }else if(threshold.criticalMax !== null && value > threshold.criticalMax){
            severity = "critical";
            type = "high";
            message = `${parameter} is above the critical maximum.`;
        }else if(threshold.warningMin !== null && value < threshold.warningMin){
            severity = "warning";
            type = "low";
            message = `${parameter} is below the warning minimum`;
        }else if(threshold.warningMax !== null && value > threshold.warningMax){
            severity = "warning";
            type = "high";
            message = `${parameter} is above the warning maximum.`;
        }

        if(severity){
            const alert = await Alert.create({
                deviceId: device._id,
                readingId: reading._id,
                parameter,
                value,
                thresholdMin: threshold.min,
                thresholdMax: threshold.max,
                severity,
                type,
                status: "open",
                message,
            });

            alerts.push(alert);
        }
    }
    return alerts;
};

module.exports = {evaluateReading};