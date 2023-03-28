import { z } from "zod";
import Highcharts from "highcharts";
import { DOMParser } from "@xmldom/xmldom";
import moment from "moment";

const BaseGpxPoint = z.object({
    latitude: z.coerce.number(),
    longitude: z.coerce.number(),
    time: z.string().datetime(),
    elevation: z.coerce.number(),
    heartRate: z.coerce.number().nonnegative().optional()
});

const BaseGpx = z.object({
    activityId: z.string(),
    activityType: z.string(),
    name: z.string(),
    time: z.string().datetime(),
    points: z.array(BaseGpxPoint),
    description: z.ostring(),
    totalElevationMeters: z.number(),
    averageSpeedMeterPerSec: z.number(),
    movingTimeSec: z.number(),
    totalTimeSec: z.number()
});

type BaseGpxPoint = z.infer<typeof BaseGpxPoint>;
type BaseGpx = z.infer<typeof BaseGpx>;

const GpxPoint = BaseGpxPoint.extend({
    accumulatedDistanceMeters: z.number()
});

const Gpx = z.object({
    activityId: z.string(),
    activityType: z.string(),
    name: z.string(),
    time: z.string().datetime(),
    points: z.array(GpxPoint),
    centroid: z.tuple([z.number(), z.number()]),
    totalDistanceMeters: z.number(),
    description: z.ostring(),
    totalElevationMeters: z.number(),
    averageSpeedMeterPerSec: z.number(),
    movingTimeSec: z.number(),
    totalTimeSec: z.number()
});

export type GpxPoint = z.infer<typeof GpxPoint>;
export type Gpx = z.infer<typeof Gpx>;

export function parseGpx(gpxStr: string): Gpx | null {
    const gpx = parseGpxBase(gpxStr);
    if (gpx === null) {
        return null;
    }
    const enrichedPoints = enrichPoints(gpx.points);
    const enrichedGpx: Gpx = {
        name: gpx.name,
        points: enrichedPoints,
        centroid: computeGpxCentroid(gpx),
        totalDistanceMeters:
            enrichedPoints.length > 0
                ? enrichedPoints[enrichedPoints.length - 1].accumulatedDistanceMeters
                : 0,
        activityId: gpx.activityId,
        activityType: gpx.activityType,
        time: gpx.time,
        description: gpx.description,
        totalElevationMeters: gpx.totalElevationMeters,
        averageSpeedMeterPerSec: gpx.averageSpeedMeterPerSec,
        movingTimeSec: gpx.movingTimeSec,
        totalTimeSec: gpx.totalTimeSec
    };
    return enrichedGpx;
}

export function enrichPoints(points: BaseGpxPoint[]): GpxPoint[] {
    const enrichedPoints: GpxPoint[] = [];
    let totalDistanceMeters = 0;
    let prevPoint: BaseGpxPoint | null = null;
    points.forEach((p) => {
        totalDistanceMeters += prevPoint ? twoPointsDistance(prevPoint, p) : 0;
        prevPoint = p;
        enrichedPoints.push({
            ...p,
            accumulatedDistanceMeters: totalDistanceMeters
        });
    });
    return enrichedPoints;
}

function parseGpxBase(gpx: string): BaseGpx | null {
    const parser = new DOMParser();
    const doc = parser.parseFromString(gpx, "text/xml");
    const name =
        doc.getElementsByTagName("name").length > 0
            ? doc.getElementsByTagName("name")[0].textContent
            : null;
    const dataDesc =
        doc.getElementsByTagName("desc").length > 0
            ? doc.getElementsByTagName("desc")[0].textContent.split("|")
            : null;
    const time =
        dataDesc.length >= 1
            ? moment(dataDesc[0], "MMM DD, YYYY, h:m:s A").utc(true).format().toString()
            : Date.now().toString();
    const totalTimeSec = dataDesc.length >= 2 ? Number(dataDesc[1]) : 0;
    const movingTimeSec = dataDesc.length >= 3 ? Number(dataDesc[2]) : 0;
    const averageSpeedMeterPerSec = dataDesc.length >= 4 ? Number(dataDesc[3]) : 0;
    const totalElevationMeters = dataDesc.length >= 5 ? Number(dataDesc[4]) : 0;
    const activityId = dataDesc.length >= 6 ? String(dataDesc[5]) : "";
    const activityType = dataDesc.length >= 7 ? dataDesc[6] : "";
    const description = dataDesc.length >= 8 ? dataDesc[7] : "";
    const points = [] as any[];
    const xmlPoints = Array.prototype.slice.call(doc.getElementsByTagName("trkpt"));
    xmlPoints.forEach((val) => {
        const latitude = val.getAttribute("lat");
        const longitude = val.getAttribute("lon");
        const elevation =
            val.getElementsByTagName("ele").length > 0
                ? val.getElementsByTagName("ele")[0].textContent
                : null;
        const time =
            val.getElementsByTagName("time").length > 0
                ? val.getElementsByTagName("time")[0].textContent
                : null;
        const heartRate =
            val.getElementsByTagName("gpxtpx:hr").length > 0
                ? val.getElementsByTagName("gpxtpx:hr")[0].textContent
                : null;
        points.push({
            latitude,
            longitude,
            elevation,
            time,
            heartRate
        });
    });
    const parse = BaseGpx.safeParse({
        activityId,
        activityType,
        name,
        time,
        points,
        description,
        totalElevationMeters,
        averageSpeedMeterPerSec,
        movingTimeSec,
        totalTimeSec
    });
    if (parse.success === false) {
        console.log((parse as any).error);
    }
    return parse.success ? parse.data : null;
}

const EARTH_RADIUS_METERS = 6378140;

function degToRad(deg: number) {
    return (deg * Math.PI) / 180;
}

function twoPointsDistance(a: BaseGpxPoint, b: BaseGpxPoint): number {
    const deltaLatitude = degToRad(b.latitude - a.latitude);
    const deltaLongitude = degToRad(b.longitude - a.longitude);
    const tmp =
        Math.pow(Math.sin(deltaLatitude / 2), 2) +
        Math.cos(degToRad(a.latitude)) *
            Math.cos(degToRad(b.latitude)) *
            Math.pow(Math.sin(deltaLongitude / 2), 2);
    const greatCircleDistance = 2 * Math.atan2(Math.sqrt(tmp), Math.sqrt(1 - tmp));
    const planarDist = EARTH_RADIUS_METERS * greatCircleDistance;
    return planarDist;
}

export function gpxToLeafletPolyline(gpx: BaseGpx) {
    const pos = [] as any[];
    gpx.points.forEach((val) => {
        pos.push([val.latitude, val.longitude]);
    });
    return pos;
}

function computeGpxCentroid(gpx: BaseGpx): [number, number] {
    if (gpx.points.length === 0) {
        return [0, 0];
    }
    const latitudes = [] as number[];
    const longitudes = [] as number[];
    gpx.points.forEach((val) => {
        latitudes.push(val.latitude);
        longitudes.push(val.longitude);
    });
    const latitudesSum = latitudes.reduce((partialSum, a) => partialSum + a, 0);
    const longitudesSum = longitudes.reduce((partialSum, a) => partialSum + a, 0);
    return [latitudesSum / gpx.points.length, longitudesSum / gpx.points.length];
}

export function gpxToElevationHighchartsData(gpx: Gpx): Highcharts.Options {
    return {
        title: {
            text: "Elevation",
            align: "left"
        },
        plotOptions: {
            series: {
                turboThreshold: 10000
            }
        },
        chart: {
            height: "300px",
            zooming: {
                type: "x"
            }
        },
        xAxis: {
            type: "linear",
            title: {
                text: "Distance (m)"
            }
        },
        yAxis: {
            type: "linear",
            title: {
                text: "Elevation (m)"
            }
        },
        series: [
            {
                name: "Elevation",
                type: "line",
                data: gpx.points.map((p, i) => [p.accumulatedDistanceMeters, p.elevation, i])
            }
        ]
    };
}
