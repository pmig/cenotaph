import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { IssueChat } from "@/components/issue-chat";
import type { GitHubIssue } from "@/lib/github";
import { formatRelativeTime } from "@/lib/github";
import { estimateIssueEffort } from "@/lib/effort";

export function IssueDetail({ issue }: { issue: GitHubIssue }) {
  const estimate = estimateIssueEffort(issue);

  return (
    <article className="space-y-8">
      <header className="space-y-4 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-primary">Sentry issue</span>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">{issue.title}</h1>
          </div>
          <Link
            href={issue.html_url}
            target="_blank"
            rel="noreferrer"
            className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            View on GitHub
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
            Ticket #{issue.number}
          </span>
          <span>Opened by {issue.user.login}</span>
          <span>Created {formatRelativeTime(issue.created_at)}</span>
          <span>Updated {formatRelativeTime(issue.updated_at)}</span>
          <span>{issue.comments} comments</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {issue.labels.map((label) => (
            <span
              key={label.id}
              className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium"
              style={{ backgroundColor: `#${label.color}15`, color: `#${label.color}` }}
            >
              {label.name}
            </span>
          ))}
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Issue context</h2>
          <div className="prose prose-slate max-w-none text-sm leading-relaxed">
            {issue.body ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{issue.body}</ReactMarkdown>
            ) : (
              <p className="text-slate-500">No description was provided for this issue.</p>
            )}
          </div>
        </div>

        <aside className="flex flex-col gap-6">
          <IssueChat
            issueNumber={issue.number}
            issueTitle={issue.title}
            initialEstimateHours={estimate.hours}
          />

          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Estimated effort</h3>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                  estimate.complexity === "high"
                    ? "bg-red-100 text-red-700"
                    : estimate.complexity === "medium"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {estimate.complexity} complexity
              </span>
            </div>

            <div className="rounded-lg bg-brand-card p-5 text-white shadow-lg">
              <p className="text-xs uppercase tracking-widest text-white/80">Estimated hours</p>
              <p className="mt-2 text-3xl font-bold">{estimate.hours.toFixed(1)}h</p>
              <p className="text-xs text-white/75">Confidence: {estimate.confidence}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500">Breakdown</h4>
              <ul className="space-y-1 text-sm text-slate-600">
                {estimate.breakdown.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-primary" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Quick links</h3>
            <ul className="mt-3 space-y-2 text-sm text-brand-primary">
              <li>
                <Link href={`https://github.com/${issue.user.login}`} target="_blank" rel="noreferrer">
                  @{issue.user.login} on GitHub
                </Link>
              </li>
              <li>
                <Link href={`${issue.html_url}#issuecomment-new`} target="_blank" rel="noreferrer">
                  Discuss this ticket
                </Link>
              </li>
              <li>
                <Link href="https://github.com/getsentry/sentry/pulls" target="_blank" rel="noreferrer">
                  Related pull requests
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </article>
  );
}
