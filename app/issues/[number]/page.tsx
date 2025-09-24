import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Header } from "@/components/header";
import { IssueDetail } from "@/components/issue-detail";
import { fetchIssue } from "@/lib/github";

interface IssuePageProps {
  params: Promise<{ number: string }>;
}

export async function generateMetadata({ params }: IssuePageProps): Promise<Metadata> {
  const { number } = await params;
  const issueNumber = Number(number);

  if (Number.isNaN(issueNumber)) {
    return {
      title: "Issue not found | WhosNext",
    };
  }

  const issue = await fetchIssue(issueNumber).catch(() => null);

  if (!issue) {
    return {
      title: `Issue #${issueNumber} | WhosNext`,
      description: "Issue not found",
    };
  }

  return {
    title: `${issue.title} · #${issue.number} | WhosNext`,
    description: issue.body ? issue.body.slice(0, 140) : "Issue details",
  };
}

export default async function IssuePage({ params }: IssuePageProps) {
  const { number } = await params;
  const issueNumber = Number(number);

  if (Number.isNaN(issueNumber)) {
    notFound();
  }

  const issue = await fetchIssue(issueNumber).catch(() => null);

  if (!issue) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-12">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        >
          <span aria-hidden>←</span>
          Back to all tickets
        </Link>
        <IssueDetail issue={issue} />
      </main>
    </div>
  );
}
