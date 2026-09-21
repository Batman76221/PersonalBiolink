"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { FiMusic } from "react-icons/fi";

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

type Props = {
  trackId?: string | null;
  track?: string | null;
  artist?: string | null;
  albumArt?: string | null;
  timestamps?: { start: number; end: number } | null;
  isPlaying?: boolean;
};

export default function SpotifyLyrics({
  trackId = "1K5OXYZMz90JWaPrIAb3Jx",
  track = "I'm tired of this",
  artist = "Rebzyyx; Rezlaine",
  albumArt = "https://i.scdn.co/image/ab67616d0000b273533d022da9781fbe94f2cd08",
  timestamps,
  isPlaying = true,
}: Props) {
  const activeTrack = track || "I'm tired of this";
  const activeArtist = artist || "Rebzyyx; Rezlaine";

  const [lines, setLines] = useState<LyricLine[] | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const lastTrackRef = useRef<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const fetchLyrics = useCallback(async (id: string | null | undefined, t: string, a: string) => {
    try {
      const params = new URLSearchParams({ track: t, artist: a });
      if (id) params.set("trackId", id);
      const res = await fetch(`/api/lyrics?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (data.syncedLyrics) {
        setLines(parseLrc(data.syncedLyrics));
      }
    } catch {}
  }, []);

  useEffect(() => {
    const trackKey = trackId ?? `${activeTrack}::${activeArtist}`;
    if (lastTrackRef.current === trackKey) return;
    lastTrackRef.current = trackKey;
    fetchLyrics(trackId, activeTrack, activeArtist);
  }, [trackId, activeTrack, activeArtist, fetchLyrics]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (!lines || lines.length === 0) return;

    if (!timestamps || !isPlaying) {
      return;
    }

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
    intervalRef.current = setInterval(sync, 60);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [lines, timestamps, isPlaying]);

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

  if (!lines || lines.length === 0) return null;

  return (
    <section className="fade-in-up delay-2 w-full glass-card overflow-hidden p-5 border border-white/10 hover:border-pink-500/30 transition-all shadow-xl">
      <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {albumArt && (
            <img
              src={albumArt}
              alt=""
              className="h-8 w-8 rounded-md object-cover border border-white/10 shadow-sm"
            />
          )}
          <div className="min-w-0">
            <p className="text-xs font-semibold text-zinc-100 truncate">{activeTrack}</p>
            <p className="text-[11px] text-zinc-400 truncate">{activeArtist}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-300 text-[11px] font-medium shadow-[0_0_12px_rgba(244,114,182,0.25)]">
          <FiMusic className="animate-pulse text-pink-400" size={12} />
          <span>Full Lyrics</span>
        </div>
      </div>

      <div
        ref={containerRef}
        onScroll={handleContainerScroll}
        className="relative max-h-72 sm:max-h-80 w-full overflow-y-auto pr-1 space-y-2 select-none scroll-smooth"
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
    </section>
  );
}
