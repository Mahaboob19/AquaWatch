const mongoose = require("mongoose");
const WCIRecord = require("../models/WCIRecord");

const getWCIByReadingId = async (req, res) => {
    try {
        const {readingId} = req.params;
        if(!mongoose.isValidObjectId(readingId)){
            return res.status(400).json({
                success: false,
                message: "Invalid reading ID.",
            });
        }

        const record = await WCIRecord.findOne({readingId}).populate("deviceId", "deviceId name location").lean();
        if(!record){
            return res.status(404).json({
                success: false,
                message: "WCI record not found for this reading.",
            });
        }

        return res.status(200).json({
            success: true,
            data: record,
        });
    } catch (err) {
        console.error("WCI retrieval error: ",err.message);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve WCI record.",
        });
    }
};

module.exports = {getWCIByReadingId};