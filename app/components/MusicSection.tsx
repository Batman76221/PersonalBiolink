"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import type { StoredSpotify } from "@/app/lib/presence/types";
import { formatMs } from "@/app/lib/presence/utils";
import { FiExternalLink } from "react-icons/fi";

type LyricLine = { time: number; text: string };

function parseLrc(lrc: string): LyricLine[] {
  const lines: LyricLine[] = [];
  for (const line of lrc.split("\n")) {
    const match = line.match(/^\[(\d+):(\d+)\.(\d+)\]\s*(.*)/);
    if (!match) continue;
    const minutes = parseInt(match[1], 10);
    const seconds = parseInt(match[2], 10);
    const ms = parseInt(match[3].padEnd(3, "0").slice(0, 3), 10);
    const time = minutes * 60000 + seconds * 1000 + ms;
    const text = match[4].trim();
    if (text) lines.push({ time, text });
  }
  return lines.sort((a, b) => a.time - b.time);
}

interface MusicSectionProps {
  spotify: StoredSpotify | null;
  isLive: boolean;
  timestamps: { start: number; end: number } | null;
  onCurrentLyricChange?: (lyric: string | null) => void;
}

export default function MusicSection({ spotify, isLive, timestamps, onCurrentLyricChange }: MusicSectionProps) {
  const [lines, setLines] = useState<LyricLine[] | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [spotifyProgress, setSpotifyProgress] = useState<number | null>(null);
  const [spotifyTimes, setSpotifyTimes] = useState<{ elapsed: string; total: string } | null>(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTrackKeyRef = useRef<string | null>(null);

  const calcProgress = useCallback(() => {
    if (!timestamps || !isLive) {
      setSpotifyProgress(null);
      setSpotifyTimes(null);
      return;
    }
    const now = Date.now();
    const pct = Math.min(1, Math.max(0, (now - timestamps.start) / (timestamps.end - timestamps.start)));
    setSpotifyProgress(pct);
    setSpotifyTimes({
      elapsed: formatMs(now - timestamps.start),
      total: formatMs(timestamps.end - timestamps.start),
    });
  }, [timestamps, isLive]);

  useEffect(() => {
    if (!timestamps || !isLive) {
      setSpotifyProgress(null);
      setSpotifyTimes(null);
      return;
    }
    calcProgress();
    const id = setInterval(calcProgress, 100);
    return () => clearInterval(id);
  }, [timestamps, isLive, calcProgress]);

  const fetchLyrics = useCallback(async (id: string | null, track: string, artist: string) => {
    try {
      const params = new URLSearchParams({ track, artist });
      if (id) params.set("trackId", id);
      const res = await fetch(`/api/lyrics?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (data.syncedLyrics) {
        setLines(parseLrc(data.syncedLyrics));
      } else {
        setLines(null);
      }
    } catch {
      setLines(null);
    }
  }, []);

  useEffect(() => {
    if (!spotify) {
      setLines(null);
      onCurrentLyricChange?.(null);
      return;
    }
    const key = spotify.track_id ?? `${spotify.song}::${spotify.artist}`;
    if (lastTrackKeyRef.current === key) return;
    lastTrackKeyRef.current = key;
    fetchLyrics(spotify.track_id, spotify.song, spotify.artist);
  }, [spotify, fetchLyrics]);

  useEffect(() => {
    if (!lines || lines.length === 0 || !timestamps || !isLive) return;

    const sync = () => {
      const elapsed = Date.now() - timestamps.start;
      if (elapsed < 0) {
        setCurrentIdx(0);
        return;
      }
      let low = 0;
      let high = lines.length - 1;
      let idx = 0;
      while (low <= high) {
        const mid = (low + high) >> 1;
        if (lines[mid].time <= elapsed) {
          idx = mid;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }
      setCurrentIdx(idx);
    };

    sync();
    const id = setInterval(sync, 60);
    return () => clearInterval(id);
  }, [lines, timestamps, isLive]);

  useEffect(() => {
    if (!onCurrentLyricChange) return;
    if (!lines || lines.length === 0 || !isLive || !lines[currentIdx]) {
      onCurrentLyricChange(null);
      return;
    }
    onCurrentLyricChange(lines[currentIdx].text);
  }, [lines, currentIdx, isLive, onCurrentLyricChange]);

  useEffect(() => {
    if (isUserInteracting || currentIdx < 0 || !activeLineRef.current || !containerRef.current) return;
    activeLineRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [currentIdx, isUserInteracting]);

  const handleContainerScroll = () => {
    setIsUserInteracting(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, 4000);
  };

  if (!spotify) return null;

  return (
    <section className="fade-in-up delay-2 w-full glass-card overflow-hidden p-5 border border-white/10 hover:border-pink-500/30 transition-all shadow-xl space-y-4">
      <div className="flex items-center gap-3.5">
        {spotify.album_art_url && (
          <a
            href={spotify.track_id ? `https://open.spotify.com/track/${spotify.track_id}` : "#"}
            target="_blank"
            rel="noreferrer"
            className="group relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-white/15 shadow-md transition-transform hover:scale-105"
          >
            <img
              src={spotify.album_art_url}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <FiExternalLink size={16} />
            </div>
          </a>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-zinc-100 truncate">{spotify.song}</p>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
              isLive
                ? "bg-pink-500/10 border-pink-500/30 text-pink-300 animate-pulse"
                : "bg-white/5 border-white/10 text-zinc-400"
            }`}>
              {isLive ? "Listening on Spotify" : "Recently Played"}
            </span>
          </div>
          <p className="text-xs text-zinc-400 truncate mt-0.5">by {spotify.artist}</p>

          {isLive && spotifyProgress !== null && spotifyTimes && (
            <div className="space-y-1 pt-2">
              <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-pink-400 to-rose-400 transition-none shadow-[0_0_8px_rgba(244,114,182,0.6)]"
                  style={{ width: `${spotifyProgress * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>{spotifyTimes.elapsed}</span>
                <span>{spotifyTimes.total}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {lines && lines.length > 0 && (
        <div className="pt-2 border-t border-white/10 space-y-2">
          <div
            ref={containerRef}
            onScroll={handleContainerScroll}
            className="relative max-h-64 sm:max-h-72 w-full overflow-y-auto pr-1 space-y-2 select-none scroll-smooth"
          >
            {lines.map((line, idx) => {
              const isCurrent = idx === currentIdx;
              return (
                <div
                  key={`${line.time}-${idx}`}
                  ref={isCurrent ? activeLineRef : null}
                  onClick={() => {
                    setCurrentIdx(idx);
                    setIsUserInteracting(true);
                    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
                    scrollTimeoutRef.current = setTimeout(() => setIsUserInteracting(false), 4000);
                  }}
                  className={`transition-all duration-300 rounded-xl px-4 py-2 text-center text-xs sm:text-sm cursor-pointer ${
                    isCurrent
                      ? "font-extrabold text-pink-400 bg-pink-500/20 border border-pink-500/40 scale-[1.02] drop-shadow-[0_0_16px_rgba(244,114,182,1)] shadow-[0_0_20px_rgba(244,114,182,0.3)]"
                      : "font-normal text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]"
                  }`}
                >
                  {line.text}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
