import { z } from "zod";

const LatLongImage = z.object({
    name: z.string(),
    src: z.string(),
    latitude: z.number(),
    longitude: z.number()
});

const AdventurePart = z.object({
    name: z.string(),
    activityId: z.string(),
    mdDescription: z.string(),
    images: z.array(LatLongImage)
});

const Adventure = z.object({
    name: z.string(),
    mdHeader: z.string(),
    mdFooter: z.string(),
    parts: z.array(AdventurePart)
});

export type LatLongImage = z.infer<typeof LatLongImage>;
export type AdventurePart = z.infer<typeof AdventurePart>;
export type Adventure = z.infer<typeof Adventure>;

export function extractLatLongImagesFromText(markdownText: string): LatLongImage[] {
    const imgRegex: RegExp = /<img.*?\/>/gm;
    const res = markdownText.matchAll(imgRegex);
    const images: LatLongImage[] = [];
    if (res) {
        [...res].forEach((imgHtmlStr) => {
            const srcRegex: RegExp = /src="(.*?)"/m;
            const latRegex: RegExp = /lat="(.*?)"/m;
            const longRegex: RegExp = /long="(.*?)"/m;
            const altRegex: RegExp = /alt="(.*?)"/m;
            const srcRegRes = srcRegex.exec(imgHtmlStr[0]);
            const latRegRes = latRegex.exec(imgHtmlStr[0]);
            const longRegRes = longRegex.exec(imgHtmlStr[0]);
            const altRegRes = altRegex.exec(imgHtmlStr[0]);
            if (srcRegRes && latRegRes && longRegRes && altRegRes) {
                const src = srcRegRes[0].slice(5).slice(0, -1);
                const name = altRegRes[0].slice(5).slice(0, -1);
                const latitude = latRegRes[0].slice(5).slice(0, -1);
                const longitude = longRegRes[0].slice(6).slice(0, -1);
                if (
                    !Number.isNaN(Number(latitude)) &&
                    !Number.isNaN(Number(longitude)) &&
                    src.length > 1 &&
                    name.length > 1
                ) {
                    images.push({
                        src,
                        name,
                        latitude: Number(latitude),
                        longitude: Number(longitude)
                    });
                }
            }
        });
    }
    return images;
}

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

export async function updateAdventure(adventureId: string, adventure: Adventure): Promise<boolean> {
    const response = await fetch(`/api/adventures/${adventureId}`, {
        method: "POST",
        body: JSON.stringify(adventure)
    });
    let success = false;
    if (response.ok) {
        const respData = JSON.parse(await response.text());
        success = "success" in respData ? respData.success : success;
    }
    return success;
}
