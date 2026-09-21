export const CLIENT_POLL_INTERVAL = 2_000;

export const LANYARD_API_BASE = "https://api.lanyard.rest/v1";

export const CURRENT_TTL = 60;
export const LAST_TTL = 60 * 60 * 24 * 7;

export const statusDotMap: Record<string, string> = {
  online: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]",
  idle: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]",
  dnd: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)]",
  offline: "bg-zinc-500",
};

export function getRedisKeys(userId: string) {
  return {
    current: `presence:${userId}:current`,
    spotify: `presence:${userId}:spotify`,
    game: `presence:${userId}:game`,
    status: `presence:${userId}:status`,
  };
}
