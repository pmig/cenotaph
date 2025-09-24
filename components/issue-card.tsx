import Link from "next/link";
import type { GitHubIssue } from "@/lib/github";
import { formatRelativeTime } from "@/lib/github";

function getExcerpt(body?: string | null, limit = 160) {
  if (!body) return "No description provided.";
  const clean = body.replace(/\r?\n/g, " ").replace(/\s+/g, " ").trim();
  if (clean.length <= limit) return clean;
  return `${clean.slice(0, limit)}…`;
}

export function IssueCard({ issue }: { issue: GitHubIssue }) {
  const primaryLabel = issue.labels.find((label) => label.name);

  return (
    <Link
      href={`/issues/${issue.number}`}
      className="group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-500">
          #{issue.number}
        </span>
        {primaryLabel ? (
          <span
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
            style={{ backgroundColor: `#${primaryLabel.color}20`, color: `#${primaryLabel.color}` }}
          >
            {primaryLabel.name}
          </span>
        ) : null}
      </div>

      <h3 className="mt-4 text-lg font-semibold text-slate-900 group-hover:text-brand-secondary">
        {issue.title}
      </h3>

      <p className="mt-2 flex-1 text-sm text-slate-600">{getExcerpt(issue.body)}</p>

      <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
            {issue.user.login.slice(0, 2).toUpperCase()}
          </span>
          <div className="leading-tight">
            <p className="font-medium text-slate-700">{issue.user.login}</p>
            <p>Updated {formatRelativeTime(issue.updated_at)}</p>
          </div>
        </div>
        <div className="text-right">
          <p>{issue.comments} comments</p>
          <p>Created {formatRelativeTime(issue.created_at)}</p>
        </div>
      </div>
    </Link>
  );
}
