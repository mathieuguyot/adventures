import mongoose from "mongoose";
import { Gpx } from "../model/gpx";

const mdbGpxSchema = new mongoose.Schema<Gpx>({
    activityId: { type: String, required: true },
    activityType: { type: String, required: true },
    name: { type: String, required: true },
    time: { type: String, required: true },
    centroid: { type: [{ type: Number, required: true }], required: true },
    totalElevationMeters: { type: Number, required: true },
    averageSpeedMeterPerSec: { type: Number, required: true },
    movingTimeSec: { type: Number, required: true },
    totalTimeSec: { type: Number, required: true },
    description: { type: String, required: false },
    totalDistanceMeters: { type: Number, required: true },
    points: [
        {
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true },
            elevation: { type: Number, required: true },
            time: { type: String, required: true },
            heartRate: { type: Number, required: false },
            accumulatedDistanceMeters: { type: Number, required: true }
        }
    ]
});

export const mdbGpxModel = mongoose.model<Gpx>("Gpx", mdbGpxSchema, "gpx");
