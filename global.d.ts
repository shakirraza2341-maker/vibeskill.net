import type { DefaultSession } from "next-auth";

declare module '*.css' {
	const styles: Record<string, string>
	export default styles
}

declare module "next-auth" {
	interface User {
		role: "admin" | "user" | "employer";
		employerStatus: "none" | "pending" | "approved" | "rejected";
	}

	interface Session {
		user: {
			id: string;
			role: "admin" | "user" | "employer";
			employerStatus: "none" | "pending" | "approved" | "rejected";
		} & DefaultSession["user"];
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		role?: "admin" | "user" | "employer";
		employerStatus?: "none" | "pending" | "approved" | "rejected";
	}
}
