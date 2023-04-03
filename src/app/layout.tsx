"use client";

import "./global.css";
import { Header } from "./header";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="fr" data-theme="light">
            <body>
                <SessionProvider>
                    <Header />
                    <div style={{ height: "calc(100vh - 32px)" }}>{children}</div>
                </SessionProvider>
            </body>
        </html>
    );
}
