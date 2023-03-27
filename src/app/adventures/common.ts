import dbConnect from "../../lib/dbConnect";
import { Adventure } from "../../model/adventure";
import { mdbAdventureModel } from "../../mongoose/adventure";

export async function getAdventure(adventureId: string): Promise<Adventure | null> {
    await dbConnect();

    let adventure: Adventure | null = null;

    try {
        const result = await mdbAdventureModel.findById(adventureId, { _id: 0, __v: 0 });
        adventure = result.toObject();
    } catch (err) {
        console.error(err);
    }

    return adventure;
}

export async function createAdventure(adventureName: string) {
    const response = await fetch("/api/adventures/", {
        method: "PUT",
        body: adventureName
    });
    let adventureId = "";
    if (response.ok) {
        const respData = JSON.parse(await response.text());
        adventureId = respData.adventureId ?? "";
    }
    if (adventureId.length > 0) {
        // TODO temporary, use redirect when fixed ?
        window.location.replace(`/adventures/editor/${adventureId}`);
    }
    return adventureId.length > 0;
}
