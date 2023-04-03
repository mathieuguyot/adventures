import { NextResponse } from "next/server";
import dbConnect from "../../../mongoose/dbConnect";
import { Adventure } from "../../../model/adventure";
import { mdbAdventureModel } from "../../../mongoose/adventure";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse(null, { status: 403 });
    }

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
