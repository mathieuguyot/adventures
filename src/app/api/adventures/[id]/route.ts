import { NextResponse } from "next/server";
import { saveAdventure } from "../../../../mongoose/adventure";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]/route";

export async function POST(request: Request, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse(null, { status: 403 });
    }

    const adventureId = params.id;
    const adventure = JSON.parse(await request.text());
    const success = await saveAdventure(adventureId, adventure);
    return NextResponse.json({ success });
}
