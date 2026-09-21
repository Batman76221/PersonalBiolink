"use client";

import { useEffect, useMemo, useState } from "react";
import type { LanyardData, StoredSpotify, StoredGame, StoredStatus, PresenceResponse } from "@/app/lib/presence/types";
import { FiSmartphone, FiMonitor, FiGlobe } from "react-icons/fi";
import { CLIENT_POLL_INTERVAL, statusDotMap } from "@/app/lib/presence/constants";
import { getDiscordAvatarUrl, getGameStatusText, findGameActivity, timeAgo } from "@/app/lib/presence/utils";

interface LanyardStatusProps {
  userId: string;
  onSpotifyChange?: (spotify: StoredSpotify | null, isLive: boolean, timestamps: { start: number; end: number } | null) => void;
}

export default function LanyardStatus({ userId, onSpotifyChange }: LanyardStatusProps) {
  const [status, setStatus] = useState<LanyardData | null>(null);
  const [lastGame, setLastGame] = useState<StoredGame | null>(null);
  const [lastStatus, setLastStatus] = useState<StoredStatus | null>(null);
  useEffect(() => {
    let mounted = true;

    const fetchPresence = async () => {
      try {
        const res = await fetch(`/api/presence/${userId}`, { cache: "no-store" });
        if (!res.ok) return;

        const payload = (await res.json()) as PresenceResponse;
        if (!mounted) return;

        if (payload.current) {
          setStatus(payload.current);
        }

        if (payload.lastGame) setLastGame(payload.lastGame);
        if (payload.lastStatus) setLastStatus(payload.lastStatus);
      } catch {}
    };

    fetchPresence();
    const pollId = setInterval(fetchPresence, CLIENT_POLL_INTERVAL);

    return () => {
      mounted = false;
      clearInterval(pollId);
    };
  }, [userId]);

  const isLiveSpotify = Boolean(status?.listening_to_spotify && status.spotify);
  const currentSpotifyData = isLiveSpotify ? status!.spotify : null;

  useEffect(() => {
    if (!onSpotifyChange) return;
    if (isLiveSpotify && currentSpotifyData) {
      onSpotifyChange(
        {
          song: currentSpotifyData.song,
          artist: currentSpotifyData.artist,
          album_art_url: currentSpotifyData.album_art_url,
          track_id: currentSpotifyData.track_id,
          seenAt: Date.now(),
        },
        true,
        currentSpotifyData.timestamps
      );
    } else {
      onSpotifyChange(null, false, null);
    }
  }, [isLiveSpotify, currentSpotifyData, onSpotifyChange]);

  const currentGame = useMemo(() => {
    if (!status) return null;
    const game = findGameActivity(status.activities);
    if (!game) return null;
    return { name: game.name, details: game.details, state: game.state };
  }, [status]);

  const customStatusActivity = useMemo(() => {
    if (!status?.activities) return null;
    return status.activities.find((a) => a.type === 4);
  }, [status?.activities]);

  const gameToDisplay = currentGame || lastGame;
  
  const currentActivityText = useMemo(() => {
    if (isLiveSpotify && currentSpotifyData) {
      return `listening to ${currentSpotifyData.song} — ${currentSpotifyData.artist}`;
    }
    if (customStatusActivity?.state) {
      return customStatusActivity.state;
    }
    if (currentGame) {
      return getGameStatusText(currentGame);
    }
    return null;
  }, [isLiveSpotify, currentSpotifyData, customStatusActivity, currentGame]);

  const gameStatusText = useMemo(() => {
    if (customStatusActivity?.state) {
      return customStatusActivity.state;
    }
    if (!gameToDisplay) return null;
    const text = getGameStatusText(gameToDisplay);
    const isOffline = status?.discord_status === "offline";
    if (!currentGame && lastGame && !isOffline) {
      return `${timeAgo(lastGame.seenAt)} - ${text}`;
    }
    return text;
  }, [customStatusActivity, gameToDisplay, currentGame, lastGame, status?.discord_status]);

  const activePlatforms = useMemo(() => {
    if (!status) return [];
    const platforms = [];
    if (status.active_on_discord_mobile) platforms.push({ icon: FiSmartphone, name: "Mobile" });
    if (status.active_on_discord_desktop) platforms.push({ icon: FiMonitor, name: "Desktop" });
    if (status.active_on_discord_web) platforms.push({ icon: FiGlobe, name: "Web" });
    return platforms;
  }, [status]);

  if (!status) {
    return (
      <section className="fade-in-up delay-1 glass-card relative px-5 py-4 overflow-hidden border border-white/10 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-full bg-white/10 animate-pulse" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-28 bg-white/10 rounded animate-pulse" />
            <div className="h-3 w-40 bg-white/5 rounded animate-pulse" />
          </div>
        </div>
      </section>
    );
  }

  const effectiveUser = status.discord_user;
  const effectiveStatus = status.discord_status;
  const displayName = effectiveUser.global_name || effectiveUser.username;
  const dotClass = statusDotMap[effectiveStatus] || statusDotMap.offline;
  const avatarUrl = getDiscordAvatarUrl(effectiveUser);

  return (
    <section className="fade-in-up delay-1 glass-card relative px-5 py-4 overflow-hidden border border-white/10 hover:border-pink-500/30 transition-all shadow-xl">
      <div className="relative flex items-center gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3.5">
          <div className="relative h-12 w-12 flex-shrink-0">
            <div className="h-full w-full rounded-full bg-white/10 overflow-hidden ring-1 ring-white/15 shadow-md">
              <img
                src={avatarUrl}
                alt={`${displayName} avatar`}
                className="h-full w-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#060206] ${dotClass}`} />
          </div>
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-zinc-100 truncate">{displayName}</p>
              {activePlatforms.length > 0 && (
                <div className="flex items-center gap-1.5 opacity-80">
                  {activePlatforms.map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <Icon
                        key={platform.name}
                        className="text-zinc-400 hover:text-zinc-200 transition-colors"
                        size={13}
                        title={platform.name}
                      />
                    );
                  })}
                </div>
              )}
            </div>
            <p className="text-xs text-zinc-400 truncate">
              {currentActivityText || `${effectiveStatus}`}
            </p>
            {gameStatusText && gameStatusText !== currentActivityText && (
              <p className="text-[11px] text-zinc-500 truncate">{gameStatusText}</p>
            )}
            {effectiveStatus === "offline" && lastStatus && (
              <p className="text-xs text-zinc-500 truncate">
                last active {timeAgo(lastStatus.seenAt)} ({lastStatus.status})
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
