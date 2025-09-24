import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "WhosNext | Engineering Effort Estimator",
  description:
    "Explore GitHub issues from the Sentry repository and prepare for agent-based effort estimation.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-brand-gradient text-slate-900">
        {children}
      </body>
    </html>
  );
}
