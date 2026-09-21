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
    if (process.env.NODE_ENV === "production" && isDifferentOrigin) {
      return NextResponse.json(
        { error: "Direct access not allowed" },
        { status: 403 }
      );
    }
  }

  const { userId } = await params;

  const cached = await getCachedPresenceData(redis, userId);
  let current = cached.current;
  let lastSpotify = cached.lastSpotify;
  let lastGame = cached.lastGame;
  let lastStatus = cached.lastStatus;

  try {
    const fresh = await fetchLanyardData(userId);

    if (fresh) {
      current = fresh;
      const stored = await storePresenceData(redis, userId, fresh);
      if (stored.lastSpotify) lastSpotify = stored.lastSpotify;
      if (stored.lastGame) lastGame = stored.lastGame;
      if (stored.lastStatus) lastStatus = stored.lastStatus;
    }
  } catch (error) {
    console.error("Error fetching presence:", error);
  }

  if (!current) {
    return NextResponse.json({ error: "no data" }, { status: 502 });
  }

  const body: PresenceResponse = { current, lastSpotify, lastGame, lastStatus };
  return NextResponse.json(body);
}
