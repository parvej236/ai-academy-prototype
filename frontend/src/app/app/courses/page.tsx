"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge, Bar, Cover, Empty, PageHeader, Tabs } from "@/components/ui";
import { courses, lessonCount } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function MyCourses() {
  const { enrolled, completed, enroll, toast, hasAccess } = useStore();
  const [tab, setTab] = useState<"mine" | "all">("mine");
  const pct = (slug: string) => Math.round(((completed[slug]?.length ?? 0) / lessonCount(courses.find((c) => c.slug === slug)!)) * 100);
  const mine = courses.filter((c) => enrolled.includes(c.slug));
  const others = courses.filter((c) => !enrolled.includes(c.slug) && c.status === "published");

  return (
    <>
      <PageHeader title="My courses" sub="Courses you're enrolled in, and everything else your plan includes." />
      <Tabs
        className="mb-6"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "mine", label: `Enrolled (${mine.length})` },
          { id: "all", label: `Available (${others.length})` },
        ]}
      />
      {tab === "mine" &&
        (mine.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {mine.map((c) => {
              const p = pct(c.slug);
              return (
                <Link key={c.slug} href={`/app/learn/${c.slug}`} className="glass flex flex-col overflow-hidden transition-colors hover:border-tint/20">
                  <Cover code={c.code} hue={c.hue} className="h-28" />
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between">
                      <Badge tone="indigo">{c.category}</Badge>
                      {p === 100 && <Badge tone="mint">Completed</Badge>}
                    </div>
                    <h2 className="mt-3 font-semibold leading-snug">{c.title}</h2>
                    <p className="mt-1 text-xs text-faint">{c.instructor}</p>
                    <div className="mt-auto flex items-center gap-3 pt-5">
                      <Bar value={p} tone={p === 100 ? "mint" : "cyan"} className="flex-1" />
                      <span className="tnum text-xs text-muted">
                        {completed[c.slug]?.length ?? 0}/{lessonCount(c)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="glass">
            <Empty title="You're not enrolled in anything yet" body="Pick a course from the Available tab to start." action={<button className="btn btn-primary" onClick={() => setTab("all")}>See available courses</button>} />
          </div>
        ))}
      {tab === "all" && (
        <div className="glass divide-y divide-line overflow-hidden">
          {others.map((c) => (
            <div key={c.slug} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              <Cover code={c.code} hue={c.hue} className="h-14 w-14 shrink-0 rounded-xl [&>span:last-child]:hidden" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{c.title}</p>
                <p className="mt-0.5 text-sm text-muted line-clamp-1">{c.summary}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/courses/${c.slug}`} className="btn btn-ghost btn-sm">
                  Details
                </Link>
                <button
                  className="btn btn-primary btn-sm"
                  disabled={!hasAccess}
                  onClick={() => {
                    enroll(c.slug);
                    toast(`Enrolled in ${c.title}`);
                  }}
                >
                  Enrol
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
