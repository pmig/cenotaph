import Link from "next/link";

export function Hero() {
  return (
    <section className="mx-auto max-w-4xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-brand-primary/30 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-primary shadow-subtle">
        Github-powered estimations
      </span>
      <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        Estimate engineering effort for live Sentry issues
      </h1>
      <p className="mt-4 text-lg text-slate-600">
        Browse real issues from the Sentry repository. Pick a ticket to dive into the context and prepare the perfect
        brief for the estimation agent loop.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="#issues"
          className="rounded-md bg-brand-card px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02]"
        >
          View open tickets
        </Link>
        <Link
          href="https://github.com/getsentry/sentry"
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
        >
          Explore the repo
        </Link>
      </div>
    </section>
  );
}
