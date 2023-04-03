"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Polyline, Marker, useMapEvents } from "react-leaflet";
import { gpxToLeafletPolyline } from "../../../../model/gpx";
import { icon } from "leaflet";
import { useState } from "react";

function ZoomLevel({ setZoomLevel }: any) {
    const mapEvents = useMapEvents({
        zoomend: () => {
            setZoomLevel(mapEvents.getZoom());
        }
    });

    return null;
}

function imageDimensionBasedOnZoom(zoom: number) {
    if (zoom === 10) return 5;
    if (zoom === 11) return 10;
    if (zoom === 12) return 15;
    if (zoom === 13) return 30;
    if (zoom === 14) return 50;
    if (zoom === 15) return 100;
    if (zoom === 16) return 200;
    if (zoom === 17) return 300;
    if (zoom === 18) return 500;
    return 0;
}

export default function AdventureMap({ gpxs, images }: any) {
    const [zoom, setZoom] = useState(6);

    return (
        <div>
            <MapContainer
                style={{ minHeight: "calc(50vh - 16px)", width: "100%" }}
                zoom={zoom}
                center={[46.2276, 2.2137]}
            >
                <ZoomLevel setZoomLevel={setZoom} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {images.map((image, i) => (
                    <Marker
                        key={i}
                        position={[image.latitude, image.longitude]}
                        icon={icon({
                            iconSize: [
                                imageDimensionBasedOnZoom(zoom),
                                imageDimensionBasedOnZoom(zoom)
                            ],
                            iconUrl: image.src
                        })}
                    />
                ))}
                {gpxs.map((gpx) => (
                    <Polyline key={gpx.activityId} positions={gpxToLeafletPolyline(gpx)} />
                ))}
            </MapContainer>
        </div>
    );
}
