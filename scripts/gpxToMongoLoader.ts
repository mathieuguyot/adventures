import { readFile } from "fs/promises";
import mongoose from "mongoose";
import { readdir } from "fs";
import { parseGpx } from "../src/model/gpx";
import { mdbGpxModel } from "../src/mongoose/gpx";

export async function main() {
    const gpxActivitiesDir = "/Users/mathieuguyot/Downloads/export-strava/activities_gpx/";

    await mongoose.connect("mongodb://127.0.0.1:27017/test");
    console.log("Connected to mongodb");

    await readdir(gpxActivitiesDir, async function (err, files) {
        console.log("files count in the directory: " + files.length);
        //handling error
        if (err) {
            return console.log("Unable to scan directory: " + err);
        }

        // processing each file
        for (const file of files) {
            //console.log(`PROCESSING ${file}...`);
            const text = await readFile(gpxActivitiesDir + file, "utf8");
            try {
                const gpx = parseGpx(text);
                if (!gpx) {
                    console.log(`Error while parsing gpx file: ${gpxActivitiesDir + file}`);
                    continue;
                }
                await mdbGpxModel.insertMany([gpx]);
                console.log(`Imported gpx: ${gpx.name}`);
            } catch (err) {
                console.log(`Error while importing gpx: ${err}`);
            }
        }

        await mongoose.connection.close();
        console.log("Connection to mongodb closed");
    });
}

main();
