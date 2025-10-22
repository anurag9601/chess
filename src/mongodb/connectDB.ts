import mongoose from "mongoose";

interface I {
    isConnected?: boolean;
    connectionId?: number;
}

const url = process.env.MONGODB_URL || "";

const connection: I = {};

export async function connectMongoDB() {
    if (connection.isConnected && connection.connectionId) {
        console.log("MongoDB is already connected");
        return;
    };

    try {
        const db = await mongoose.connect(url as string);

        connection.isConnected = true;
        connection.connectionId = db.connections[0].readyState;

        console.log("MongoDB connected successfully 🚀.");

    } catch (error) {
        console.log("Error while connecting MongoDB", error);

        process.exit(1);
    }
}