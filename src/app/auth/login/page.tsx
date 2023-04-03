"use client";

import { signIn } from "next-auth/react";

export default function Login() {
    signIn(undefined, { callbackUrl: "/" });
    return <></>;
}
