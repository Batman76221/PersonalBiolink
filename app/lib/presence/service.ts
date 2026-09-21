import type { LanyardData, StoredSpotify, StoredGame, StoredStatus } from "./types";
import { LANYARD_API_BASE, CURRENT_TTL, LAST_TTL, getRedisKeys } from "./constants";
import { findGameActivity } from "./utils";

export type LanyardResponse = { success: boolean; data?: LanyardData };

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchLanyardData(
  userId: string,
  maxRetries: number = 2
): Promise<LanyardData | null> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const res = await fetch(`${LANYARD_API_BASE}/users/${userId}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        if (res.status >= 500 && attempt < maxRetries - 1) {
          const backoffMs = Math.min(1000 * Math.pow(2, attempt), 3000);
          await sleep(backoffMs);
          continue;
        }
        return null;
      }

      const payload = (await res.json()) as LanyardResponse;
      if (!payload.success || !payload.data) {
        return null;
      }

      return payload.data;
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        const backoffMs = Math.min(1000 * Math.pow(2, attempt), 3000);
        await sleep(backoffMs);
      }
    }
  }

  return null;
}

export async function storePresenceData(
  redis: any,
  userId: string,
  current: LanyardData
): Promise<{
  lastSpotify: StoredSpotify | null;
  lastGame: StoredGame | null;
  lastStatus: StoredStatus | null;
}> {
  const keys = getRedisKeys(userId);

  try {
    await redis.set(keys.current, JSON.stringify(current), "EX", CURRENT_TTL);
  } catch {}

  let lastSpotify: StoredSpotify | null = null;
  let lastGame: StoredGame | null = null;
  let lastStatus: StoredStatus | null = null;

  if (current.listening_to_spotify && current.spotify) {
    lastSpotify = {
      song: current.spotify.song,
      artist: current.spotify.artist,
      album_art_url: current.spotify.album_art_url,
      track_id: current.spotify.track_id,
      seenAt: Date.now(),
    };
    try {
      await redis.set(keys.spotify, JSON.stringify(lastSpotify), "EX", LAST_TTL);
    } catch {}
  }

  const game = findGameActivity(current.activities);
  if (game && current.discord_status !== "offline") {
    lastGame = {
      name: game.name,
      details: game.details,
      state: game.state,
      seenAt: Date.now(),
    };
    try {
      await redis.set(keys.game, JSON.stringify(lastGame), "EX", LAST_TTL);
    } catch {}
  }

  if (current.discord_status !== "offline") {
    lastStatus = {
      status: current.discord_status,
      seenAt: Date.now(),
    };
    try {
      await redis.set(keys.status, JSON.stringify(lastStatus), "EX", LAST_TTL);
    } catch {}
  }

  return { lastSpotify, lastGame, lastStatus };
}

export async function getCachedPresenceData(
  redis: any,
  userId: string
): Promise<{
  current: LanyardData | null;
  lastSpotify: StoredSpotify | null;
  lastGame: StoredGame | null;
  lastStatus: StoredStatus | null;
}> {
  const keys = getRedisKeys(userId);

  try {
    const [cachedCurrent, cachedSpotify, cachedGame, cachedStatus] = await Promise.all([
      redis.get(keys.current),
      redis.get(keys.spotify),
      redis.get(keys.game),
      redis.get(keys.status),
    ]);

    return {
      current: cachedCurrent ? (JSON.parse(cachedCurrent) as LanyardData) : null,
      lastSpotify: cachedSpotify ? (JSON.parse(cachedSpotify) as StoredSpotify) : null,
      lastGame: cachedGame ? (JSON.parse(cachedGame) as StoredGame) : null,
      lastStatus: cachedStatus ? (JSON.parse(cachedStatus) as StoredStatus) : null,
    };
  } catch {
    return {
      current: null,
      lastSpotify: null,
      lastGame: null,
      lastStatus: null,
    };
  }
}
