"use client";

import React from "react";
import { FiEdit2, FiCopy, FiChevronUp, FiChevronDown } from "react-icons/fi";

export default function GithubReadme() {
  return (
    <div className="w-full rounded-xl border border-[#30363d] bg-[#0d1117] text-[#e6edf3] p-5 sm:p-7 shadow-2xl font-sans text-left space-y-4 select-text">
      <div className="flex items-center justify-between text-xs text-[#7d8590]">
        <span className="font-mono text-[11px] text-[#8b949e]">Batman76221 / README.md</span>
        <a
          href="https://github.com/Batman76221/Batman76221/edit/main/README.md"
          target="_blank"
          rel="noreferrer"
          className="text-[#7d8590] hover:text-[#58a6ff] transition-colors"
          aria-label="Edit README"
        >
          <FiEdit2 size={13} />
        </a>
      </div>

      <div className="border-b border-[#21262d] pb-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#e6edf3]">
          Terrified
        </h1>
      </div>

      <p className="text-xs sm:text-sm text-[#e6edf3] font-medium">
        Hi, Welcome to my GitHub profile!
      </p>

      <blockquote className="border-l-2 border-white/60 pl-3.5 py-0.5 text-[#8b949e] text-xs sm:text-sm leading-relaxed">
        I&apos;m 16 a discord bot developer, malware analyst and neverlose csgo lua creator. One of my biggest projects is a discord bot called PurifyBot with tons of features. <span className="text-[#f85149]">❤️</span>
      </blockquote>

      <div className="flex items-center justify-between rounded-md border border-[#30363d] bg-[#161b22] px-3.5 py-2 text-xs font-mono">
        <span className="text-[#e6edf3]">
          <span className="text-[#79c0ff]">&gt;&gt;</span> neofetch
        </span>
        <div className="flex items-center gap-2 text-[#7d8590]">
          <FiCopy className="cursor-pointer hover:text-white transition-colors" size={13} />
          <div className="flex flex-col leading-none">
            <FiChevronUp size={9} />
            <FiChevronDown size={9} />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <div className="shrink-0">
          <img
            src="https://wavydevelopment.xyz/terrified.png"
            alt="Terrified avatar"
            className="w-44 h-44 object-cover rounded-md border border-[#30363d] shadow-md"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative flex-1 w-full rounded-md border border-[#30363d] bg-[#0f141c] p-4 text-xs font-mono leading-relaxed overflow-x-auto">
          <button
            onClick={() => {
              navigator.clipboard.writeText(`Name     : Terrified
Activity : Private and Public repositories
Skillset : TypeScript, JavaScript, C#, CSS, HTML, Rust, Python
Discord  : 1447292903654428733
Hobbies  : [
  Application Development,
  Website Developmemt,
  Discord bot Development
]`);
            }}
            className="absolute top-2.5 right-2.5 text-[#7d8590] hover:text-white transition-colors"
            title="Copy code"
          >
            <FiCopy size={13} />
          </button>

          <pre className="text-xs font-mono m-0">
            <code>
              <span className="text-[#e3b341]">Name</span>     : <span className="text-[#e6edf3]">Terrified</span>{"\n"}
              <span className="text-[#e3b341]">Activity</span> : <span className="text-[#e3b341]">Private</span> <span className="text-[#79c0ff]">and</span> <span className="text-[#e3b341]">Public</span> <span className="text-[#e6edf3]">repositories</span>{"\n"}
              <span className="text-[#e3b341]">Skillset</span> : <span className="text-[#e3b341]">TypeScript</span>, <span className="text-[#e3b341]">JavaScript</span>, <span className="text-[#e3b341]">C#</span>, <span className="text-[#c9d1d9]">CSS</span>, <span className="text-[#c9d1d9]">HTML</span>, <span className="text-[#c9d1d9]">Rust</span>, <span className="text-[#c9d1d9]">Python</span>{"\n"}
              <span className="text-[#e3b341]">Discord</span>  : <span className="text-[#58a6ff]">1447292903654428733</span>{"\n"}
              <span className="text-[#e3b341]">Hobbies</span>  : [{"\n"}
              {"  "}<span className="text-[#e3b341]">Application Development</span>,{"\n"}
              {"  "}<span className="text-[#e3b341]">Website Developmemt</span>,{"\n"}
              {"  "}<span className="text-[#e3b341]">Discord bot Development</span>{"\n"}
              ]
            </code>
          </pre>
        </div>
      </div>

      <div className="space-y-2 pt-1">
        <h3 className="text-sm font-bold text-[#e6edf3]">
          Skills &amp; Tools
        </h3>
        <div className="flex flex-wrap items-center gap-1.5">
          <img
            src="https://img.shields.io/badge/Lua-2C2D72?style=flat&logo=lua&logoColor=white"
            alt="Lua"
            className="h-5"
          />
          <img
            src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black"
            alt="JavaScript"
            className="h-5"
          />
          <img
            src="https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white"
            alt="Python"
            className="h-5"
          />
          <img
            src="https://img.shields.io/badge/C%23-239120?style=flat&logo=c-sharp&logoColor=white"
            alt="C#"
            className="h-5"
          />
          <img
            src="https://img.shields.io/badge/HTML-E34F26?style=flat&logo=html5&logoColor=white"
            alt="HTML"
            className="h-5"
          />
          <img
            src="https://img.shields.io/badge/CSS-1572B6?style=flat&logo=css3&logoColor=white"
            alt="CSS"
            className="h-5"
          />
          <img
            src="https://img.shields.io/badge/VS_Code-007ACC?style=flat&logo=visual-studio-code&logoColor=white"
            alt="VS Code"
            className="h-5"
          />
        </div>
      </div>

      <div className="border-b border-[#21262d] my-4" />

      <div className="space-y-2">
        <h3 className="text-sm font-bold text-[#e6edf3]">
          How to reach me
        </h3>
        <ul className="text-xs sm:text-sm text-[#e6edf3] space-y-1 list-none pl-1">
          <li className="flex items-center gap-2">
            <span className="text-[#7d8590]">•</span>
            <span>Discord: <span className="text-[#79c0ff]">fbihauntsme</span></span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-[#7d8590]">•</span>
            <span>
              <a
                href="https://fakecrime.bio/terrified"
                target="_blank"
                rel="noreferrer"
                className="text-[#58a6ff] hover:underline"
              >
                Fakecrime.bio
              </a>
              {" "}&amp;{" "}
              <a
                href="https://github.com/Batman76221"
                target="_blank"
                rel="noreferrer"
                className="text-[#58a6ff] hover:underline"
              >
                Portfolio
              </a>
            </span>
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
        <div className="rounded-xl border border-[#212638] bg-[#161b26] p-4.5 flex items-center justify-between shadow-lg">
          <div className="space-y-2.5">
            <p className="text-xs sm:text-sm font-semibold text-[#79c0ff]">
              Top Languages by Repo
            </p>
            <div className="space-y-1 text-[11px] text-[#c9d1d9]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#e3b341]" />
                <span>JavaScript</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#38bdf8]" />
                <span>Python</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#f472b6]" />
                <span>C++</span>
              </div>
            </div>
          </div>

          <div className="relative w-24 h-24 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="transparent"
                stroke="#e3b341"
                strokeWidth="16"
                strokeDasharray="130 226"
                strokeDashoffset="0"
              />
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="transparent"
                stroke="#38bdf8"
                strokeWidth="16"
                strokeDasharray="75 226"
                strokeDashoffset="-130"
              />
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="transparent"
                stroke="#f472b6"
                strokeWidth="16"
                strokeDasharray="21 226"
                strokeDashoffset="-205"
              />
            </svg>
          </div>
        </div>

        <div className="rounded-xl border border-[#212638] bg-[#161b26] p-4.5 flex items-center justify-between shadow-lg">
          <div className="space-y-2.5">
            <p className="text-xs sm:text-sm font-semibold text-[#79c0ff]">
              Top Languages by Commit
            </p>
            <div className="space-y-1 text-[11px] text-[#c9d1d9]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#38bdf8]" />
                <span>Python</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#e3b341]" />
                <span>JavaScript</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#f472b6]" />
                <span>C++</span>
              </div>
            </div>
          </div>

          <div className="relative w-24 h-24 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="transparent"
                stroke="#38bdf8"
                strokeWidth="16"
                strokeDasharray="115 226"
                strokeDashoffset="0"
              />
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="transparent"
                stroke="#e3b341"
                strokeWidth="16"
                strokeDasharray="85 226"
                strokeDashoffset="-115"
              />
              <circle
                cx="50"
                cy="50"
                r="36"
                fill="transparent"
                stroke="#f472b6"
                strokeWidth="16"
                strokeDasharray="26 226"
                strokeDashoffset="-200"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-2">
        <div className="flex items-center text-[10px] font-mono rounded overflow-hidden border border-[#30363d]">
          <span className="bg-[#21262d] text-[#c9d1d9] px-2.5 py-1 uppercase font-bold tracking-wider">Followers</span>
          <span className="bg-[#0969da] text-white px-2 py-1 font-bold">3</span>
        </div>

        <div className="flex items-center text-[10px] font-mono rounded overflow-hidden border border-[#30363d]">
          <span className="bg-[#21262d] text-[#c9d1d9] px-2.5 py-1 uppercase font-bold tracking-wider">Stars</span>
          <span className="bg-[#0969da] text-white px-2 py-1 font-bold">0</span>
        </div>

        <div className="flex items-center text-[10px] font-mono rounded overflow-hidden border border-[#30363d]">
          <span className="bg-[#21262d] text-[#c9d1d9] px-2.5 py-1 uppercase font-bold tracking-wider">Repos</span>
          <span className="bg-[#0969da] text-white px-2 py-1 font-bold">14</span>
        </div>
      </div>
    </div>
  );
}
