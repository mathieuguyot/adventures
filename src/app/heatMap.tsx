"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import { gpxToLeafletPolyline } from "../model/gpx";

export default function HeatMap({ gpxs }: any) {
    console.log(gpxs);
    return (
        <div>
            <MapContainer style={{ minHeight: "90vh", width: "90%" }} zoom={12} center={[0, 0]}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {gpxs.map((gpx) => (
                    <Polyline positions={gpxToLeafletPolyline(gpx)} />
                ))}
            </MapContainer>
        </div>
    );
}
