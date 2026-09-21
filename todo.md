for the background use the same as 
C:\Users\futur\Downloads\gayyy'\gayyy'

but in pink

i want it to have
<h1 class="heading-font avatar-gradient-text text-5xl font-bold tracking-tight sm:text-6xl">Terrified</h1>
<p class="mt-3 max-w-sm text-sm leading-relaxed text-zinc-400">passionate developer creating products used by millions of users and thousands of guilds.</p>

<a href="https://exhale.best" target="_blank" rel="noreferrer" class="glass-card group flex flex-col gap-3 p-4 transition-all hover:border-white/15 hover:bg-white/[0.05]"><div class="flex items-center gap-3"><span class="h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black/40 p-1"><img src="https://avatars.githubusercontent.com/u/242625464?s=400&u=c61a1097bed4030b512c0e3ef649ffe3b2a0a689&v=4" alt="" class="h-full w-full rounded-sm object-contain " loading="lazy" referrerpolicy="no-referrer"></span><div class="min-w-0"><p class="text-sm font-medium text-zinc-100">Purify</p><p class="text-[11px] text-zinc-500">Aug 2024 - present</p></div><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="ml-auto h-4 w-4 flex-shrink-0 text-zinc-600 transition-all group-hover:text-zinc-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg></div><p class="text-xs leading-relaxed text-zinc-500">The all in one discord moderation bot for your server.</p></a>

lanyard Status
"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import type { LanyardData, StoredSpotify, StoredGame, StoredStatus, PresenceResponse } from "@/app/lib/presence/types";
import { FiSmartphone, FiMonitor, FiGlobe } from "react-icons/fi";
import { CLIENT_POLL_INTERVAL, statusDotMap } from "@/app/lib/presence/constants";
import { formatMs, timeAgo, getDiscordAvatarUrl, getGameStatusText, findGameActivity } from "@/app/lib/presence/utils";
import SpotifyLyrics from "./SpotifyLyrics";

export default function LanyardStatus({ userId }: { userId: string }) {
  const [status, setStatus] = useState<LanyardData | null>(null);
  const [lastSpotify, setLastSpotify] = useState<StoredSpotify | null>(null);
  const [lastGame, setLastGame] = useState<StoredGame | null>(null);
  const [lastStatus, setLastStatus] = useState<StoredStatus | null>(null);
  const [, setTick] = useState(0);
  const [spotifyProgress, setSpotifyProgress] = useState<number | null>(null);
  const [spotifyTimes, setSpotifyTimes] = useState<{ elapsed: string; total: string } | null>(null);
  const prevStatusRef = useRef<LanyardData["discord_status"] | null>(null);

  const calcSpotifyProgress = useCallback((s: typeof status) => {
    if (!s?.listening_to_spotify || !s.spotify?.timestamps) {
      setSpotifyProgress(null);
      setSpotifyTimes(null);
      return;
    }
    const { start, end } = s.spotify.timestamps;
    const now = Date.now();
    const pct = Math.min(1, Math.max(0, (now - start) / (end - start)));
    setSpotifyProgress(pct);
    setSpotifyTimes({ elapsed: formatMs(now - start), total: formatMs(end - start) });
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/presence/${userId}`, { cache: "no-store" });
        if (!res.ok) {
          if (!mounted) return;
          setStatus(null);
          setLastSpotify(null);
          setLastGame(null);
          setLastStatus(null);
          return;
        }

        const payload = (await res.json()) as PresenceResponse;
        if (!mounted) return;
        if (!payload.current) {
          setStatus(null);
          setLastSpotify(null);
          setLastGame(null);
          setLastStatus(null);
          return;
        }

        setStatus(payload.current);
        setLastSpotify(payload.lastSpotify ?? null);
        setLastGame(payload.lastGame ?? null);
        setLastStatus(payload.lastStatus ?? null);
      } catch {
        if (!mounted) return;
        setStatus(null);
        setLastSpotify(null);
        setLastGame(null);
        setLastStatus(null);
      }
    };

    fetchStatus();
    const id = window.setInterval(fetchStatus, CLIENT_POLL_INTERVAL);

    return () => {
      mounted = false;
      window.clearInterval(id);
    };
  }, [userId]);

  useEffect(() => {
    if (!status) return;
    prevStatusRef.current = status.discord_status;
  }, [status]);

  useEffect(() => {
    if (status?.discord_status !== "offline") return;
    const id = window.setInterval(() => setTick((t) => t + 1), 30_000);
    return () => window.clearInterval(id);
  }, [status?.discord_status]);

  useEffect(() => {
    const shouldTick = (lastSpotify && !status?.listening_to_spotify) || 
                       (lastGame && !status?.activities.find(a => a.type === 0));
    if (!shouldTick) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 30_000);
    return () => window.clearInterval(id);
  }, [lastSpotify, lastGame, status?.listening_to_spotify, status?.activities]);

  useEffect(() => {
    const immediateId = window.setTimeout(() => calcSpotifyProgress(status), 0);
    if (!status?.listening_to_spotify || !status.spotify?.timestamps) {
      return () => window.clearTimeout(immediateId);
    }
    const id = window.setInterval(() => calcSpotifyProgress(status), 1_000);
    return () => {
      window.clearTimeout(immediateId);
      window.clearInterval(id);
    };
  }, [status, calcSpotifyProgress]);

  const currentGame = useMemo(() => {
    if (!status) return null;
    const game = findGameActivity(status.activities);
    if (!game) return null;
    return { name: game.name, details: game.details, state: game.state };
  }, [status]);

  const gameToDisplay = currentGame || lastGame;
  
  const gameStatusText = useMemo(() => {
    if (!gameToDisplay) return null;
    const text = getGameStatusText(gameToDisplay);
    const isOffline = status?.discord_status === "offline";
    if (!currentGame && lastGame && !isOffline) {
      return `${timeAgo(lastGame.seenAt)} - ${text}`;
    }
    return text;
  }, [gameToDisplay, currentGame, lastGame, status?.discord_status]);

  const currentSpotifyData = status?.listening_to_spotify ? status.spotify : null;
  const spotifyToDisplay = currentSpotifyData || lastSpotify;
  
  const spotifyMeta = useMemo(() => {
    if (!spotifyToDisplay) return null;
    const isOffline = status?.discord_status === "offline";
    const prefix = !currentSpotifyData && lastSpotify && !isOffline
      ? `${timeAgo(lastSpotify.seenAt)} · `
      : "";
    return {
      prefix,
      song: spotifyToDisplay.song,
      artist: spotifyToDisplay.artist,
    };
  }, [spotifyToDisplay, currentSpotifyData, lastSpotify, status?.discord_status]);

  const spotifyAlbumArt = spotifyToDisplay?.album_art_url ?? null;
  const spotifyTrackId = spotifyToDisplay?.track_id ?? null;
  const isSpotifyCurrent = currentSpotifyData !== null;
  const spotifyInlineArtwork = spotifyAlbumArt ? (
    spotifyTrackId ? (
      <a
        href={`https://open.spotify.com/track/${spotifyTrackId}`}
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-4 w-4 flex-shrink-0 overflow-hidden rounded border border-white/15 align-middle"
      >
        <img
          src={spotifyAlbumArt}
          alt=""
          className="h-full w-full object-cover opacity-90"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </a>
    ) : (
      <span className="inline-flex h-4 w-4 flex-shrink-0 overflow-hidden rounded border border-white/15 align-middle">
        <img
          src={spotifyAlbumArt}
          alt=""
          className="h-full w-full object-cover opacity-90"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </span>
    )
  ) : null;

  const spotifyNowPlayingBlock = spotifyMeta ? (
    <div className="flex items-start gap-1.5 min-w-0">
      {spotifyInlineArtwork}
      <div className="min-w-0 flex-1">
        <p className="text-xs text-zinc-400 truncate">
          {spotifyMeta.prefix}
          {spotifyMeta.song}
        </p>
        <p className="text-[11px] text-zinc-500 truncate">
          by {spotifyMeta.artist}
        </p>
      </div>
    </div>
  ) : null;

  const activePlatforms = useMemo(() => {
    if (!status) return [];
    const platforms = [];
    if (status.active_on_discord_mobile) platforms.push({ icon: FiSmartphone, name: "Mobile" });
    if (status.active_on_discord_desktop) platforms.push({ icon: FiMonitor, name: "Desktop" });
    if (status.active_on_discord_web) platforms.push({ icon: FiGlobe, name: "Web" });
    return platforms;
  }, [status]);

  const isOffline = status?.discord_status === "offline";
  
  const lastSeenLabel = useMemo(() => {
    if (!isOffline || !lastStatus) return null;
    return `last active ${timeAgo(lastStatus.seenAt)} (${lastStatus.status})`;
  }, [isOffline, lastStatus]);

  if (!status) return null;

  const displayName = status.discord_user.global_name || status.discord_user.username;
  const dotClass = statusDotMap[status.discord_status];
  const avatarUrl = getDiscordAvatarUrl(status.discord_user);
  const avatarDecorationUrl = status.discord_user.avatar_decoration_data
    ? `https://cdn.discordapp.com/avatar-decoration-presets/${status.discord_user.avatar_decoration_data.asset}.png?size=128`
    : null;
  const nameplateUrl = status.discord_user.collectibles?.nameplate
    ? `https://cdn.discordapp.com/assets/collectibles/${status.discord_user.collectibles.nameplate.asset}static.png`
    : null;

  return (
    <>
      <SpotifyLyrics
        trackId={currentSpotifyData?.track_id ?? null}
        track={currentSpotifyData?.song ?? null}
        artist={currentSpotifyData?.artist ?? null}
        timestamps={currentSpotifyData?.timestamps ?? null}
        isPlaying={status.listening_to_spotify}
      />
      <section className="fade-in-up delay-1 glass-card relative px-5 py-4 overflow-hidden">
      {nameplateUrl && (
        <img
          src={nameplateUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      )}
      <div className="relative flex items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="relative h-11 w-11 flex-shrink-0">
            <div className="h-full w-full rounded-full bg-white/10 overflow-hidden">
              <img
                src={avatarUrl}
                alt={`${displayName} avatar`}
                className="h-full w-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            {avatarDecorationUrl && (
              <img
                src={avatarDecorationUrl}
                alt=""
                className="absolute -inset-1.5 h-[calc(100%+12px)] w-[calc(100%+12px)] object-contain pointer-events-none"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            )}
            <span className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border border-[#0f0f0f] ${dotClass}`} />
          </div>
          <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-medium text-zinc-100 truncate">{displayName}</p>
            {activePlatforms.length > 0 && (
              <div className="flex items-center gap-1">
                {activePlatforms.map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <Icon
                      key={platform.name}
                      className="text-zinc-400 cursor-default"
                      size={14}
                      title={platform.name}
                    />
                  );
                })}
              </div>
            )}
          </div>
          {isOffline && lastSeenLabel ? (
            <>
              <p className="text-xs text-zinc-500 truncate">{lastSeenLabel}</p>
              {gameStatusText && (
                <p className="text-xs text-zinc-400 truncate">{gameStatusText}</p>
              )}
              {spotifyNowPlayingBlock}
            </>
          ) : (
            <>
              {gameStatusText && (
                <p className="text-xs text-zinc-400 truncate">{gameStatusText}</p>
              )}
              {spotifyNowPlayingBlock}
            </>
          )}
          {isSpotifyCurrent && spotifyProgress !== null && spotifyTimes && (
            <div className="space-y-0.5">
              <div className="h-0.5 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-none"
                  style={{ width: `${spotifyProgress * 100}%` }}
                />
              </div>
              <div className="flex justify-between" style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}>
                <span className="text-[10px] text-zinc-500">{spotifyTimes.elapsed}</span>
                <span className="text-[10px] text-zinc-500">{spotifyTimes.total}</span>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </section>
    </>
  );
}

import type { IconType } from "react-icons";
import {
  SiCloudflare,
  SiDocker,
  SiFastapi,
  SiFlask,
  SiGit,
  SiGithub,
  SiPostgresql,
  SiPython,
  SiRedis,
  SiSentry,
  SiVercel,
} from "react-icons/si";

export const tech = [
  { label: "Docker", href: "https://www.docker.com" },
  { label: "GitHub", href: "https://github.com" },
  { label: "Vercel", href: "https://vercel.com" },
  { label: "Cloudflare", href: "https://cloudflare.com" },
  { label: "Python", href: "https://www.python.org" },
  { label: "FastAPI", href: "https://fastapi.tiangolo.com" },
  { label: "Flask", href: "https://flask.palletsprojects.com" },
] as const;

export type TechItem = (typeof tech)[number];
export type TechName = TechItem["label"];

export const techIcons: Record<TechName, IconType> = {
  Docker: SiDocker,
  GitHub: SiGithub,
  Vercel: SiVercel,
  Cloudflare: SiCloudflare,
  Python: SiPython,
  FastAPI: SiFastapi,
  Flask: SiFlask,
};

links.ts
import { FiCode, FiMail } from "react-icons/fi";
import { SiDiscord, SiGithub } from "react-icons/si";
import type { IconType } from "react-icons";

export interface Link {
  label: string;
  href: string;
  icon: IconType;
}

export const links: Link[] = [
  { label: "github", href: "https://github.com/batman76221", icon: SiGithub },
  { label: "discord", href: "https://discord.com/users/1447292903654428733", icon: SiDiscord },
  { label: "source", href: "https://github.com/batman76221/PersonalBiolink", icon: FiCode },
];


import { NextResponse } from "next/server";
import redis from "@/app/lib/redis";
import type { PresenceResponse } from "@/app/lib/presence/types";
import { getCachedPresenceData, fetchLanyardData, storePresenceData } from "@/app/lib/presence/service";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const referer = req.headers.get("referer");
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  
  const isDirectAccess = !referer && !origin;
  const isDifferentOrigin = referer && !referer.includes(host || "");
  
  if (isDirectAccess || isDifferentOrigin) {
    return NextResponse.json(
      { error: "Direct access not allowed" }, 
      { status: 403 }
    );
  }

  const { userId } = await params;

  let { current, lastSpotify, lastGame, lastStatus } = await getCachedPresenceData(redis, userId);

  if (!current) {
    try {
      current = await fetchLanyardData(userId);

      if (!current) {
        return NextResponse.json({ error: "no data" }, { status: 502 });
      }

      const stored = await storePresenceData(redis, userId, current);
      if (stored.lastSpotify) lastSpotify = stored.lastSpotify;
      if (stored.lastGame) lastGame = stored.lastGame;
      if (stored.lastStatus) lastStatus = stored.lastStatus;
    } catch (error) {
      console.error("Error fetching presence:", error);
      return NextResponse.json({ error: "upstream error" }, { status: 502 });
    }
  }

  const body: PresenceResponse = { current, lastSpotify, lastGame, lastStatus };
  return NextResponse.json(body);
}
