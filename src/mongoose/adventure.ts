import mongoose from "mongoose";
import { Adventure } from "../model/adventure";
import dbConnect from "./dbConnect";

const mdbAdventureSchema = new mongoose.Schema<Adventure>({
    name: { type: String, required: true },
    mdHeader: { type: String, required: true },
    mdFooter: { type: String, required: true },
    parts: [
        {
            name: { type: String, required: true },
            activityId: { type: String, required: true },
            mdDescription: { type: String, required: true },
            images: [
                {
                    name: { type: String, required: true },
                    src: { type: String, required: true },
                    latitude: { type: Number, required: true },
                    longitude: { type: Number, required: true }
                }
            ]
        }
    ]
});

export const mdbAdventureModel =
    mongoose.models && "Adventure" in mongoose.models
        ? (mongoose.models.Adventure as mongoose.Model<Adventure>)
        : mongoose.model<Adventure>("Adventure", mdbAdventureSchema, "adventure");

export async function getAdventure(adventureId: string): Promise<Adventure | null> {
    await dbConnect();

    let adventure: Adventure | null = null;

    try {
        const result = await mdbAdventureModel.findById(adventureId, {
            _id: 0,
            __v: 0,
            "parts._id": 0,
            "parts.images._id": 0
        });
        if (result) {
            adventure = result.toObject();
        }
    } catch (err) {
        console.error(err);
    }

    return adventure;
}

export async function saveAdventure(adventureId: string, adventure: Adventure): Promise<boolean> {
    await dbConnect();

    try {
        await mdbAdventureModel.findOneAndReplace({ _id: adventureId }, adventure);
        return true;
    } catch (err) {
        console.error(err);
    }
    return false;
}
