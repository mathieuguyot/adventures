import { z } from "zod";
import Highcharts from "highcharts";

const BaseGpxPoint = z.object({
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  time: z.coerce.date(),
  elevation: z.coerce.number(),
  heartRate: z.coerce.number().nonnegative().optional(),
});

const BaseGpx = z.object({
  name: z.string(),
  points: z.array(BaseGpxPoint),
});

type BaseGpxPoint = z.infer<typeof BaseGpxPoint>;
type BaseGpx = z.infer<typeof BaseGpx>;

const GpxPoint = BaseGpxPoint.extend({
  accumulatedDistanceMeters: z.number(),
});

const Gpx = z.object({
  name: z.string(),
  points: z.array(GpxPoint),
  centroid: z.tuple([z.number(), z.number()]),
});

export type GpxPoint = z.infer<typeof GpxPoint>;
export type Gpx = z.infer<typeof Gpx>;

export function parseGpx(gpxStr: string): Gpx | null {
  const gpx = parseGpxBase(gpxStr);
  if (gpx === null) {
    return null;
  }
  const enrichedGpx: Gpx = {
    name: gpx.name,
    points: enrichPoints(gpx.points),
    centroid: computeGpxCentroid(gpx),
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
      accumulatedDistanceMeters: totalDistanceMeters,
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

  const points = [] as any[];
  const xmlPoints = Array.prototype.slice.call(
    doc.getElementsByTagName("trkpt")
  );
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
      heartRate,
    });
  });
  const parse = BaseGpx.safeParse({ name, points });
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
  const greatCircleDistance =
    2 * Math.atan2(Math.sqrt(tmp), Math.sqrt(1 - tmp));
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

export function gpxToElevationNivoData(gpx: Gpx): Highcharts.Options {
  return {
    title: {
      text: "Elevation",
      align: "left",
    },
    chart: {
      height: "300px",
      zooming: {
        type: "x",
      },
    },
    xAxis: {
      type: "linear",
      title: {
        text: "Distance (m)",
      },
    },
    yAxis: {
      type: "linear",
      title: {
        text: "Elevation (m)",
      },
    },
    series: [
      {
        name: "Elevation",
        type: "line",
        point: {
          events: {
            mouseOver: (e) => {
              console.log(e);
            },
            mouseOut: (e) => {
              console.log("mouse out");
            },
          },
        },
        data: gpx.points.map((p, i) => [
          p.accumulatedDistanceMeters,
          p.elevation,
          i,
        ]),
      },
    ],
  };
}
