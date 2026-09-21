import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const track = searchParams.get("track");
  const artist = searchParams.get("artist");

  if (!track || !artist) {
    return NextResponse.json({ error: "Missing track or artist parameter" }, { status: 400 });
  }

  const cleanTrack = track.replace(/\s*[\(\[][^()\[\]]*(feat|ft|remix|version)[^()\[\]]*[\)\]]/gi, "").trim();
  const primaryArtist = artist.split(/[,;&]|\s+feat\.?|\s+ft\.?/i)[0].trim();

  const attempts = [
    { t: track, a: artist },
    { t: cleanTrack, a: primaryArtist },
    { t: track, a: primaryArtist },
  ];

  for (const attempt of attempts) {
    try {
      const url = new URL("https://lrclib.net/api/get");
      url.searchParams.set("track_name", attempt.t);
      url.searchParams.set("artist_name", attempt.a);

      const res = await fetch(url.toString(), {
        headers: {
          "User-Agent": "PersonalBiolink/1.0",
        },
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.syncedLyrics || data.plainLyrics) {
          return NextResponse.json({
            syncedLyrics: data.syncedLyrics || null,
            plainLyrics: data.plainLyrics || null,
          });
        }
      }
    } catch {}
  }

  return NextResponse.json({ syncedLyrics: null, plainLyrics: null });
}
