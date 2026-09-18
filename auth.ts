import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { findUserByEmail, markUserLoggedIn } from "./lib/users-repository";
import authConfig from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        const user = await findUserByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password_hash))) return null;
        try {
          await markUserLoggedIn(user._id.toHexString());
        } catch (error) {
          console.error("Error updating user login timestamp:", error);
        }
        return {
          id: user._id.toHexString(),
          name: user.name,
          email: user.email,
          role: user.role,
          employerStatus: user.employer_status ?? "none",
        };
      },
    }),
  ],
});
