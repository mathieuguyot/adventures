import dbConnect from "../lib/dbConnect";
import { mdbGpxModel } from "../mongoose/gpx";
import Link from "next/link";

import dynamic from "next/dynamic";
const HeatMap = dynamic(() => import("./heatMap"), { ssr: false });

async function getGpxNames() {
    await dbConnect();

    /* find all the data in our database */
    const result = await mdbGpxModel.find();
    const names = result.map((doc, i) => {
        return {
            name: doc.name,
            id: doc._id.toString(),
            points: doc.points.map((p) => ({ longitude: p.longitude, latitude: p.latitude })),
            totalDistance: doc.totalDistanceMeters,
            totalElevation: doc.totalElevationMeters,
            description: doc.description,
            totalTimeSec: doc.totalTimeSec,
            movingTimeSec: doc.movingTimeSec,
            averageSpeedMeterPerSec: doc.averageSpeedMeterPerSec,
            time: doc.time
        };
    });
    return names;
}

export default async function IndexPage() {
    const gpxNames = await getGpxNames();

    return (
        <div>
            GPX LIST ({gpxNames.length}):
            <br />
            {gpxNames.map(
                ({
                    name,
                    id,
                    totalDistance,
                    totalElevation,
                    totalTimeSec,
                    movingTimeSec,
                    description,
                    averageSpeedMeterPerSec,
                    time
                }: any) => (
                    <div key={id}>
                        * <Link href={`gpx/${id}`}>{name}</Link> {Math.trunc(totalDistance / 1000)}
                        km {Math.trunc(totalElevation)}
                        d+ {totalTimeSec}s {movingTimeSec} s{averageSpeedMeterPerSec}m/s{" "}
                        {description} - {time}
                        <br />
                    </div>
                )
            )}
            <HeatMap gpxs={gpxNames} />
        </div>
    );
}
