const mongoose = require("mongoose");
const Alert = require("../models/Alert");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id.toLowerCase();

const getAlerts = async (req, res) => {
    try{
        const {status, severity, parameter, deviceId, start, end} = req.query;
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
        const filter = {};

        if(status){
            if(!["open", "acknowledged", "resolved"].includes(status)){
                return res.status(400).json({
                    success: false,
                    message: "Invalid alert status.",
                });
            }
            filter.status = status;
        }

        if(severity){
            if(!["warning", "critical"].includes(severity)){
                return res.status(400).json({
                    success: false,
                    message: "Invalid alert severity.",
                });
            }
            filter.severity = severity;
        }

        if(parameter){
            const allowed = ["ph", "temperature", "dissolvedOxygen", "turbidity", "tds", "conductivity", "salinity", "ammonia", "nitrite", "nitrate"];
            if(!allowed.includes(parameter)){
                return res.status(400).json({
                    success: false,
                    message: "Invalid water-quality parameter."
                });
            }
            filter.parameter = parameter;
        }

        if(deviceId) {
            if(!isValidObjectId(deviceId)){
                return res.status(400).json({
                    success: false,
                    message: "Invalid device MongoDB ID.",
                });
            }
            filter.deviceId = deviceId;
        }

        if(start || end){
            filter.createdAt = {};
            if(start){
                const startDate = new Date(start);
                if(Number.isNaN(startDate.getTime())){
                    return res.status(400).json({
                        success: false,
                        message: "Invalid start date.",
                    });
                }
                filter.createdAt.$gte = startDate;
            }
            if(end){
                const endDate = new Date(end);
                if(Number.isNaN(endDate.getTime())){
                    return res.status(400).json({
                        success: false,
                        message: "Invalid end date.",
                    });
                }
                filter.createdAt.$lte = endDate;
            }

            if(start && end && new Date(start) > new Date(end)){
                return res.status(400).json({
                    success: false,
                    message: "Start date must not be after end date.",
                });
            }
        }

        const [alerts, total] = await Promise.all([
            Alert.find(filter).populate("deviceId", "deviceId name location").sort({createdAt: -1}).skip((page - 1) * limit).limit(limit).lean(), Alert.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            data: alerts,
            pagination: {
                page, limit, total, totalPages: Math.ceil(total / limit),
            },
        });
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve alerts.",
        });
    }
};

const getOpenAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find({
            status: {$in: ["open", "acknowledged"]},
        }).populate("deviceId", "deviceId name location").sort({severity: -1, createdAt: -1}).limit(100).lean();

        return res.status(200).json({
            success: true,
            count: alerts.length,
            data: alerts,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve active alerts.",
        });
    }
};

const getAlertById = async (req, res) => {
    try {
        const {id} = req.params;
        if(!isValidObjectId(id)){
            return res.status(400).json({
                success: false,
                message: "Invalid alert ID.",
            });
        }
        const alert = await Alert.findById(id).populate("deviceId", "deviceId name location").populate("acknowledgedBy", "name email").populate("resolvedBy", "name email");
        if(!alert){
            return res.status(404).json({
                success: false,
                message: "Alert not found.",
            });
        }

        return res.status(200).json({
            success: true,
            data: alert,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve alert.",
        });
    }
};

const acknowledgeAlert = async (req, res) => {
    try {
        const {id} = req.params;
        if(!isValidObjectId(id)){
            return res.status(400).json({
                success: false,
                message: "Invalid alert ID.",
            });
        }
        const alert = await Alert.findById(id);
        if(!alert){
            return res.status(404).json({
                success: false,
                message: "Alert not found.",
            });
        }

        if(alert.status === "resolved"){
            return res.status(409).json({
                success: false,
                message: "A resolved alert cannot be acknowledged.",
            });
        }

        if(alert.status === "acknowledged"){
            return res.status(200).json({
                success: true,
                message: "Alert is already acknowledged.",
                data: alert,
            });
        }

        alert.status = "acknowledged";
        alert.acknowledgedAt = new Date();

        await alert.save();

        return res.status(200).json({
            success: true,
            message: "Alert acknowledged successfully.",
            data: alert,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to acknowledge alert.",
        });
    }
};

const resolveAlert = async (req, res) => {
    try {
        const {id} = req.params;
        const {resolutionReason} = req.body;
        if(!isValidObjectId(id)){
            return res.status(400).json({
                success: false,
                message: "Invalid alert ID.",
            });
        }
        if(resolutionReason !== undefined && (typeof resolutionReason !== "string" || resolutionReason.trim().length > 500)){
            return res.status(400).json({
                success: false,
                message: "Resolution reason must be a string of at most 500 characters.",
            });
        }
        const alert = await Alert.findById(id);
        if(!alert){
            return res.status(404).json({
                success: false,
                message: "Alert not found.",
            });
        }
        if(alert.status === "resolved"){
            return res.status(200).json({
                success: true,
                message: "Alert is already resolved.",
                data: alert,
            });
        }
        alert.status = "resolved";
        alert.resolvedAt = new Date();
        alert.resolutionReason = resolutionReason?.trim() || "Manually resolved.";

        await alert.save();

        return res.status(200).json({
            success: true,
            message: "Alert resolved successfully.",
            data: alert,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to resolve alert.",
        });
    }
};

module.exports = {getAlerts, getOpenAlerts, getAlertById, acknowledgeAlert, resolveAlert};