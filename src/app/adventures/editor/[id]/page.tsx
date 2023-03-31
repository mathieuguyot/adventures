import { getAdventure } from "../../../../mongoose/adventure";
import { getActivitiesById } from "../../../../mongoose/gpx";
import { AdventureEditor } from "./adventureEditor";

export default async function AdventureEditorPage({ params }) {
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
