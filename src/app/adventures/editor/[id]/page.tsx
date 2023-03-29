import { getAdventure } from "../../../../mongoose/adventure";
import { AdventureEditor } from "./adventureEditor";

export default async function AdventureEditorPage({ params }) {
    const adventureId = params.id;
    const adventure = await getAdventure(adventureId);

    if (!adventure) {
        return <>Could not find that adventure</>;
    }

    return <AdventureEditor adventure={adventure} />;
}
