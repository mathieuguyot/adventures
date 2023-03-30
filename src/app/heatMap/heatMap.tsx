"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import { gpxToLeafletPolyline } from "../../model/gpx";

export default function HeatMap({ gpxs }: any) {
    return (
        <div>
            <MapContainer
                style={{ minHeight: "100vh", width: "100%" }}
                zoom={6}
                center={[46.2276, 2.2137]}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {gpxs.map((gpx) => (
                    <Polyline key={gpx.activityId} positions={gpxToLeafletPolyline(gpx)} />
                ))}
            </MapContainer>
        </div>
    );
}
