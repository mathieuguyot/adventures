"use client";

import { signOut } from "next-auth/react";

export default function Logout() {
    signOut({ callbackUrl: "/" });
    return <></>;
}
