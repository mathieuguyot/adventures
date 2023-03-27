import dbConnect from "../../lib/dbConnect";
import { mdbGpxModel } from "../../mongoose/gpx";
import { Gpx } from "../../model/gpx";

import dynamic from "next/dynamic";
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
    const gpxActivities = await getGpxActivities();

    return <HeatMap gpxs={gpxActivities} />;
}
