import dbConnect from "../../mongoose/dbConnect";
import { mdbGpxModel } from "../../mongoose/gpx";
import { Gpx } from "../../model/gpx";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import dynamic from "next/dynamic";
import { authOptions } from "../api/auth/[...nextauth]/route";
const HeatMap = dynamic(() => import("./heatMap"), { ssr: false });

async function getGpxActivities(): Promise<Gpx[]> {
    await dbConnect();
    const result = await mdbGpxModel.find(
        {},
        { _id: 0, "points.longitude": 1, "points.latitude": 1 }
    );
    return result.map((r) => r.toObject());
}

export default async function HeatMapPage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/");
    }

    const gpxActivities = await getGpxActivities();

    return <HeatMap gpxs={gpxActivities} />;
}
