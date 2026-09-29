import { auth } from "../../auth";
import { findCompanyByUserId } from "../../lib/companies-repository";
import { findUserById } from "../../lib/users-repository";
import { redirect } from "next/navigation";
import ProfileDashboard from "./ProfileDashboard";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await findUserById(session.user.id);
  if (!user) redirect("/login");
  const company = await findCompanyByUserId(session.user.id);

  return (
    <ProfileDashboard
      profile={{
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at.toISOString(),
        company_name: company?.company_name ?? user.company_name ?? "",
        company_website: company?.company_website ?? user.company_website ?? "",
        company_telephone:
          company?.company_telephone ?? user.company_telephone ?? "",
        company_address: company?.company_address ?? user.company_address ?? "",
        company_ntn: company?.company_ntn ?? user.company_ntn ?? "",
      }}
    />
  );
}
