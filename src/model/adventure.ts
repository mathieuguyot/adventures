import { z } from "zod";

const AdventurePart = z.object({
    name: z.string(),
    activityId: z.string(),
    mdDescription: z.string()
});

const Adventure = z.object({
    name: z.string(),
    mdHeader: z.string(),
    mdFooter: z.string(),
    parts: z.array(AdventurePart)
});

export type AdventurePart = z.infer<typeof AdventurePart>;
export type Adventure = z.infer<typeof Adventure>;

export async function createAdventure(adventureName: string): Promise<boolean> {
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
