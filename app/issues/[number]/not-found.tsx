import Link from "next/link";

import { Header } from "@/components/header";

export default function IssueNotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-6 px-6 py-12 text-center">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-primary">Ticket missing</p>
          <h1 className="text-3xl font-bold text-slate-900">We couldn&apos;t find that Sentry issue</h1>
          <p className="text-sm text-slate-600">
            The ticket may have been closed, moved, or you might have followed an outdated link.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md bg-brand-card px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02]"
        >
          Back to open tickets
        </Link>
      </main>
    </div>
  );
}
