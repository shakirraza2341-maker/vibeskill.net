import { auth } from "../../auth";
import ProfileShell from "../../components/profile/ProfileShell";
import { redirect } from "next/navigation";

export default async function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <ProfileShell
      name={session.user.name?.trim() || session.user.email || "My account"}
      email={session.user.email ?? ""}
      dateLabel={new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      }).format(new Date())}
    >
      {children}
    </ProfileShell>
  );
}
