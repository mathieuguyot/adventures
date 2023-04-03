import dbConnect from "../../mongoose/dbConnect";
import { mdbGpxModel } from "../../mongoose/gpx";
import Link from "next/link";
import { Gpx } from "../../model/gpx";
import moment from "moment";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";

async function getGpxActivities(): Promise<Gpx[]> {
    await dbConnect();
    const result = await mdbGpxModel.find({}, { _id: 0, points: 0 });
    return result;
}

export default async function ActivitiesPage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/");
    }

    const gpxActivities = await getGpxActivities();

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="table table-zebra table-compact w-full">
                    <thead>
                        <tr>
                            <th>Name ({gpxActivities.length} Activities in list)</th>
                            <th>Type</th>
                            <th>Distance (km)</th>
                            <th>Elevation (m)</th>
                            <th>Date</th>
                            <th>Id</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gpxActivities.map((gpx) => (
                            <tr key={gpx.activityId}>
                                <td>
                                    <Link href={`activities/${gpx.activityId}`}>{gpx.name}</Link>
                                </td>
                                <td>{gpx.activityType}</td>
                                <td>{Math.trunc(gpx.totalDistanceMeters / 1000)}</td>
                                <td>{Math.trunc(gpx.totalElevationMeters)}</td>
                                <td>{moment(gpx.time).format("DD/MM/YYYY").toString()}</td>
                                <td>{gpx.activityId}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* <img src="https://previews.dropbox.com/p/thumb/AB3cFBnAlXQ1s7g5LXYRsaqO89xLLVbeHqIsEgcSwDA9GK3SsDmyU4dWj6HOy-a35wACA193rkl9DnpArtmJJyaexVab0qa0k-pPuABbowU5zZiO--zHL6fKZ8jZRj-qdkNyg-ZE3YEmXV_uQ_5mP9zD5nAE21oN_DGNKIAN1OwZpTnKMYpvFJ19h8-v2cOKqqgCHWZdkuJbXF0d-Fc7-vS5b2Afz7jvabUNEQdUTSM1Dzn8kEqWD6bXXiXjV5a1hy2HVE-cN-PYjbU6toNGvbQ5BbuXVGkVneEnThIcsK57elQLUit05LvYYz-IysLYI9rM7thR6eP4rT3Q_UTefelnr1yLDzf6RP9xbdSnsD4q77fXzFND1bVnsRNHzU_f3fez_Rx3LZipn1LicFHYa-SbUwHRoDNBEywPfw_7L-gmgaoO8J2VhYB_fwdg1gD9OQs/p.jpeg" /> */}
        </div>
    );
}
