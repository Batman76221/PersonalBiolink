"use client";

import { useCallback, useState } from "react";
import CurrentLyric from "@/app/components/CurrentLyric";
import LanyardStatus from "@/app/components/LanyardStatus";
import type { StoredSpotify } from "@/app/lib/presence/types";

type Timestamps = { start: number; end: number } | null;

export default function PresenceWithLyrics() {
  const [spotify, setSpotify] = useState<StoredSpotify | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [timestamps, setTimestamps] = useState<Timestamps>(null);

  const handleSpotifyChange = useCallback(
    (nextSpotify: StoredSpotify | null, nextIsLive: boolean, nextTimestamps: Timestamps) => {
      setSpotify((previous) => {
        if (
          previous?.track_id === nextSpotify?.track_id &&
          previous?.song === nextSpotify?.song &&
          previous?.artist === nextSpotify?.artist &&
          previous?.album_art_url === nextSpotify?.album_art_url
        ) {
          return previous;
        }
        return nextSpotify;
      });

      setIsLive((previous) => (previous === nextIsLive ? previous : nextIsLive));

      setTimestamps((previous) => {
        if (
          previous?.start === nextTimestamps?.start &&
          previous?.end === nextTimestamps?.end
        ) {
          return previous;
        }
        return nextTimestamps;
      });
    },
    []
  );

  return (
    <div className="w-full">
      <CurrentLyric
        spotify={spotify}
        isLive={isLive}
        timestamps={timestamps}
      />
      <section className="fade-in-up delay-1 w-full mt-3">
        <LanyardStatus
          userId="1447292903654428733"
          onSpotifyChange={handleSpotifyChange}
        />
      </section>
    </div>
  );
}
