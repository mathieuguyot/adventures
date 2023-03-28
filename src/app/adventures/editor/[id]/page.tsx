import { getAdventure } from "../../../../mongoose/adventure";

export default async function AdventureEditorPage({ params }) {
    const adventureId = params.id;
    const adventure = await getAdventure(adventureId);

    if (!adventure) {
        return <>Could not find that adventure</>;
    }

    return (
        <div>
            Adventure creator {adventureId} {adventure.name}
        </div>
    );
}
