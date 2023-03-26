import dbConnect from "../../../lib/dbConnect";
import { Gpx, gpxToElevationHighchartsData } from "../../../model/gpx";
import { mdbGpxModel } from "../../../mongoose/gpx";

import dynamic from "next/dynamic";
const LeafletMap = dynamic(() => import("./map"), { ssr: false });

async function getGpx(gpxId: string): Promise<Gpx | null> {
    await dbConnect();

    let gpx: Gpx | null = null;

    try {
        const result = await mdbGpxModel.findById(gpxId, { _id: 0, __v: 0, "points._id": 0 });
        gpx = await result.toObject();
    } catch (err) {
        console.log(err);
    }

    return gpx;
}

export default async function Page({ params }) {
    const gpx: Gpx | null = await getGpx(params.id);

    if (gpx === null) {
        return <>Could not find that gpx</>;
    }

    return (
        <>
            <LeafletMap gpx={gpx} chartData={gpxToElevationHighchartsData(gpx)} />
        </>
    );
}
