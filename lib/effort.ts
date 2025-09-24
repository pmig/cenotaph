import type { GitHubIssue, GitHubLabel } from "@/lib/github";

export interface EffortEstimate {
  hours: number;
  complexity: "low" | "medium" | "high";
  confidence: "low" | "medium" | "high";
  breakdown: string[];
}

const LABEL_WEIGHTS: Record<string, number> = {
  bug: 1.5,
  regression: 2,
  feature: 2,
  enhancement: 1,
  alerts: 1.2,
  performance: 1.3,
  "frontend": 1.1,
  "backend": 1.1,
  "waiting for: product owner": -0.5,
  "waiting for: support": -0.5,
  "help wanted": 0.5,
};

function scoreLabels(labels: GitHubLabel[]): { score: number; applied: string[] } {
  let score = 0;
  const applied: string[] = [];

  labels.forEach((label) => {
    const key = label.name.trim().toLowerCase();
    const match = LABEL_WEIGHTS[key];
    if (match) {
      score += match;
      applied.push(`${label.name} (${match > 0 ? "+" : ""}${match.toFixed(1)}h)`);
    }
  });

  return { score, applied };
}

export function estimateIssueEffort(issue: GitHubIssue): EffortEstimate {
  const wordCount = issue.body ? issue.body.split(/\s+/).filter(Boolean).length : 0;
  const baseHours = 2; // base review and reproduction time

  const descriptionFactor = wordCount / 350; // longer description -> more scenarios
  const commentFactor = issue.comments * 0.6; // each comment usually adds rework

  const codeContextMatches = (issue.body?.match(/```/g)?.length ?? 0) / 2; // code blocks
  const codeFactor = codeContextMatches * 0.75;

  const { score: labelScore, applied: labelBreakdown } = scoreLabels(issue.labels);

  let total = baseHours + descriptionFactor + commentFactor + codeFactor + labelScore;

  if (issue.body?.toLowerCase().includes("repro")) {
    total += 0.5;
  }

  if (issue.body?.toLowerCase().includes("migration") || issue.body?.toLowerCase().includes("refactor")) {
    total += 1.5;
  }

  if (issue.body?.toLowerCase().includes("breaking")) {
    total += 1.2;
  }

  if (issue.body?.toLowerCase().includes("docs")) {
    total += 0.3;
  }

  if (issue.body?.toLowerCase().includes("tests")) {
    total += 0.8;
  }

  // clamp and round to nearest 0.5h
  const clamped = Math.max(1, Math.min(total, 40));
  const hours = Math.round(clamped * 2) / 2;

  let complexity: EffortEstimate["complexity"] = "low";
  if (hours >= 10) {
    complexity = "high";
  } else if (hours >= 5) {
    complexity = "medium";
  }

  let confidence: EffortEstimate["confidence"] = "medium";
  if (issue.comments === 0 && wordCount > 0 && hours <= 6) {
    confidence = "high";
  } else if (issue.comments > 5 || wordCount < 50) {
    confidence = "low";
  }

  const breakdown = [
    `Base investigation: ${baseHours.toFixed(1)}h`,
    `Description analysis (${wordCount} words): +${descriptionFactor.toFixed(1)}h`,
    `Discussion review (${issue.comments} comments): +${commentFactor.toFixed(1)}h`,
  ];

  if (codeFactor > 0) {
    breakdown.push(`Code samples (${codeContextMatches} block${codeContextMatches === 1 ? "" : "s"}): +${codeFactor.toFixed(1)}h`);
  }

  if (labelBreakdown.length) {
    breakdown.push(`Labels: ${labelBreakdown.join(", ")}`);
  }

  if (hours >= 12) {
    breakdown.push("Includes buffer for coordination & validation");
  }

  return { hours, complexity, confidence, breakdown };
}
