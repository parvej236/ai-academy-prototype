"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, Star } from "lucide-react";
import { Badge, Cover, Empty, cx } from "@/components/ui";
import { categories, courses, lessonCount } from "@/lib/data";

const levels = ["Any level", "Foundation", "Intermediate", "Advanced"] as const;

export default function CoursesPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [level, setLevel] = useState<(typeof levels)[number]>("Any level");

  const list = useMemo(
    () =>
      courses
        .filter((c) => c.status === "published" || c.status === "review")
        .filter((c) => cat === "All" || c.category === cat)
        .filter((c) => level === "Any level" || c.level === level)
        .filter((c) => (c.title + c.summary + c.audience.join(" ")).toLowerCase().includes(q.toLowerCase())),
    [q, cat, level],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pt-14 sm:px-6">
      <h1 className="font-display text-[2rem] font-semibold sm:text-[2.6rem]">Courses</h1>
      <p className="mt-3 max-w-xl text-muted">Every course is included in your subscription. Preview lessons are open to everyone.</p>

      <div className="glass mt-8 flex flex-col gap-3 p-3 md:flex-row md:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search courses</span>
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
          <input value={q} onChange={(e) => setQ(e.target.value)} className="field !rounded-full pl-10" placeholder="Search by topic, e.g. valuation, ASYCUDA, SAFTA" />
        </label>
        <select value={level} onChange={(e) => setLevel(e.target.value as typeof level)} className="field !rounded-full md:w-48" aria-label="Level">
          {levels.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cx(
              "rounded-full border px-3.5 py-1.5 text-[0.82rem] font-medium transition-colors",
              cat === c ? "border-indigo/50 bg-indigo/10 text-indigo" : "border-line text-muted hover:text-text",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="glass mt-8">
          <Empty title="No courses match those filters" body="Clear the search or pick a different category." action={<button className="btn btn-glass" onClick={() => { setQ(""); setCat("All"); setLevel("Any level"); }}>Clear filters</button>} />
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <Link key={c.slug} href={`/courses/${c.slug}`} className="glass group flex flex-col overflow-hidden lift">
              <Cover code={c.code} hue={c.hue} category={c.category} className="h-36" />
              <div className="flex flex-1 flex-col p-5">
                <div className="flex flex-wrap gap-2">
                  <Badge tone="indigo">{c.category}</Badge>
                  {c.status === "review" && <Badge tone="amber">Coming soon</Badge>}
                </div>
                <h2 className="mt-3 font-semibold leading-snug">{c.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-muted">{c.summary}</p>
                <div className="mt-auto flex items-center justify-between pt-5 text-xs text-faint">
                  <span>
                    {c.level}, {c.hours} h, {lessonCount(c)} lessons
                  </span>
                  <span className="tnum flex items-center gap-1 text-muted">
                    <Star size={12} className="fill-amber text-amber" />
                    {c.rating}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
