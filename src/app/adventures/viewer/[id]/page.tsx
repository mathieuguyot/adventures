import { getAdventure } from "../../../../mongoose/adventure";
import { getActivitiesById } from "../../../../mongoose/gpx";
import MarkdownEditor from "../../../common/markdownEditor";

export default async function AdventureViewerPage({ params }) {
    const adventureId = params.id;
    const adventure = await getAdventure(adventureId);

    if (!adventure) {
        return <>Could not find that adventure</>;
    }

    // const activities = await getActivitiesById(adventure.parts.map((a) => a.activityId));

    return (
        <div className="prose" style={{ maxWidth: "100%" }}>
            <h1>{adventure.name}</h1>
            <MarkdownEditor markdown={adventure.mdHeader} />
            {adventure.parts.map((p) => (
                <div key={p.activityId}>
                    <h2>{p.name}</h2>
                    <MarkdownEditor markdown={p.mdDescription} />
                </div>
            ))}
            <MarkdownEditor markdown={adventure.mdFooter} />
        </div>
    );
}
