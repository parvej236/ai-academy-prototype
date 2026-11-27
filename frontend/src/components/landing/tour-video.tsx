"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { useT } from "@/lib/i18n";

/* Product tour on the home page, narrated in English or Bangla.
   The poster loads first; the video for the current language is only
   fetched once someone presses play. Switching the site language swaps
   to the other narration. Captions match the narration and are off by
   default (turn them on from the player's CC menu). */
export function TourVideo() {
  const { t, lang } = useT();
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  // Keep the matching caption track available but hidden until the viewer turns it on.
  useEffect(() => {
    const v = ref.current;
    if (!started || !v) return;
    const apply = () => [...v.textTracks].forEach((tr) => (tr.mode = tr.language === lang ? (tr.mode === "showing" ? "showing" : "hidden") : "disabled"));
    apply();
    v.textTracks.addEventListener("addtrack", apply);
    return () => v.textTracks.removeEventListener("addtrack", apply);
  }, [started, lang]);

  // Start playback on first press, and again after a language switch remounts the player.
  useEffect(() => {
    if (started) ref.current?.play().catch(() => {});
  }, [started, lang]);

  const start = () => setStarted(true);

  return (
    <div className="glass-strong relative overflow-hidden p-2 sm:p-3">
      <div className="relative aspect-video overflow-hidden rounded-[16px] bg-[#0f1433]">
        {started ? (
          <video
            key={lang}
            ref={ref}
            className="h-full w-full"
            controls
            playsInline
            preload="auto"
            poster="/media/ai-academy-tour-poster.jpg"
            aria-label={t("AI Academy product tour")}
          >
            <source src={`/media/ai-academy-tour-${lang}.mp4`} type="video/mp4" />
            <track kind="captions" src={`/media/captions-${lang}.vtt`} srcLang={lang} label={lang === "bn" ? "বাংলা" : "English"} />
          </video>
        ) : (
          <button onClick={start} className="group absolute inset-0 block h-full w-full" aria-label={t("Play the product tour")}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/ai-academy-tour-poster.jpg" alt="" className="h-full w-full object-cover" />
            <span className="absolute inset-0 bg-[#0f1433]/35 transition-colors group-hover:bg-[#0f1433]/25" />
            <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-xl transition-transform group-hover:scale-105">
              <Play size={30} className="ml-1 text-indigo" fill="currentColor" />
            </span>
            <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-text">
              {t("Narrated tour, under 2 minutes")}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
