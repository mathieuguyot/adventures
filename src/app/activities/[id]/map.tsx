"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import Editor from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { gpxToLeafletPolyline } from "../../../model/gpx";

export default function LeafletMap({ gpx, chartData }: any) {
    const [value, setValue] = useState("# test");
    return (
        <div>
            {/* <div style={{ display: "flex" }}>
                <Editor
                    height="90vh"
                    width="50%"
                    defaultLanguage="markdown"
                    defaultValue=""
                    value={value}
                    onChange={(newValue) => {
                        setValue(newValue ? newValue : "");
                    }}
                />
                <ReactMarkdown className="markdown">{value}</ReactMarkdown>
            </div>
            <div style={{ height: 600 }}>
                <HighchartsReact highcharts={Highcharts} options={chartData} />
            </div> */}
            <MapContainer
                style={{ minHeight: "90vh", width: "90%" }}
                zoom={12}
                center={gpx.centroid}
            >
                <TileLayer
                    //className="map-tiles"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    //url="http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png"
                />
                <Polyline positions={gpxToLeafletPolyline(gpx)} />
            </MapContainer>
        </div>
    );
}
