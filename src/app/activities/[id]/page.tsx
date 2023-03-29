import { Gpx, gpxToElevationHighchartsData } from "../../../model/gpx";
import { getGpxByActivityId } from "../../../mongoose/gpx";

import dynamic from "next/dynamic";
const LeafletMap = dynamic(() => import("./map"), { ssr: false });

export default async function Page({ params }) {
    const gpx: Gpx | null = await getGpxByActivityId(params.id);

    if (gpx === null) {
        return <>Could not find that gpx</>;
    }

    return (
        <>
            <LeafletMap gpx={gpx} chartData={gpxToElevationHighchartsData(gpx)} />
        </>
    );
}
