import type { Activity, DiscordUser, StoredGame } from "./types";

export function formatMs(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function timeAgo(timestamp: number): string {
  const now = Date.now();
  const diffSec = Math.max(0, Math.floor((now - timestamp) / 1000));

  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}d ago`;
}

export function getDiscordAvatarUrl(user: DiscordUser): string {
  if (!user.avatar) {
    const defaultIndex = user.discriminator === "0"
      ? Number(BigInt(user.id) >> BigInt(22)) % 6)
      : Number(user.discriminator) % 5;
    return `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
  }
  const isAnimated = user.avatar.startsWith("a_");
  const extension = isAnimated ? "gif" : "webp";
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${extension}?size=128`;
}

export function findGameActivity(activities: Activity[] = []): Activity | undefined {
  return activities.find(
    (a) => a.type === 0 && a.name.toLowerCase() !== "spotify"
  );
}

export function getGameStatusText(
  game: StoredGame | { name: string; details?: string; state?: string }
): string {
  if (!game) return "";
  if (game.details && game.state) {
    return `playing ${game.name} - ${game.details} (${game.state})`;
  }
  if (game.details) {
    return `playing ${game.name} - ${game.details}`;
  }
  if (game.state) {
    return `playing ${game.name} - ${game.state}`;
  }
  return `playing ${game.name}`;
}
