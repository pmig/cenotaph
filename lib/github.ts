const GITHUB_OWNER = "getsentry";
const GITHUB_REPO = "sentry";

const baseUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;

const defaultHeaders: HeadersInit = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

if (process.env.GITHUB_TOKEN) {
  defaultHeaders.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

export interface GitHubLabel {
  id: number;
  name: string;
  color: string;
  description?: string | null;
}

export interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body?: string | null;
  state: "open" | "closed";
  comments: number;
  html_url: string;
  labels: GitHubLabel[];
  user: GitHubUser;
  created_at: string;
  updated_at: string;
}

async function githubFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      ...defaultHeaders,
      ...init?.headers,
    },
    next: {
      revalidate: 300,
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub API responded with ${response.status} for ${path}`);
  }

  return (await response.json()) as T;
}

export async function fetchIssues(perPage = 12): Promise<GitHubIssue[]> {
  const params = new URLSearchParams({
    state: "open",
    per_page: perPage.toString(),
  });

  return githubFetch<GitHubIssue[]>(`/issues?${params.toString()}`);
}

export async function fetchIssue(issueNumber: number): Promise<GitHubIssue> {
  return githubFetch<GitHubIssue>(`/issues/${issueNumber}`);
}

export function formatRelativeTime(value: string): string {
  const date = new Date(value);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;

  const years = Math.floor(days / 365);
  return `${years}y ago`;
}
