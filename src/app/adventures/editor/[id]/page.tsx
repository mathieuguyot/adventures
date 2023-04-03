import { getServerSession } from "next-auth";
import { getAdventure } from "../../../../mongoose/adventure";
import { getActivitiesById } from "../../../../mongoose/gpx";
import { AdventureEditor } from "./adventureEditor";
import { authOptions } from "../../../../../pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";

export default async function AdventureEditorPage({ params }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/");
    }

    const adventureId = params.id;
    const adventure = await getAdventure(adventureId);

    if (!adventure) {
        return <>Could not find that adventure</>;
    }

    const activities = await getActivitiesById(adventure.parts.map((a) => a.activityId));

    return (
        <AdventureEditor adventure={adventure} adventureId={adventureId} activities={activities} />
    );
}
