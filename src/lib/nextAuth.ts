import { prismaClient } from "@/lib/db";
import GitHubProvider from "next-auth/providers/github";

const NEXT_AUTH = {
    providers: [
      GitHubProvider({
        clientId: process.env.GITHUB_ID || "",
        clientSecret: process.env.GITHUB_SECRET || ""
      })
    ],
    secret: process.env.NEXTAUTH_SECRET ?? "secret",
    callbacks: {
      async signIn(params) {
        const githubProfile = params.profile as { login: string };
        try {
          await prismaClient.user.create({
            data: {
              userId: githubProfile.login || "",
              provider: "Github"
            }
          })
        } catch (error) {
          
        }
        params.user.userId = githubProfile.login;
        return true;
      },
      async session({ session, token }) {
        session.user.userId = token.userId;
        return session;
      },
      async jwt({ token, user }) {
        if(user) {
          token.userId = user.userId;
        }
        return token;
      },
    }
}

export default NEXT_AUTH;