"use client";

import Editor from "@monaco-editor/react";
import { produce } from "immer";
import { useCallback, useState } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Adventure } from "../../../../model/adventure";

import dynamic from "next/dynamic";
import { Gpx } from "../../../../model/gpx";
const AdventureMap = dynamic(() => import("./adventureMap"), { ssr: false });

export function AdventureEditor({ adventure }: { adventure: Adventure }) {
    const [editedAdventure, setEditedAdventure] = useState<Adventure>(adventure);
    const [activities, setActivities] = useState<Gpx[]>([]);
    const [editedField, setEditedField] = useState<string>("header");
    const [activityId, setActivityId] = useState<string>("");

    const addActivityId = useCallback(async () => {
        const response = await fetch(`/api/gpx/${activityId}`, {
            method: "GET"
        });
        const respData = await response.text();
        if (respData != "null") {
            // TODO check value with zod schema
            const gpx: Gpx = JSON.parse(respData);
            setEditedAdventure(
                produce(editedAdventure, (draft) => {
                    draft.parts.push({
                        activityId: activityId,
                        mdDescription: gpx.description,
                        name: gpx.name
                    });
                })
            );
            setActivities([...activities, gpx]);
        }
    }, [activityId, activities]);

    const value = editedField === "header" ? editedAdventure.mdHeader : editedAdventure.mdFooter;
    const setCurrentlyEditedValue = useCallback(
        (newValue: string | undefined) => {
            setEditedAdventure(
                produce(editedAdventure, (draft) => {
                    if (editedField === "header") {
                        draft.mdHeader = newValue ? newValue : "";
                    } else if (editedField === "footer") {
                        draft.mdFooter = newValue ? newValue : "";
                    }
                })
            );
        },
        [editedAdventure, editedField]
    );

    return (
        <div className="grid grid-cols-2" style={{ gridAutoRows: "calc(50vh - 16px)" }}>
            <div>
                <AdventureMap gpxs={activities} />
            </div>
            <div>
                <Editor
                    defaultLanguage="markdown"
                    value={value}
                    onChange={(newValue, ev) => {
                        if (!(ev.changes[0] as any).forceMoveMarkers) {
                            setCurrentlyEditedValue(newValue);
                        }
                    }}
                />
            </div>
            <div style={{ overflow: "scroll" }}>
                <div className="bg-base-300 flex justify-between" style={{ alignItems: "center" }}>
                    <input
                        className="input input-bordered input-xs flex-1 max-w-xs"
                        style={{ outline: 0 }}
                        value={editedAdventure.name}
                        onChange={(e) => {
                            setEditedAdventure(
                                produce(editedAdventure, (draft) => {
                                    draft.name = e.target.value;
                                })
                            );
                        }}
                    />
                    <div>
                        <button
                            className="btn btn-xs btn-ghost"
                            onClick={() => setEditedField("header")}
                        >
                            Header
                        </button>
                        <button
                            className="btn btn-xs btn-ghost"
                            onClick={() => setEditedField("footer")}
                        >
                            Footer
                        </button>
                        <button className="btn btn-xs btn-ghost">Save</button>
                    </div>
                </div>
                <div className="flex-grow">
                    <table className="table table-zebra table-compact w-full border-0">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Date</th>
                                <th>Edit Markdown</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {editedAdventure.parts.map((part) => (
                                <tr>
                                    <td>{part.name}</td>
                                    <td>
                                        {
                                            activities.filter(
                                                (a) => a.activityId === part.activityId
                                            )[0].time
                                        }
                                    </td>
                                    <td>edit</td>
                                    <td>delete</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-base-300 flex justify-between">
                    <input
                        className="input input-bordered input-xs w-full max-w-xs"
                        style={{ outline: 0 }}
                        placeholder="Activity ID"
                        value={activityId}
                        onChange={(e) => setActivityId(e.target.value)}
                    />
                    <button
                        className="btn btn-xs btn-ghost"
                        disabled={activityId.length === 0}
                        onClick={addActivityId}
                    >
                        Add
                    </button>
                </div>
            </div>
            <div style={{ overflow: "scroll" }}>
                <ReactMarkdown className="markdown">{value}</ReactMarkdown>
            </div>
        </div>
    );
}
