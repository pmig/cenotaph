import { getIssueCacheKey, getRedisClient, ISSUE_CACHE_TTL_SECONDS } from "./redis";

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

interface GitHubIssueResponse {
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
  pull_request?: {
    url: string;
    html_url: string;
    diff_url: string;
    patch_url: string;
    merged_at?: string | null;
  };
}

export type GitHubIssue = Omit<GitHubIssueResponse, "pull_request">;

function isIssue(item: GitHubIssueResponse): item is GitHubIssue {
  return !item.pull_request;
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
  const issues: GitHubIssue[] = [];
  const pageSize = Math.min(100, Math.max(perPage * 2, 30));

  for (let page = 1; issues.length < perPage && page <= 5; page += 1) {
    const params = new URLSearchParams({
      state: "open",
      per_page: pageSize.toString(),
      sort: "created",
      direction: "desc",
      page: page.toString(),
    });

    const batch = await githubFetch<GitHubIssueResponse[]>(`/issues?${params.toString()}`);
    const pureIssues = batch.filter(isIssue);
    issues.push(...pureIssues);

    if (batch.length < pageSize) {
      break;
    }
  }

  return issues.slice(0, perPage);
}

export async function fetchIssue(issueNumber: number): Promise<GitHubIssue> {
  const redis = await getRedisClient();
  const cacheKey = getIssueCacheKey(issueNumber);

  if (redis) {
    try {
      const cachedValue = await redis.get(cacheKey);
      if (cachedValue) {
        return JSON.parse(cachedValue) as GitHubIssue;
      }
    } catch (error) {
      console.error(`Failed to read issue #${issueNumber} from Redis`, error);
    }
  }

  const item = await githubFetch<GitHubIssueResponse>(`/issues/${issueNumber}`);

  if (!isIssue(item)) {
    throw new Error(`Item #${issueNumber} is a pull request, not an issue.`);
  }

  if (redis) {
    try {
      await redis.set(cacheKey, JSON.stringify(item), "EX", ISSUE_CACHE_TTL_SECONDS);
    } catch (error) {
      console.error(`Failed to cache issue #${issueNumber} in Redis`, error);
    }
  }

  return item;
}

export async function getCachedIssueNumbers(issueNumbers: number[]): Promise<Set<number>> {
  const redis = await getRedisClient();

  if (!redis || issueNumbers.length === 0) {
    return new Set();
  }

  try {
    const pipeline = redis.pipeline();
    issueNumbers.forEach((issueNumber) => {
      pipeline.exists(getIssueCacheKey(issueNumber));
    });

    const results = await pipeline.exec();
    const cached = new Set<number>();

    results?.forEach((result, index) => {
      if (!Array.isArray(result)) {
        return;
      }

      const [error, exists] = result;
      if (!error && Number(exists) === 1) {
        cached.add(issueNumbers[index]);
      }
    });

    return cached;
  } catch (error) {
    console.error("Failed to resolve cached issue numbers", error);
    return new Set();
  }
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
