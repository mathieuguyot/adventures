import { NextResponse } from "next/server";
import { getGpxByActivityId } from "../../../../mongoose/gpx";

export async function GET(_: Request, { params }) {
    const activityId = params.id;
    return NextResponse.json(await getGpxByActivityId(activityId));
}
