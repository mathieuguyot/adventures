import { useMemo } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import gpx from "./assets/ventoux.gpx?raw";
import { computeDistance, Gpx, gpxToLeafletPolyline, parseGpx } from "./gpx";

function App() {
    const gpxTrack: Gpx | null = useMemo(() => {
        return parseGpx(gpx);
    }, []);

    const positions = useMemo(() => {
        return gpxTrack ? gpxToLeafletPolyline(gpxTrack) : [];
    }, [gpxTrack]);

    const totalDist = useMemo(() => {
        return gpxTrack ? computeDistance(gpxTrack) : 0;
    }, [gpxTrack]);
    console.log(totalDist);
    return (
        <MapContainer
            style={{ minHeight: "100vh", minWidth: "100vw" }}
            center={positions.length > 0 ? positions[0] : [0, 0]}
            zoom={13}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Polyline positions={positions} />
        </MapContainer>
    );
}

export default App;
