import mongoose from "mongoose";

const MONGODB_URI = "mongodb://127.0.0.1:27017/test";

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached: any = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    await mongoose.connect("mongodb://127.0.0.1:27017/test");
}

export default dbConnect;
