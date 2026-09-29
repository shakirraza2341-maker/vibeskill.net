import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { listCompaniesForUser } from "../../../lib/companies-repository";
import { listJobsForCompanies } from "../../../lib/jobs-repository";
import ProfileJobsManager from "./ProfileJobsManager";

export default async function ProfileJobsPage() {
	const session = await auth();
	if (!session?.user?.id) redirect("/login");

	if (session.user.role !== "employer") {
		const pending = session.user.employerStatus === "pending";
		return (
			<main className="mx-auto max-w-7xl px-4 py-8 sm:px-7 sm:py-11">
				<div className="mb-7 border-b border-ink/10 pb-6">
					<p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-coral">
						Profile workspace
					</p>
					<h1 className="font-display text-3xl text-ink sm:text-4xl">Your jobs</h1>
				</div>
				<section className="border border-ink/10 bg-cream px-6 py-12 text-center">
					<h2 className="font-display text-xl text-ink">
						{pending ? "Employer application pending" : "No employer jobs"}
					</h2>
					<p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted">
						{pending
							? "Your employer role submission is awaiting review. Job management will be available after approval."
							: "Job management is available to approved employer accounts."}
					</p>
				</section>
			</main>
		);
	}

	const companies = await listCompaniesForUser(session.user.id);
	const jobs = await listJobsForCompanies(companies.map((company) => company.id));

	return (
		<ProfileJobsManager
			userId={session.user.id}
			initialCompanies={companies.map(({ id, company_name }) => ({ id, company_name }))}
			initialJobs={jobs.map((job) => ({ ...job, apply_url: job.apply_url ?? "" }))}
		/>
	);
}
