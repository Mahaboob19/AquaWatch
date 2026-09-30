require("dotenv").config();
const mongoose = require("mongoose");

const initDatabase = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
        console.log("DataBase: ",mongoose.connection.name);

        const db = mongoose.connection.db;

        // Check whether water Reading alrady exists
        const collections = await db.listCollections({name: "waterReadings"}).toArray();

        if(collections.length === 0){
            await db.createCollection("waterReadings",{
                timeseries: {
                    timeField: "timestamp",
                    metaField: "deviceId",
                    granularity: "minutes",
                },
            });

            console.log("Time-Series collection 'waterReadings' created");
        }else{
            console.log("Collection 'waterReadings' already exixts.");
        }

        console.log("Database initialization completed.");
        await mongoose.disconnect();
    }catch(err){
        console.error("Database initialization failed: ", err.message);
        process.exit(1);
    }
};

initDatabase();