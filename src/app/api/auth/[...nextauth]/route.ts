import { prismaClient } from "@/lib/db";
import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github";

const handler = NextAuth({
    providers: [
      GitHubProvider({
        clientId: process.env.GITHUB_ID || "",
        clientSecret: process.env.GITHUB_SECRET || ""
      })
    ],
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
})

export { handler as GET, handler as POST }