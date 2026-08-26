import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
export const { handlers, auth, signIn, signOut } = NextAuth({ providers: [GitHub({ authorization: { params: { scope: "read:user user:email repo" } } })], trustHost: true, session: { strategy: "jwt" }, callbacks: { async jwt({ token, account }) { if (account?.access_token) token.githubAccessToken = account.access_token; return token; } } });
