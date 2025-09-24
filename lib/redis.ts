import Redis from "ioredis";

declare global {
  // eslint-disable-next-line no-var
  var _redisClientPromise: Promise<Redis | null> | null | undefined;
}

async function createRedisClient(): Promise<Redis | null> {
  const url = process.env.REDIS_URL;

  if (!url) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Redis URL not provided. Caching is disabled.");
    }
    return null;
  }

  const client = new Redis(url, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
    enableAutoPipelining: true,
  });

  client.on("error", (error) => {
    console.error("Redis connection error", error);
  });

  try {
    await client.connect();
  } catch (error) {
    console.error("Failed to connect to Redis", error);
    return null;
  }

  return client;
}

let redisClientPromise: Promise<Redis | null> | null = globalThis._redisClientPromise ?? null;

if (!redisClientPromise) {
  redisClientPromise = createRedisClient();
  if (typeof window === "undefined") {
    globalThis._redisClientPromise = redisClientPromise;
  }
}

export async function getRedisClient(): Promise<Redis | null> {
  if (!redisClientPromise) {
    redisClientPromise = createRedisClient();
    if (typeof window === "undefined") {
      globalThis._redisClientPromise = redisClientPromise;
    }
  }

  try {
    return await redisClientPromise;
  } catch (error) {
    console.error("Failed to resolve Redis client", error);
    redisClientPromise = null;
    if (typeof window === "undefined") {
      globalThis._redisClientPromise = redisClientPromise;
    }
    return null;
  }
}

export const ISSUE_CACHE_TTL_SECONDS = 60 * 60 * 24; // 24 hours
export const ANALYSIS_CACHE_TTL_SECONDS = ISSUE_CACHE_TTL_SECONDS;

export function getIssueCacheKey(issueNumber: number): string {
  return `issue:${issueNumber}`;
}

export function getIssueAnalysisCacheKey(issueNumber: number): string {
  return `analysis:${issueNumber}`;
}
