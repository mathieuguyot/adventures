import { NextResponse } from "next/server";
import { getActivitiesById } from "../../../../mongoose/gpx";

export async function GET(_: Request, { params }) {
    const activityId = params.id;
    const gpxs = await getActivitiesById([activityId]);
    return NextResponse.json(gpxs.length > 0 ? gpxs[0] : null);
}
