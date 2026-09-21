"use client";

import { useEffect, useState } from "react";
import type { StoredSpotify } from "@/app/lib/presence/types";

type LyricLine = { time: number; text: string };

function parseLrc(lrc: string): LyricLine[] {
  const lines: LyricLine[] = [];

  for (const line of lrc.split("\n")) {
    const match = line.match(/^\[(\d+):(\d+)\.(\d+)\]\s*(.*)/);
    if (!match) continue;

    const minutes = parseInt(match[1], 10);
    const seconds = parseInt(match[2], 10);
    const ms = parseInt(match[3].padEnd(3, "0").slice(0, 3), 10);
    const text = match[4].trim();

    if (text) {
      lines.push({
        time: minutes * 60000 + seconds * 1000 + ms,
        text,
      });
    }
  }

  return lines.sort((a, b) => a.time - b.time);
}

interface CurrentLyricProps {
  spotify: StoredSpotify | null;
  isLive: boolean;
  timestamps: { start: number; end: number } | null;
}

export default function CurrentLyric({ spotify, isLive, timestamps }: CurrentLyricProps) {
  const [lines, setLines] = useState<LyricLine[]>([]);
  const [currentLyric, setCurrentLyric] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLines([]);
    setCurrentLyric(null);

    if (!spotify) return;

    const fetchLyrics = async () => {
      try {
        const params = new URLSearchParams({
          track: spotify.song,
          artist: spotify.artist,
        });

        if (spotify.track_id) {
          params.set("trackId", spotify.track_id);
        }

        const res = await fetch(`/api/lyrics?${params.toString()}`, { cache: "no-store" });
        if (!res.ok) throw new Error("lyrics request failed");

        const data = await res.json();
        if (!cancelled) {
          setLines(data.syncedLyrics ? parseLrc(data.syncedLyrics) : []);
        }
      } catch {
        if (!cancelled) setLines([]);
      }
    };

    fetchLyrics();

    return () => {
      cancelled = true;
    };
  }, [spotify?.track_id, spotify?.song, spotify?.artist]);

  useEffect(() => {
    if (!isLive || !timestamps || lines.length === 0) {
      setCurrentLyric(null);
      return;
    }

    const sync = () => {
      const now = Date.now();
      const elapsed = now - timestamps.start;
      const duration = timestamps.end - timestamps.start;

      if (elapsed < 0 || (duration > 0 && now >= timestamps.end)) {
        setCurrentLyric(null);
        return;
      }

      let low = 0;
      let high = lines.length - 1;
      let index = -1;

      while (low <= high) {
        const middle = (low + high) >> 1;
        if (lines[middle].time <= elapsed) {
          index = middle;
          low = middle + 1;
        } else {
          high = middle - 1;
        }
      }

      setCurrentLyric(index >= 0 ? lines[index].text : null);
    };

    sync();
    const interval = setInterval(sync, 250);

    return () => clearInterval(interval);
  }, [lines, isLive, timestamps]);

  if (!currentLyric) return null;

  return (
    <div className="fade-in-up delay-1 w-full px-4 text-center" aria-live="polite">
      <p className="text-sm sm:text-base font-semibold text-pink-300 drop-shadow-[0_0_12px_rgba(244,114,182,0.35)]">
        {currentLyric}
      </p>
    </div>
  );
}
