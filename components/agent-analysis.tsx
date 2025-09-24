"use client";

import { useState } from "react";
import type { GitHubIssue } from "@/lib/github";

interface AnalysisResult {
  summary: string;
  estimatedHours: number;
  complexity: "Low" | "Medium" | "High";
  requiredSkills: string[];
  potentialChallenges: string[];
  suggestedApproach: string;
}

export function AgentAnalysis({ issue }: { issue: GitHubIssue }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze-issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: issue.title,
          body: issue.body,
          labels: issue.labels.map((l) => l.name),
          comments: issue.comments,
        }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const result = await response.json();
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">AI Agent Analysis</h2>
          {!analysis && (
            <button
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className="rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-primary/90 disabled:opacity-50"
            >
              {isAnalyzing ? "Analyzing..." : "Run Analysis"}
            </button>
          )}
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
            Error: {error}
          </div>
        )}

        {isAnalyzing && (
          <div className="space-y-3">
            <div className="animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
            </div>
            <p className="text-sm text-slate-500">
              The AI agent is analyzing the issue context, traversing relevant code, and generating insights...
            </p>
          </div>
        )}

        {analysis && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Summary</h3>
              <p className="text-sm text-slate-600">{analysis.summary}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Estimated Hours</p>
                <p className="text-xl font-bold text-slate-900">{analysis.estimatedHours}h</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Complexity</p>
                <p className="text-xl font-bold text-slate-900">{analysis.complexity}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.requiredSkills.map((skill, i) => (
                  <span key={i} className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Potential Challenges</h3>
              <ul className="space-y-1 text-sm text-slate-600">
                {analysis.potentialChallenges.map((challenge, i) => (
                  <li key={i} className="flex items-start">
                    <span className="mr-2 text-orange-500">•</span>
                    {challenge}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Suggested Approach</h3>
              <p className="text-sm text-slate-600">{analysis.suggestedApproach}</p>
            </div>

            <button
              onClick={() => {
                setAnalysis(null);
                runAnalysis();
              }}
              className="text-sm text-brand-primary hover:underline"
            >
              Re-run Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
}