"use client";


import { FiChevronDown } from "react-icons/fi";
import ShaderBackground from "@/components/background/ShaderBackground";
import PresenceWithLyrics from "@/app/components/PresenceWithLyrics";
import TechIcon from "@/app/components/TechIcon";
import GithubReadme from "@/components/GithubReadme";
import { links } from "@/app/data/links";
import { tech } from "@/app/data/tech";

export default function Home() {
  const scrollToReadme = () => {
    document.getElementById("readme")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <ShaderBackground color={[1.0, 0.38, 0.72]} speedMultiplier={1.0} />

      <main className="relative z-10 w-full">
        <section className="relative flex min-h-[100svh] w-full items-center justify-center px-4 py-16 sm:px-6">
          <div className="flex w-full max-w-[540px] flex-col items-center gap-7">
            <section className="fade-in-up flex flex-col items-center text-center">
              <h1 className="heading-font avatar-gradient-text text-5xl font-extrabold tracking-tight sm:text-6xl drop-shadow-[0_0_24px_rgba(244,114,182,0.5)]">
                Terrified
              </h1>
              <p className="mt-3.5 max-w-sm text-sm leading-relaxed text-zinc-400 font-normal">
                passionate developer creating products for everyone.
              </p>
              <p className="heading-font source-gradient-text text-sm font-extrabold tracking-tight drop-shadow-[0_0_24px_rgba(244,114,182,0.5)]">
                you can download this source.
              </p>


              <div className="mt-5 flex items-center gap-3">
                {links.map((item) => {
                  const Icon = item.icon;
                  const external = item.href.startsWith("http");
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      aria-label={item.label}
                      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-zinc-400 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-pink-500/40 hover:bg-pink-500/10 hover:text-pink-300 hover:shadow-[0_0_20px_rgba(244,114,182,0.3)]"
                    >
                      <Icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            </section>

            <PresenceWithLyrics />

            <section className="fade-in-up delay-2 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
              <a
                href="https://exhale.best"
                target="_blank"
                rel="noreferrer"
                className="group relative flex min-h-[160px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-pink-500/30 hover:bg-white/[0.03] hover:shadow-[0_8px_30px_rgba(244,114,182,0.10)]"
              >
                <div className="flex items-start gap-3">
                  <span className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/50 p-1.5 shadow-inner transition-transform duration-300 group-hover:scale-105">
                    <img
                      src="https://avatars.githubusercontent.com/u/242625464?s=400&u=c61a1097bed4030b512c0e3ef649ffe3b2a0a689&v=4"
                      alt="Purify"
                      className="h-full w-full rounded-md object-contain"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-zinc-100 transition-colors group-hover:text-pink-200">
                          Purify
                        </p>
                        <p className="mt-0.5 text-[10px] text-zinc-500">
                          Aug 2026 - present
                        </p>
                      </div>

                      <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-zinc-600 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-pink-300"
                        aria-hidden="true"
                      >
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-xs leading-relaxed text-zinc-500">
                  The all-in-one Discord moderation bot for your server.
                </p>
              </a>

              <a
                href="https://Wavydevelopment.xyz"
                target="_blank"
                rel="noreferrer"
                className="group relative flex min-h-[160px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-pink-500/30 hover:bg-white/[0.03] hover:shadow-[0_8px_30px_rgba(244,114,182,0.10)]"
              >
                <div className="flex items-start gap-3">
                  <span className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/50 p-1.5 shadow-inner transition-transform duration-300 group-hover:scale-105">
                    <img
                      src="https://Wavydevelopment.xyz/terrified.png"
                      alt="Wavydevelopment.xyz"
                      className="h-full w-full rounded-md object-contain"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-zinc-100 transition-colors group-hover:text-pink-200">
                          Wavydevelopment.xyz
                        </p>
                        <p className="mt-0.5 text-[10px] text-zinc-500">
                          Aug 2026 - present
                        </p>
                      </div>

                      <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-zinc-600 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-pink-300"
                        aria-hidden="true"
                      >
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-xs leading-relaxed text-zinc-500">
                  View my development team.
                </p>
              </a>
            </section>

            <section className="fade-in-up delay-3 w-full marquee-wrap py-1">
              <div className="marquee-track">
                {[...tech, ...tech, ...tech].map((tool, index) => (
                  <a
                    key={`${tool.label}-${index}`}
                    href={tool.href}
                    target="_blank"
                    rel="noreferrer"
                    className="glass-pill gap-1.5 text-[11px] font-medium lowercase text-zinc-400 hover:text-pink-200 transition-all"
                  >
                    <TechIcon name={tool.label} />
                    {tool.label}
                  </a>
                ))}
              </div>
            </section>
          </div>

          <button
            type="button"
            onClick={scrollToReadme}
            aria-label="Scroll down to README"
            className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-zinc-500 transition-colors hover:text-pink-300"
          >
            <span className="text-[10px] uppercase tracking-[0.3em]">scroll</span>
            <FiChevronDown className="h-5 w-5 animate-bounce" aria-hidden="true" />
          </button>
        </section >

        <section id="readme" className="w-full scroll-mt-6 px-4 pb-20 sm:px-6">
          <div className="mx-auto w-full max-w-[540px]">
            <GithubReadme />
          </div>
        </section>

        <footer className="pb-8 text-center">
          <p
            className="text-[11px] text-zinc-500"
            style={{ fontFamily: "var(--font-ibm-plex-mono), monospace" }}
          >
            &copy; {new Date().getFullYear()} Terrified &middot;{" "}
            <a
              href="https://github.com/batman76221"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 hover:text-pink-300 transition-colors"
            >
              github
            </a>
          </p>
        </footer>
      </main >
    </>
  );
}
