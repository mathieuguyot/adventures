import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import { Adventure } from "../../../model/adventure";
import { mdbAdventureModel } from "../../../mongoose/adventure";

export async function PUT(request: Request) {
    const adventureName = await request.text();
    const adventure: Adventure = {
        name: adventureName.length > 0 ? adventureName : "No named adventure",
        mdHeader: "Teel how this story started !",
        mdFooter: "Teel how this story ended !",
        parts: []
    };
    let adventureId = "";
    try {
        await dbConnect();
        const resp = await mdbAdventureModel.create(adventure);
        adventureId = resp.id;
    } catch (err) {
        console.error(err);
    }
    return NextResponse.json({ adventureId });
}
