const { z } = require("zod");

const waterReadingSchema = z.object({
    deviceId: z.string().trim().min(1, "deviceId is required"),
    timestamp: z.string().datetime().optional(),
    ph: z.number().min(0).max(14).optional(),
    temperature: z.number().min(-10).max(60).optional(),
    dissolvedOxygen: z.number().min(0).max(30).optional(),
    turbidity: z.number().min(0).max(10000).optional(),
    tds: z.number().min(0).max(100000).optional(),
    conductivity: z.number().min(0).max(100000).optional(),
    salinity: z.number().min(0).max(100).optional(),
    ammonia: z.number().min(0).max(1000).optional(),
    nitrite: z.number().min(0).max(1000).optional(),
    nitrate: z.number().min(0).max(10000).optional(),
    dataSource: z.enum(["simulator", "iot", "import"]).optional(),
});

module.exports = {waterReadingSchema}