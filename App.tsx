import Editor from "@monaco-editor/react";
import HighchartsReact from "highcharts-react-official";
import { useMemo, useState } from "react";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";
import ReactMarkdown from "react-markdown";
import Highcharts from "highcharts";
import gpxStr from "./assets/ventoux.gpx?raw";
import {
  Gpx,
  gpxToElevationNivoData,
  gpxToLeafletPolyline,
  parseGpx,
} from "./gpx";

function App() {
  const gpx: Gpx | null = useMemo(() => {
    return parseGpx(gpxStr);
  }, []);

  const positions = useMemo(() => {
    return gpx ? gpxToLeafletPolyline(gpx) : [];
  }, [gpx]);
  console.log(gpx ? gpxToElevationNivoData(gpx) : 0);
  const [value, setValue] = useState("# test");
  return (
    <div>
      <div style={{ display: "flex" }}>
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
        <ReactMarkdown className="markdown-body" children={value} />
      </div>
      {gpx ? (
        <div style={{ height: 450 }}>
          <HighchartsReact
            highcharts={Highcharts}
            options={gpxToElevationNivoData(gpx)}
          />
        </div>
      ) : (
        <></>
      )}
      <MapContainer
        style={{ minHeight: "100vh", minWidth: "90vw" }}
        center={gpx ? gpx.centroid : [0, 0]}
        boundsOptions={{}}
        zoom={12}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={positions} />
      </MapContainer>
    </div>
  );
}

export default App;
