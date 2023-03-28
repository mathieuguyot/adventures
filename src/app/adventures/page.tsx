import dbConnect from "../../mongoose/dbConnect";
import { mdbAdventureModel } from "../../mongoose/adventure";
import CreateForm from "./createForm";
import Link from "next/link";

async function getAdventures(): Promise<{ id: string; name: string }[]> {
    await dbConnect();
    const result = await mdbAdventureModel.find({}, { parts: 0 });
    return result.map((r) => ({
        id: r._id.toString(),
        name: r.name
    }));
}

export default async function AdventureEditorPage() {
    const adventures = await getAdventures();

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="table table-zebra table-compact w-full">
                    <thead>
                        <tr>
                            <th>Name ({adventures.length} Activities in list)</th>
                            <th>View</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {adventures.map((adventure) => (
                            <tr key={adventure.id}>
                                <td>
                                    <Link href={`adventures/editor/${adventure.id}`}>
                                        {adventure.name}
                                    </Link>
                                </td>
                                <td>
                                    <Link
                                        className="btn btn-xs"
                                        href={`adventures/viewer/${adventure.id}`}
                                    >
                                        view
                                    </Link>
                                </td>
                                <td>
                                    <Link
                                        className="btn btn-xs"
                                        href={`adventures/editor/${adventure.id}`}
                                    >
                                        edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <br />
            <CreateForm />
        </div>
    );
}
