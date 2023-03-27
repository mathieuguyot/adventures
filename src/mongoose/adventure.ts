import mongoose from "mongoose";
import { Adventure } from "../model/adventure";

const mdbAdventureSchema = new mongoose.Schema<Adventure>({
    name: { type: String, required: true },
    mdHeader: { type: String, required: true },
    mdFooter: { type: String, required: true },
    parts: [
        {
            name: { type: String, required: true },
            activityId: { type: String, required: true },
            mdDescription: { type: String, required: true }
        }
    ]
});

export const mdbAdventureModel = mongoose.model<Adventure>(
    "Adventure",
    mdbAdventureSchema,
    "adventure"
);
