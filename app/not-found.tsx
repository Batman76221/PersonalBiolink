"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-2">
      <h1 className="text-9xl font-bold text-[#db87db]">404</h1>
      <p className="text-9xl text-base [#db87db]">Page Not Found</p>
      <button
        onClick={() => router.back()}
        className="mt-2 flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-colors"
      >
        ← Go back
      </button>
    </main>
  );
}
