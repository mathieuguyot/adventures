import { NextResponse } from "next/server";
import { saveAdventure } from "../../../../mongoose/adventure";

export async function POST(request: Request, { params }) {
    const adventureId = params.id;
    const adventure = JSON.parse(await request.text());
    const success = await saveAdventure(adventureId, adventure);
    return NextResponse.json({ success });
}
