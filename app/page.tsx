import { Hero } from "@/components/hero";
import { Header } from "@/components/header";
import { IssueCard } from "@/components/issue-card";
import { fetchIssues } from "@/lib/github";

export default async function HomePage() {
  const issues = await fetchIssues().catch((error) => {
    console.error(error);
    return null;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 px-6 py-16">
        <Hero />

        <section id="issues" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Live tickets from getsentry/sentry</h2>
              <p className="text-sm text-slate-500">
                Select a ticket to inspect the context, review discussions, and get prepared for estimation.
              </p>
            </div>
            <span className="hidden rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 sm:inline-flex">
              Auto-refreshed every 5 minutes
            </span>
          </div>

          {!issues && (
            <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
              We could not load issues from GitHub right now. Please refresh the page or try again later.
            </div>
          )}

          {issues && issues.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
              No open issues were found. Check back soon!
            </div>
          )}

          {issues && issues.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {issues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
