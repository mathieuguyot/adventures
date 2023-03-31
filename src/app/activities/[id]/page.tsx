import { Gpx, gpxToElevationHighchartsData } from "../../../model/gpx";
import { getActivitiesById } from "../../../mongoose/gpx";

import dynamic from "next/dynamic";
const LeafletMap = dynamic(() => import("./map"), { ssr: false });

export default async function Page({ params }) {
    const gpxs: Gpx[] | null = await getActivitiesById([params.id]);

    if (gpxs.length === 0) {
        return <>Could not find that gpx</>;
    }

    return (
        <>
            <LeafletMap gpx={gpxs[0]} chartData={gpxToElevationHighchartsData(gpxs[0])} />
        </>
    );
}
