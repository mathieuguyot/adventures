import { getAdventure } from "../../../../mongoose/adventure";
import { getActivitiesById } from "../../../../mongoose/gpx";
import MarkdownEditor from "../../../common/markdownEditor";
import { LatLongImage } from "../../../../model/adventure";
import AdventureMap from "../../adventureMap";

export default async function AdventureViewerPage({ params }) {
    const adventureId = params.id;
    const adventure = await getAdventure(adventureId);

    if (!adventure) {
        return <>Could not find that adventure</>;
    }

    const activities = await getActivitiesById(adventure.parts.map((a) => a.activityId));

    let images: LatLongImage[] = [];
    adventure.parts.forEach((part) => {
        images = images.concat(part.images);
    });

    return (
        <div className="prose flex" style={{ maxWidth: "100%" }}>
            <div
                className="flex-auto sticky"
                style={{ minWidth: "50%", alignSelf: "flex-start", padding: 32, top: 32 }}
            >
                <AdventureMap gpxs={activities} images={images} minHeight="calc(100vh - 130px)" />
            </div>

            <div style={{ minWidth: "50%", paddingRight: 32, paddingTop: 16, textJustify: "auto" }}>
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
        </div>
    );
}
