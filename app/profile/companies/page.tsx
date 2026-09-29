import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { listCompaniesForUser } from "../../../lib/companies-repository";
import CompaniesManager from "./CompaniesManager";

export default async function CompaniesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const companies = await listCompaniesForUser(session.user.id);
  return (
    <CompaniesManager
      initialCompanies={companies.map((company) => ({
        ...company,
        created_at: company.created_at.toISOString(),
        updated_at: company.updated_at.toISOString(),
      }))}
    />
  );
}