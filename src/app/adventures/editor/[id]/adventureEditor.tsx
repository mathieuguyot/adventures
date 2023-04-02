"use client";

import Editor from "@monaco-editor/react";
import { produce } from "immer";
import { useCallback, useState } from "react";
import {
    Adventure,
    extractLatLongImagesFromText,
    updateAdventure
} from "../../../../model/adventure";
import { ArrowDown, ArrowUp, Edit, TrashCan } from "@ricons/carbon";

import dynamic from "next/dynamic";
import { getActivity, Gpx } from "../../../../model/gpx";
import MarkdownEditor from "../../../common/markdownEditor";
const AdventureMap = dynamic(() => import("./adventureMap"), { ssr: false });

type AdventureEditorProps = {
    adventure: Adventure;
    activities: Gpx[];
    adventureId: string;
};

// TODO Decouple this huge component and test it !
// TODO Load spinner for save and and add activity + errors messages
// TODO modal for delete button
export function AdventureEditor({ adventure, adventureId, activities }: AdventureEditorProps) {
    const [editedAdventure, setEditedAdventure] = useState<Adventure>(adventure);
    const [editedActivities, setEditedActivities] = useState<Gpx[]>(activities);
    const [editedField, setEditedField] = useState<string>("header");
    const [activityId, setActivityId] = useState<string>("");

    const addActivityId = useCallback(async () => {
        if (editedActivities.map((e) => e.activityId).includes(activityId)) {
            setActivityId("");
            return;
        }
        const gpx = await getActivity(activityId);
        if (gpx) {
            setEditedAdventure(
                produce(editedAdventure, (draft) => {
                    draft.parts.push({
                        activityId: activityId,
                        mdDescription: gpx.description,
                        name: gpx.name
                    });
                })
            );
            setEditedActivities((activities) => [...activities, gpx]);
            setActivityId("");
        }
    }, [activityId]);

    const removeActivity = useCallback((activityId: string) => {
        setEditedField("header");
        setEditedActivities((act) => act.filter((a) => a.activityId !== activityId));
        setEditedAdventure((adv) =>
            produce(adv, (draft) => {
                draft.parts = draft.parts.filter((p) => p.activityId !== activityId);
            })
        );
    }, []);

    const moveActivity = useCallback((fromIndex: number, toIndex: number) => {
        setEditedAdventure((adv) =>
            produce(adv, (draft) => {
                const part = draft.parts[fromIndex];
                draft.parts.splice(fromIndex, 1);
                draft.parts.splice(toIndex, 0, part);
            })
        );
    }, []);

    const saveActivity = useCallback(async () => {
        // TODO check for failurek, do loading
        const newEditedAdventure = produce(editedAdventure, (draft) => {
            draft.parts.forEach((part) => {
                part.images = extractLatLongImagesFromText(part.mdDescription);
            });
        });
        setEditedAdventure(newEditedAdventure);
        updateAdventure(adventureId, newEditedAdventure);
    }, [editedAdventure, adventureId]);

    const value =
        editedField === "header"
            ? editedAdventure.mdHeader
            : editedField === "footer"
            ? editedAdventure.mdFooter
            : editedAdventure.parts[Number(editedField)].mdDescription;
    const setCurrentlyEditedValue = useCallback(
        (newValue: string | undefined) => {
            setEditedAdventure(
                produce(editedAdventure, (draft) => {
                    if (editedField === "header") {
                        draft.mdHeader = newValue ? newValue : "";
                    } else if (editedField === "footer") {
                        draft.mdFooter = newValue ? newValue : "";
                    } else {
                        draft.parts[Number(editedField)].mdDescription = newValue ? newValue : "";
                    }
                })
            );
        },
        [editedAdventure, editedField]
    );

    return (
        <div className="grid grid-cols-2" style={{ gridAutoRows: "calc(50vh - 16px)" }}>
            <div>
                <AdventureMap gpxs={editedActivities} />
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
                        <button className="btn btn-xs btn-ghost" onClick={saveActivity}>
                            Save
                        </button>
                    </div>
                </div>
                <div className="flex-grow">
                    <table className="table table-zebra table-compact w-full border-0">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {editedAdventure.parts.map((part, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{part.name}</td>
                                        <td>
                                            <button
                                                className="btn btn-xs btn-ghost"
                                                onClick={() => setEditedField(i.toString())}
                                            >
                                                <svg width={20} height={20}>
                                                    <Edit />
                                                </svg>
                                            </button>
                                            <button
                                                className="btn btn-xs btn-ghost"
                                                onClick={() => removeActivity(part.activityId)}
                                            >
                                                <svg width={20} height={20}>
                                                    <TrashCan />
                                                </svg>
                                            </button>
                                            <button
                                                className="btn btn-xs btn-ghost"
                                                disabled={i === 0}
                                                onClick={() => moveActivity(i, i - 1)}
                                            >
                                                <svg width={20} height={20}>
                                                    <ArrowUp />
                                                </svg>
                                            </button>
                                            <button
                                                className="btn btn-xs btn-ghost"
                                                disabled={i + 1 === editedAdventure.parts.length}
                                                onClick={() => moveActivity(i, i + 1)}
                                            >
                                                <svg width={20} height={20}>
                                                    <ArrowDown />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
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
            <div style={{ overflowY: "scroll" }}>
                <MarkdownEditor markdown={value} />
            </div>
        </div>
    );
}
