import { gzipSync, gunzipSync } from "node:zlib";

export interface SessionData {
  user: { id: string; username: string; avatar: string | null };
  guilds: { id: string; name: string; icon: string | null; permissions: string }[];
}

export const SESSION_COOKIE = "psess";

declare global {
  var __sessionStore: Map<string, SessionData> | undefined;
}

export const sessionStore: Map<string, SessionData> =
  globalThis.__sessionStore ?? (globalThis.__sessionStore = new Map());

export function encodeSessionCookie(data: SessionData): string {
  const slim: SessionData = {
    user: data.user,
    guilds: data.guilds.map((g) => ({
      id: g.id,
      name: g.name,
      icon: g.icon,
      permissions: g.permissions,
    })),
  };
  return gzipSync(Buffer.from(JSON.stringify(slim), "utf8")).toString("base64url");
}

export function decodeSessionCookie(raw: string | undefined | null): SessionData | null {
  if (!raw) return null;
  try {
    const json = gunzipSync(Buffer.from(raw, "base64url")).toString("utf8");
    const data = JSON.parse(json) as SessionData;
    if (!data?.user?.id || !Array.isArray(data.guilds)) return null;
    return data;
  } catch {
    return null;
  }
}
