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
