export default async function IndexPage() {
    return (
        <div className="prose">
            <h2 style={{ marginTop: 30 }}>Bienvenu sur Aventures,</h2>
            <p>
                Ici, je partage avec vous certains voyages que j&apos;ai eu la change de vivres !
                <br />
                À vélo, à pieds ou en van avec des amis, dans les Pyrénées comme sous la mer
                méditerranéenne, j&apos;aime explorer et découvrir de nouveaux espaces.
                <br />
                J&apos;espère que vous prendrez autant de plaisir à lire et découvrir mes aventures
                que j&apos;ai eu à les vivre et à les raconter.
            </p>
            <p>
                Ce site est encore en développement:{" "}
                <a href="https://github.com/mathieuguyot/adventures">lien vers mon projet github</a>
            </p>
        </div>
    );
}
