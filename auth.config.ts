import type { NextAuthConfig } from "next-auth";

const authConfig = {
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? process.env.CRON_SECRET,
  pages: { signIn: "/login" },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      if (user) token.employerStatus = user.employerStatus;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as "admin" | "user" | "employer" | undefined) ?? "user";
        session.user.employerStatus = (token.employerStatus as "none" | "pending" | "approved" | "rejected" | undefined) ?? "none";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export default authConfig;
