import mongoose from "mongoose";
import { Gpx } from "../model/gpx";
import dbConnect from "./dbConnect";

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

export const mdbGpxModel =
    mongoose.models && "Gpx" in mongoose.models
        ? (mongoose.models.Gpx as mongoose.Model<Gpx>)
        : mongoose.model<Gpx>("Gpx", mdbGpxSchema, "gpx");

export async function getGpxByActivityId(activityId: string): Promise<Gpx | null> {
    await dbConnect();

    let gpx: Gpx | null = null;

    try {
        const result = await mdbGpxModel.find(
            { activityId: activityId },
            { _id: 0, __v: 0, "points._id": 0 }
        );
        if (result.length > 0) {
            gpx = await result[0].toObject();
        }
    } catch (err) {
        console.error(err);
    }

    return gpx;
}
