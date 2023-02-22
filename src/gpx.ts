import { z } from "zod";

const GpxPoint = z.object({
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
    time: z.coerce.date(),
    elevation: z.coerce.number(),
    heartRate: z.coerce.number()
});

const Gpx = z.object({
    name: z.string(),
    points: z.array(GpxPoint)
});

export type GpxPoint = z.infer<typeof GpxPoint>;
export type Gpx = z.infer<typeof Gpx>;

export function parseGpx(gpx: string): Gpx | null {
    const parser = new DOMParser();
    const doc = parser.parseFromString(gpx, "text/xml");
    const name =
        doc.getElementsByTagName("name").length > 0
            ? doc.getElementsByTagName("name")[0].textContent
            : null;

    const points = [] as any[];
    const xmlPoints = Array.prototype.slice.call(doc.getElementsByTagName("trkpt"));
    xmlPoints.forEach((val) => {
        const latitude = val.getAttribute("lat") as number;
        const longitude = val.getAttribute("lon") as number;
        const elevation =
            val.getElementsByTagName("ele").length > 0
                ? (val.getElementsByTagName("ele")[0].textContent as number)
                : null;
        const time =
            val.getElementsByTagName("time").length > 0
                ? (val.getElementsByTagName("time")[0].textContent as Date)
                : null;
        const heartRate =
            val.getElementsByTagName("gpxtpx:hr").length > 0
                ? (val.getElementsByTagName("gpxtpx:hr")[0].textContent as number)
                : null;
        points.push({
            latitude,
            longitude,
            elevation,
            time,
            heartRate
        });
    });
    const parse = Gpx.safeParse({ name, points });
    return parse.success ? parse.data : null;
}

const R = 6378140;

function degToRad(deg: number) {
    return (deg * Math.PI) / 180;
}

function twoPointsDistance(a: GpxPoint, b: GpxPoint): number {
    const deltaLatitude = degToRad(b.latitude - a.latitude);
    const deltaLongitude = degToRad(b.longitude - a.longitude);
    const tmp =
        Math.pow(Math.sin(deltaLatitude / 2), 2) +
        Math.cos(degToRad(a.latitude)) *
            Math.cos(degToRad(b.latitude)) *
            Math.pow(Math.sin(deltaLongitude / 2), 2);
    const greatCircleDistance = 2 * Math.atan2(Math.sqrt(tmp), Math.sqrt(1 - tmp));
    const planarDist = R * greatCircleDistance;
    return planarDist;
}

export function computeDistance(gpx: Gpx): number {
    let dist = 0;
    for (let i = 0; i < gpx.points.length - 1; i++) {
        dist += twoPointsDistance(gpx.points[i], gpx.points[i + 1]);
    }
    return dist;
}

export function gpxToLeafletPolyline(gpx: Gpx) {
    const pos = [] as any[];
    gpx.points.forEach((val) => {
        pos.push([val.latitude, val.longitude]);
    });
    return pos;
}
