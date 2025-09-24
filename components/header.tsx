import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white shadow-subtle backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-card text-lg font-semibold text-white shadow-lg">
            HN
          </div>
          <div>
            <p className="text-xl font-semibold text-slate-900">WhosNext</p>
            <p className="text-xs text-slate-500">Sentry issue effort estimator</p>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-500 md:flex">
          <Link className="transition-colors hover:text-slate-900" href="#issues">
            Issues
          </Link>
          <Link className="transition-colors hover:text-slate-900" href="#workflow">
            Workflow
          </Link>
          <Link
            className="transition-colors hover:text-slate-900"
            href="https://github.com/getsentry/sentry"
            target="_blank"
            rel="noreferrer"
          >
            Sentry Repo
          </Link>
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          <button className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900">
            Log in
          </button>
          <button className="rounded-md bg-brand-card px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02]">
            Start Estimating
          </button>
        </div>
      </div>
    </header>
  );
}
