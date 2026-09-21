# Terrified --- Personal Bio Link

A modern, animated personal bio/portfolio website built with
**Next.js**, **React**, **TypeScript**, and **Tailwind CSS**.

The site is designed as a compact personal profile with social links,
project/brand cards, technology badges, Discord presence, Spotify
activity, lyrics, GitHub-style profile information, and an animated
WebGL background.

------------------------------------------------------------------------

## Features

### Personal profile

The homepage contains a central personal profile section for:

-   Display name and introduction
-   Social links
-   GitHub/source links
-   Personal project and brand cards
-   Technology/tool list
-   Discord presence
-   Spotify currently-playing information
-   Spotify lyrics
-   GitHub-style README content
-   Footer information

The current project cards include:

-   **Purify** --- Discord moderation bot
-   **Wavydevelopment.xyz** --- development team

Project cards are responsive and display side-by-side on larger screens
while stacking on smaller screens.

### Discord presence

The project integrates with **Lanyard** to display Discord activity.

The presence system can show:

-   Discord username/global display name
-   Avatar
-   Discord status
-   Avatar decorations
-   Nameplates
-   Mobile/Desktop/Web activity
-   Current game/activity
-   Last known game
-   Current Spotify track
-   Last known Spotify track
-   Spotify album artwork
-   Track progress
-   Elapsed/total playback time
-   Last active information

Presence data is requested through the application's API route instead
of directly from the browser.

The client currently polls the application's presence endpoint every **2
seconds**.

### Spotify integration

Spotify activity is connected to the Discord presence system.

When a Spotify track is available, the site can display:

-   Song title
-   Artist
-   Album artwork
-   Spotify track link
-   Playback progress
-   Elapsed time
-   Total duration
-   Lyrics

The Spotify UI is designed to update without requiring a complete page
reload.

### Lyrics API

The project contains a dedicated API route:

``` text
/api/lyrics
```

Lyrics are handled server-side through the application rather than
requiring the browser to communicate directly with a lyrics provider.

### Animated background

The project contains several background components:

``` text
components/background/
├── GradientMesh.tsx
├── ShaderBackground.tsx
├── Stars.tsx
└── gradient.js
```

The WebGL shader background supports configurable:

-   Color
-   Animation speed
-   Resolution
-   Rendering iterations
-   Reduced-motion handling
-   Visibility-based animation pausing

The shader automatically reduces rendering work on lower-performance
devices.

### Smooth scrolling

The project includes a `SmoothScroll` component using **Lenis** for
smooth page movement.

### Responsive design

The site is designed to work across:

-   Desktop
-   Laptop
-   Tablet
-   Mobile

Tailwind responsive utilities are used throughout the application.

### GitHub-style README

The page includes a GitHub-inspired profile section containing:

-   Profile information
-   Skills
-   Tool badges
-   Contact information
-   Portfolio links
-   Language charts
-   Repository statistics

The README content is rendered through:

``` text
components/GithubReadme.tsx
```

------------------------------------------------------------------------

# Tech Stack

## Core

  Technology      Purpose
  --------------- -----------------------
  Next.js         Application framework
  React           UI components
  TypeScript      Type-safe development
  Tailwind CSS    Styling
  React Icons     Icons
  Framer Motion   UI animation
  Lenis           Smooth scrolling

## Backend / APIs

  Technology           Purpose
  -------------------- ----------------------------
  Next.js API Routes   Server-side endpoints
  Lanyard              Discord presence
  Redis / ioredis      Presence caching
  In-memory fallback   Local development fallback

## Visuals

  Technology     Purpose
  -------------- -------------------------------
  WebGL2         Animated shader background
  Canvas         Background and star rendering
  Tailwind CSS   Layout and effects

------------------------------------------------------------------------

# Requirements

Before running the project, install:

-   **Node.js 18.17 or newer**
-   npm, pnpm, or yarn
-   Git (recommended)

Check your Node.js installation:

``` bash
node --version
```

Check npm:

``` bash
npm --version
```

------------------------------------------------------------------------

# Installation

Clone or extract the project.

Then open a terminal inside the project directory.

Install dependencies:

``` bash
npm install
```

------------------------------------------------------------------------

# Development

Start the development server:

``` bash
npm run dev
```

The site will normally be available at:

``` text
http://localhost:3000
```

Next.js will automatically reload the page when source files are
changed.

------------------------------------------------------------------------

# Production Build

Create a production build:

``` bash
npm run build
```

Then start the production server:

``` bash
npm run start
```

The production site will normally be available at:

``` text
http://localhost:3000
```

------------------------------------------------------------------------

# Available Scripts

  Command           Description
  ----------------- ---------------------------------------
  `npm run dev`     Starts the Next.js development server
  `npm run build`   Creates a production build
  `npm run start`   Starts the production server
  `npm run lint`    Runs ESLint

------------------------------------------------------------------------

# Project Structure

``` text
.
├── app/
│   ├── api/
│   │   ├── lyrics/
│   │   │   └── route.ts
│   │   └── presence/
│   │       └── [userId]/
│   │           └── route.ts
│   │
│   ├── components/
│   │   ├── CurrentLyric.tsx
│   │   ├── LanyardStatus.tsx
│   │   ├── MusicSection.tsx
│   │   ├── PresenceWithLyrics.tsx
│   │   ├── SpotifyLyrics.tsx
│   │   └── TechIcon.tsx
│   │
│   ├── data/
│   │   ├── links.ts
│   │   └── tech.ts
│   │
│   ├── lib/
│   │   ├── presence/
│   │   │   ├── constants.ts
│   │   │   ├── service.ts
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   └── redis.ts
│   │
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── page.tsx
│
├── components/
│   ├── background/
│   │   ├── GradientMesh.tsx
│   │   ├── ShaderBackground.tsx
│   │   ├── Stars.tsx
│   │   └── gradient.js
│   ├── GithubReadme.tsx
│   ├── LanyardStatus.tsx
│   ├── SmoothScroll.tsx
│   └── SpotifyLyrics.tsx
│
├── lib/
│   ├── session.ts
│   └── utils.ts
│
├── public/
│
├── next.config.mjs
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vercel.json
```

------------------------------------------------------------------------

# Editing the Homepage

The main homepage is:

``` text
app/page.tsx
```

This is where the main layout is assembled.

Typical sections include:

``` text
Profile
↓
Discord presence
↓
Project / brand cards
↓
Technology marquee
↓
README
↓
Footer
```

------------------------------------------------------------------------

# Adding or Editing Brand Cards

Brand/project cards are currently defined directly in:

``` text
app/page.tsx
```

A card follows this general structure:

``` tsx
<a
  href="https://example.com"
  target="_blank"
  rel="noreferrer"
  className="group relative flex min-h-[160px] flex-col ..."
>
  ...
</a>
```

To add another brand, duplicate an existing card and change:

-   `href`
-   Logo URL
-   `alt`
-   Brand name
-   Date
-   Description

For example:

``` tsx
<a
  href="https://example.com"
  target="_blank"
  rel="noreferrer"
  className="group relative flex min-h-[160px] flex-col ..."
>
  <img
    src="https://example.com/logo.png"
    alt="Example"
  />

  <p>Example</p>
  <p>Jan 2026 - present</p>
  <p>Example project description.</p>
</a>
```

------------------------------------------------------------------------

# Current Brands

## Purify

Website:

``` text
https://exhale.best
```

Description:

``` text
The all-in-one Discord moderation bot for your server.
```

## Wavydevelopment.xyz

Website:

``` text
https://Wavydevelopment.xyz
```

Logo:

``` text
https://Wavydevelopment.xyz/terrified.png
```

Description:

``` text
View my development team.
```

------------------------------------------------------------------------

# Editing Social Links

Social links are stored in:

``` text
app/data/links.ts
```

The current links include:

-   GitHub
-   Discord
-   Source repository

Add another link by adding an object to the `links` array:

``` ts
{
  label: "website",
  href: "https://example.com",
  icon: SomeIcon
}
```

Icons are supplied by `react-icons`.

------------------------------------------------------------------------

# Editing Technology Badges

Technology items are stored in:

``` text
app/data/tech.ts
```

The current list includes:

-   Docker
-   GitHub
-   Vercel
-   Cloudflare
-   Python
-   FastAPI
-   Flask

To add another technology:

1.  Import its icon from `react-icons`.
2.  Add it to the `tech` array.
3.  Add it to `techIcons`.

Example:

``` ts
import { SiTypescript } from "react-icons/si";
```

Then:

``` ts
{ label: "TypeScript", href: "https://www.typescriptlang.org" }
```

And:

``` ts
TypeScript: SiTypescript,
```

------------------------------------------------------------------------

# Discord Presence Configuration

Discord presence constants are located at:

``` text
app/lib/presence/constants.ts
```

The Lanyard API base is:

``` text
https://api.lanyard.rest/v1
```

The current client polling interval is:

``` ts
export const CLIENT_POLL_INTERVAL = 2_000;
```

That means the browser checks the application's presence endpoint
approximately every two seconds.

If you want to reduce requests, increase the value.

For example:

``` ts
export const CLIENT_POLL_INTERVAL = 5_000;
```

would poll every five seconds.

------------------------------------------------------------------------

# Discord User ID

The presence system receives a Discord user ID.

The profile's Discord link currently uses:

``` text
1447292903654428733
```

If you are adapting this project for another Discord account, update the
user ID where the presence component is rendered.

Do not use a username where a Discord user ID is required.

------------------------------------------------------------------------

# Redis

The application supports Redis through the `REDIS_URL` environment
variable.

Example:

``` env
REDIS_URL=redis://localhost:6379
```

For a hosted Redis provider, use the connection URL supplied by that
provider.

The project uses:

``` text
ioredis
```

for the Redis connection.

------------------------------------------------------------------------

# Redis Fallback

Redis is optional for local development.

If `REDIS_URL` is not configured, the project automatically falls back
to an in-memory store.

This means the site can still run without Redis.

However, the in-memory fallback is not persistent.

Data stored in memory is lost when the server restarts.

For production deployments where presence history/cache persistence
matters, configure Redis.

------------------------------------------------------------------------

# Presence Cache

The project stores several presence-related values.

The Redis key structure is:

``` text
presence:{userId}:current
presence:{userId}:spotify
presence:{userId}:game
presence:{userId}:status
```

Current presence has a short TTL, while historical activity can be
retained longer.

The constants are configured in:

``` text
app/lib/presence/constants.ts
```

Current values:

``` text
CURRENT_TTL = 60 seconds
LAST_TTL    = 7 days
```

------------------------------------------------------------------------

# API Routes

## Presence

``` text
/api/presence/[userId]
```

Example:

``` text
/api/presence/1447292903654428733
```

This endpoint provides the current presence and cached previous
activity.

The route handles communication with the Lanyard service and Redis/cache
layer.

## Lyrics

``` text
/api/lyrics
```

This endpoint is used by the Spotify lyrics components.

------------------------------------------------------------------------

# Background Animation

The project includes a WebGL2 shader background.

Main file:

``` text
components/background/ShaderBackground.tsx
```

The shader accepts:

``` ts
interface ShaderBackgroundProps {
  color?: [number, number, number];
  speedMultiplier?: number;
}
```

Example:

``` tsx
<ShaderBackground
  color={[1.0, 0.38, 0.72]}
  speedMultiplier={1.0}
/>
```

The color is represented as RGB-style floating-point values from `0` to
`1`.

For example:

``` text
[1.0, 0.38, 0.72]
```

produces a pink/magenta tone.

------------------------------------------------------------------------

# Changing Background Speed

The background speed is controlled by:

``` tsx
speedMultiplier
```

Example:

``` tsx
speedMultiplier={0.5}
```

makes the animation slower.

``` tsx
speedMultiplier={1.0}
```

uses the normal speed.

``` tsx
speedMultiplier={2.0}
```

makes the animation approximately twice as fast.

The shader also pauses when the browser tab is hidden.

------------------------------------------------------------------------

# Reduced Motion

The background checks the user's:

``` text
prefers-reduced-motion
```

setting.

When reduced motion is enabled, the animation is stopped and a static
frame is rendered.

This helps users who prefer less animation and reduces unnecessary GPU
usage.

------------------------------------------------------------------------

# Tailwind CSS

Styling is primarily done with Tailwind CSS utility classes.

Important files:

``` text
app/globals.css
tailwind.config.js
```

Most components use utility classes directly rather than large
standalone CSS files.

------------------------------------------------------------------------

# Customizing the Pink Theme

The current visual design uses dark surfaces with pink accents.

Common accent classes include:

``` text
text-pink-200
text-pink-300
border-pink-500
```

Backgrounds commonly use translucent black/white layers such as:

``` text
bg-black/20
bg-white/[0.03]
```

Cards use subtle borders:

``` text
border-white/10
```

This gives the site its glass/dark appearance.

------------------------------------------------------------------------

# Images

External images are used throughout the site.

For example:

``` text
https://Wavydevelopment.xyz/terrified.png
```

and Discord CDN assets.

If you use remote images, make sure the remote server allows them to be
loaded by browsers.

Next.js image optimization configuration is located in:

``` text
next.config.mjs
```

The current configuration explicitly allows Discord CDN images.

Regular HTML `<img>` elements are also used throughout the project.

------------------------------------------------------------------------

# Deployment on Vercel

The project includes:

``` text
vercel.json
```

with:

``` json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

## Deploy

1.  Push the project to GitHub.
2.  Open Vercel.
3.  Import the repository.
4.  Select the Next.js project.
5.  Add environment variables if needed.
6.  Deploy.

If using Redis, add:

``` text
REDIS_URL
```

to the Vercel project's environment variables.

------------------------------------------------------------------------

# Local Environment Variables

Create:

``` text
.env.local
```

when environment configuration is needed.

Example:

``` env
REDIS_URL=redis://localhost:6379
```

Do not commit `.env.local` to Git.

The repository already contains a `.gitignore` file intended to prevent
local environment files and other generated files from being committed.

------------------------------------------------------------------------

# Performance

The project includes several performance considerations:

-   WebGL rendering uses a fixed internal resolution.
-   Mobile devices use fewer shader iterations.
-   WebGL animation pauses when the page is hidden.
-   Reduced-motion preferences are respected.
-   Images use lazy loading where appropriate.
-   Presence data is cached.
-   The background animation adapts its rendering workload based on
    observed FPS.
-   The UI uses lightweight Tailwind utilities instead of large CSS
    frameworks.

------------------------------------------------------------------------

# Troubleshooting

## `npm install` fails

Make sure Node.js is new enough:

``` bash
node --version
```

Use Node.js 18.17+.

Then remove dependencies and reinstall:

``` bash
rm -rf node_modules
npm install
```

On Windows PowerShell:

``` powershell
Remove-Item -Recurse -Force node_modules
npm install
```

------------------------------------------------------------------------

## The development server does not start

Try:

``` bash
npm run dev
```

If the port is already in use, Next.js may automatically select another
port.

You can also stop the process currently using port 3000.

------------------------------------------------------------------------

## Discord presence is not showing

Check:

1.  The Discord user ID is correct.
2.  The Discord account is currently visible to Lanyard.
3.  The API route is responding.
4.  The browser can reach the application's `/api/presence/[userId]`
    endpoint.
5.  Check the server console for API errors.

Try opening:

``` text
/api/presence/YOUR_DISCORD_USER_ID
```

directly in the browser.

------------------------------------------------------------------------

## Presence disappears after restarting

If you are running without Redis, the application uses an in-memory
fallback.

Restarting the server clears that memory.

Configure:

``` env
REDIS_URL=...
```

to use persistent Redis-backed caching.

------------------------------------------------------------------------

## Spotify information is not updating

Check Discord first.

Spotify activity is received through Discord/Lanyard presence data. The
application does not directly control Discord's Spotify presence.

Make sure:

-   Spotify is connected to Discord.
-   Activity sharing is enabled.
-   The account is currently listening.
-   Lanyard can see the account's presence.

------------------------------------------------------------------------

## Background is not visible

Check browser WebGL support.

The animated shader requires WebGL2.

Try another modern browser if WebGL2 is unavailable.

The background can also appear less visible because of the page's
overlay opacity and styling.

------------------------------------------------------------------------

## Build errors

Run:

``` bash
npm run build
```

instead of relying only on the development server.

TypeScript and Next.js errors that are easy to miss during development
are usually surfaced during the production build.

------------------------------------------------------------------------

# Updating the Site

A typical workflow is:

``` bash
git pull
npm install
npm run dev
```

Make your changes, then test:

``` bash
npm run lint
npm run build
```

If everything works:

``` bash
git add .
git commit -m "Update website"
git push
```

Vercel can then automatically deploy the new commit if the repository is
connected.

------------------------------------------------------------------------

# Important Files

  File                                           Purpose
  ---------------------------------------------- ---------------------------------
  `app/page.tsx`                                 Main homepage
  `app/globals.css`                              Global styling
  `app/layout.tsx`                               Root layout and metadata
  `app/data/links.ts`                            Social links
  `app/data/tech.ts`                             Technology list
  `app/lib/presence/service.ts`                  Presence fetching/caching
  `app/lib/presence/constants.ts`                Presence configuration
  `app/lib/presence/types.ts`                    Presence TypeScript types
  `app/lib/presence/utils.ts`                    Presence helper functions
  `app/lib/redis.ts`                             Redis/in-memory storage
  `app/api/presence/[userId]/route.ts`           Presence API
  `app/api/lyrics/route.ts`                      Lyrics API
  `components/GithubReadme.tsx`                  GitHub-style profile section
  `components/background/ShaderBackground.tsx`   WebGL background
  `components/SmoothScroll.tsx`                  Smooth scrolling
  `components/SpotifyLyrics.tsx`                 Spotify lyrics UI
  `next.config.mjs`                              Next.js configuration
  `vercel.json`                                  Vercel deployment configuration
  `package.json`                                 Dependencies and scripts

------------------------------------------------------------------------

# Customization Checklist

Before publishing your own version, review:

-   [ ] Display name
-   [ ] Profile description
-   [ ] GitHub URL
-   [ ] Discord user ID
-   [ ] Discord username
-   [ ] Social links
-   [ ] Project cards
-   [ ] Project logos
-   [ ] Project descriptions
-   [ ] Technology list
-   [ ] README/profile information
-   [ ] Background color
-   [ ] Background speed
-   [ ] Footer text
-   [ ] Environment variables
-   [ ] Redis configuration
-   [ ] Metadata/title
-   [ ] Favicon
-   [ ] External image URLs

------------------------------------------------------------------------

# Security Notes

Do not commit secrets to the repository.

Never place private credentials directly inside:

``` text
app/page.tsx
app/components/
components/
public/
```

Use environment variables for private configuration.

For example:

``` env
REDIS_URL=your-private-redis-url
```

and access it server-side through:

``` ts
process.env.REDIS_URL
```

If you add an API key or secret, make sure it is not exposed through a
client component or `NEXT_PUBLIC_*` environment variable unless it is
intentionally public.

------------------------------------------------------------------------

# License

No license is currently specified in the project.

If you plan to publish or redistribute the source code, add a license
such as MIT, Apache-2.0, or another license appropriate for your
project.

------------------------------------------------------------------------

# Credits

Built with:

-   Next.js
-   React
-   TypeScript
-   Tailwind CSS
-   Lanyard
-   Redis / ioredis
-   Lenis
-   Framer Motion
-   React Icons
-   WebGL2

Personal site/project maintained by **Terrified**.

------------------------------------------------------------------------

## Quick Start

For the shortest setup:

``` bash
npm install
npm run dev
```

Then open:

``` text
http://localhost:3000
```

For production:

``` bash
npm run build
npm run start
```

For Vercel, import the repository and configure `REDIS_URL` if
Redis-backed presence caching is required.
