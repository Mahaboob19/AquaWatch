const Threshold = require("../models/Threshold");
const WCIRecord = require("../models/WCIRecord");

const PARAMETERS = ["ph", "temperature", "dissolvedOxygen", "turbidity", "tds", "conductivity", "salinity", "ammonia", "nitrite", "nitrate"];

const getThreshold = async (parameter, device) => {
    const deviceThreshold = await Threshold.findOne({
        parameter, scope: "device", deviceId: device._id, enabled: true,
    });
    if(deviceThreshold){
        return deviceThreshold;
    }

    return Threshold.findOne({
        parameter, scope: "global", enabled: true,
    });
};

const calculateParameterScope = (value, threshold) => {
    const warningMin = threshold.warningMin ?? threshold.min;
    const warningMax = threshold.warningMax ?? threshold.max;

    const criticalMin = threshold.criticalMin ?? threshold.min;
    const criticalMax = threshold.criticalMax ?? threshold.max;

    if(value >= warningMin && value <= warningMax){
        return 0;
    }

    if(value < warningMin){
        const distance = warningMin - criticalMin;
        if(distance <= 0 || value <= criticalMin){
            return 1;
        }
        return Math.min(1, (warningMin - value) / distance);
    }

    if(value > warningMax){
        const distance = criticalMax - warningMax;
        if(distance <= 0 || value >= criticalMax){
            return 1;
        }
        return math.min(1, (value - warningMax) / distance);
    }

    return 0;
};

const calculateWCI = async (reading, device) => {
    const parameterScores = {};
    let totalScore = 0;
    let evaluatedParameters = 0;

    for(const parameter of PARAMETERS){
        const value = reading[parameter];
        if(value === undefined || value === null){
            continue;
        }
        const threshold = await getThreshold(parameter, device);
        if(!threshold){
            continue;
        }
        const score = calculateParameterScope(value, threshold);

        parameterScores[parameter] = Number(scope.toFixed(4));
        totalScore += scope;
        evaluatedParameters += 1;
    }

    if(evaluatedParameters === 0){
        throw new Error("WCI cannot be calculated: no parameters have usable thresholds.");
    }

    const wciScore = Number((totalScore / evaluatedParameters).toFixed(4));

    return {wciScore, status: wciScore <= 0.5 ? "acceptable" : "contaminated", parameterScores, evaluatedParameters};
};

const calculateAndSaveWCI = async (reading, device) => {
    const result = await calculateWCI(reading, device);
    const record = await WCIRecord.create({
        readingId: reading._id,
        deviceId: device._id,
        timestamp: reading.timestamp || new Date(),
        wciScore: result.wciScore,
        status: result.status,
        parameterScores: result.parameterScores,
        methodVersion: "WCI-v1",
    });

    return {
        ...result,
        recordId: record._id,
        timestamp: record.timestamp,
        methodVersion: record.methodVersion,
    };
};

module.exports = {calculateWCI, calculateAndSaveWCI};