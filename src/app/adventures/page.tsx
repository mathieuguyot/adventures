import dbConnect from "../../mongoose/dbConnect";
import { mdbAdventureModel } from "../../mongoose/adventure";
import CreateForm from "./createForm";
import Link from "next/link";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

async function getAdventures(): Promise<{ id: string; name: string }[]> {
    await dbConnect();
    const result = await mdbAdventureModel.find({}, { parts: 0 });
    return result.map((r) => ({
        id: r._id.toString(),
        name: r.name
    }));
}

export default async function AdventureEditorPage() {
    const session = await getServerSession(authOptions);

    const adventures = await getAdventures();

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="table table-zebra table-compact w-full">
                    <thead>
                        <tr>
                            <th>Name ({adventures.length} Activities in list)</th>
                            <th>View</th>
                            {session && <th>Edit</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {adventures.map((adventure) => (
                            <tr key={adventure.id}>
                                <td>{adventure.name}</td>
                                <td>
                                    <Link
                                        className="btn btn-xs"
                                        href={`adventures/viewer/${adventure.id}`}
                                    >
                                        view
                                    </Link>
                                </td>
                                {session && (
                                    <td>
                                        <Link
                                            className="btn btn-xs"
                                            href={`adventures/editor/${adventure.id}`}
                                        >
                                            edit
                                        </Link>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <br />
            {session && <CreateForm />}
        </div>
    );
}
