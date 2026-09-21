export interface DiscordUser {
  id: string;
  username: string;
  avatar: string | null;
  discriminator: string;
  public_flags?: number;
  flags?: number;
  bot?: boolean;
  avatar_decoration_data?: {
    asset: string;
    sku_id: string;
  } | null;
  collectibles?: {
    nameplate?: {
      asset: string;
      label: string;
      sku_id: string;
    } | null;
  } | null;
  global_name?: string | null;
}

export interface Activity {
  type: number;
  state?: string;
  name: string;
  id: string;
  created_at: number;
  details?: string;
  timestamps?: {
    start?: number;
    end?: number;
  };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  sync_id?: string;
  session_id?: string;
  party?: {
    id?: string;
  };
  flags?: number;
  application_id?: string;
}

export interface SpotifyData {
  track_id: string;
  timestamps: {
    start: number;
    end: number;
  };
  song: string;
  artist: string;
  album_art_url: string;
  album: string;
}

export interface LanyardData {
  spotify: SpotifyData | null;
  listening_to_spotify: boolean;
  kv: Record<string, string>;
  discord_user: DiscordUser;
  discord_status: "online" | "idle" | "dnd" | "offline";
  activities: Activity[];
  active_on_discord_web: boolean;
  active_on_discord_desktop: boolean;
  active_on_discord_mobile: boolean;
}

export interface StoredSpotify {
  song: string;
  artist: string;
  album_art_url: string;
  track_id: string;
  seenAt: number;
}

export interface StoredGame {
  name: string;
  details?: string;
  state?: string;
  seenAt: number;
}

export interface StoredStatus {
  status: string;
  seenAt: number;
}

export interface PresenceResponse {
  current: LanyardData | null;
  lastSpotify: StoredSpotify | null;
  lastGame: StoredGame | null;
  lastStatus: StoredStatus | null;
}
