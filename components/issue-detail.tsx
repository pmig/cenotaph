import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { GitHubIssue } from "@/lib/github";
import { formatRelativeTime } from "@/lib/github";
import { AgentAnalysis } from "./agent-analysis";

export function IssueDetail({ issue }: { issue: GitHubIssue }) {
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
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Issue context</h2>
            <div className="prose prose-slate max-w-none text-sm leading-relaxed">
              {issue.body ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{issue.body}</ReactMarkdown>
              ) : (
                <p className="text-slate-500">No description was provided for this issue.</p>
              )}
            </div>
          </div>

          <AgentAnalysis issue={issue} />
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">Estimation progress</h3>
            <p className="mt-2 text-sm text-slate-600">
              The agent loop will dive into this ticket, traverse the codebase, and generate an engineering effort
              estimate. Stay tuned!
            </p>
            <div className="mt-4 rounded-lg bg-brand-card p-4 text-white shadow-lg">
              <p className="text-xs uppercase tracking-wide text-white/80">Status</p>
              <p className="text-lg font-semibold">Awaiting agent analysis</p>
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
