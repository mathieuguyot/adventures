export function Header() {
    return (
        <div className="navbar bg-base-300">
            <div className="flex-1">
                <a href="/" className="btn btn-ghost normal-case text-xl">
                    oura sports
                </a>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    <li>
                        <a href="/adventures">Adventures</a>
                    </li>
                    <li>
                        <a href="/activities">Activities</a>
                    </li>
                    <li>
                        <a href="/heatMap">Heat map</a>
                    </li>
                </ul>
            </div>
        </div>
    );
}
