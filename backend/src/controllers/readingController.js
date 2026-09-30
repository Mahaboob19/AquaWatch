const WaterReading = require("../models/WaterReading");
const Device = require("../models/Device");

const createReading = async (req,res) => {
    try {
        const {
            deviceId,
            timestamp,
            ph,
            temperature,
            dissolvedOxygen,
            turbidity,
            tds,
            conductivity,
            salinity,
            ammonia,
            nitrite,
            nitrate,
            dataSource,
        } = req.body;

        //validate deviceId
        if(!deviceId){
            return res.status(400).json({
                success: false,
                message: "deviceId is required",
            });
        }

        //check deviceId
        const device = await Device.findOne({deviceId});
        if(!device){
            return res.status(404).json({
                success: false,
                message: "Device not found",
            });
        }

        const reading = await WaterReading.create({
            deviceId,
            timestamp: timestamp ? new Date(timestamp) : new Date(),
            ph, temperature, dissolvedOxygen, turbidity,
            tds, conductivity, salinity, ammonia, nitrite, nitrate,
            dataSource: dataSource || "simulator",
        });

        //update device last seen info.
        await Device.updateOne(
            {deviceId},
            {
                $set: {
                    status: "online",
                    lastSeenAt: new Date(),
                }
            }
        );
        res.status(201).json({
            success: true,
            message: "Water reading stored successfully",
            data: reading,
        });
    } catch (err) {
        console.error("Create reading error: ",err);
        res.status(500).json({
            success: false,
            message: "Failed to store water reading",
            error: err.message,
        });
    }
};


const getLatestReading = async (req,res) => {
    try {
        const { deviceId } = req.params;
        const reading = await WaterReading.findOne({deviceId}).sort({timestamp: -1});
        if(!reading){
            return res.status(404).json({
                success: false,
                message: "No readings found for this device",
            });
        }

        res.status(200).json({
            success: true,
            data: reading,
        });
    } catch (err) {
        console.error("Get latest reading error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch latest reading",
            error: error.message,
        });
    }
};


const getReadingHistory = async (req,res) => {
    try {
        const {deviceId} = req.params;
        const {start, end, limit = 100} = req.query;
        const query = {deviceId};

        if(start || end){
            query.timestamp = {};
            if(start){
                query.timestamp.$gte = new Date(start);
            }
            if(end){
                query.timestamp.$lte = new Date(end);
            }
        }

        const readings = await WaterReading.find(query).sort({timestamp: -1}).limit(Math.min(Number(limit), 1000));

        res.status(200).json({
            success: true,
            count: readings.length,
            data: readings,
        });
    } catch (err) {
        console.error("Get reading history error: ",err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch reading history",
            error: err.message,
        });
    }
};


const getReadingById = async (req,res) => {
    try {
        const {id} = req.params;
        const reading = await WaterReading.findById(id);

        if(!reading){
            return res.status(404).json({
                success: false,
                message: "Reading not found",
            });
        }
        res.status(200).json({
            success: true,
            data: reading,
        });
    } catch (err) {
        console.error("Get reading error: ",err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch reading",
            error: err.message,
        });
    }
};

module.exports = { createReading, getLatestReading, getReadingHistory, getReadingById};