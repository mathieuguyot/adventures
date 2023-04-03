import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
    // Configure one or more authentication providers
    secret: process.env.JWT_SECRET,
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID ? process.env.GITHUB_ID : "",
            clientSecret: process.env.GITHUB_SECRET ? process.env.GITHUB_SECRET : ""
        })
    ],
    callbacks: {
        async signIn({ user }) {
            return user && user.email === "mathieuguyot40@gmail.com";
        }
    }
};

export default NextAuth(authOptions);
