export function Header() {
    return (
        <div className="bg-base-300 flex justify-between">
            <a href="/" className="btn btn-sm btn-ghost normal-case text-xl">
                oura sports
            </a>
            <div className="flex gap-2">
                <a href="/adventures" className="btn btn-sm btn-ghost">
                    Adventures
                </a>
                <a href="/activities" className="btn btn-sm btn-ghost">
                    Activities
                </a>
                <a href="/heatMap" className="btn btn-sm btn-ghost">
                    Heat map
                </a>
            </div>
        </div>
    );
}
