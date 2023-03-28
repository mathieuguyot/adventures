"use client";

import { useCallback, useState } from "react";
import { createAdventure } from "../../model/adventure";

function ErrorChip({ text }: { text: string }) {
    return (
        <div className="badge badge-error gap-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-4 h-4 stroke-current"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                ></path>
            </svg>
            {text}
        </div>
    );
}

export default function CreateForm() {
    const [adventureName, setAdventureName] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const onCreate = useCallback(async () => {
        setLoading(true);
        const success = await createAdventure(adventureName);
        setError(!success);
        if (success) {
            setAdventureName("");
        }
        setLoading(false);
    }, [adventureName]);

    return (
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
                type="text"
                placeholder="Adventure name"
                style={{ outline: 0 }}
                className="input input-bordered input-sm w-full max-w-xs"
                value={adventureName}
                onChange={(e) => setAdventureName(e.target.value)}
            />
            <button
                className={`btn btn-sm ${loading ? "loading" : ""}`}
                onClick={onCreate}
                disabled={loading || adventureName.length === 0}
            >
                Create Adventure
            </button>
            {error && <ErrorChip text="failed to create new adventure" />}
        </div>
    );
}
