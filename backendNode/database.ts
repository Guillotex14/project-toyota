import mongoose, { connection, connect } from "mongoose";
import { mongoDBUri } from "./config";

export async function connectToDB() {
    try {
        await connect(mongoDBUri);
        console.log("Connected to MongoDB");
        const collect = await connection.db.collection('Users').find().toArray();
        // const { db } = mongoose.connection;
        // const result = await db.collection('Users').find().toArray();
        console.log("DB Name:", collect);


    } catch (error) {
        console.log("Error connecting to MongoDB");
        console.log(error);
    }
}

connection.on("connected", () => {
    console.log("Mongoose connected to DB Cluster", connection.db.databaseName);
});

connection.on("error", (error) => {
    console.log("Mongoose connection error", error);
});

connection.on("disconnected", () => {
});
    console.log("Mongoose disconnected");

