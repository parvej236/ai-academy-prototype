"use client";

import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Check, ChevronDown, FlaskConical, Lock, Star, Users } from "lucide-react";
import { Avatar, Badge, Cover, cx, kindIcon } from "@/components/ui";
import { getCourse, labCases, lessonCount } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const c = getCourse(slug);
  const router = useRouter();
  const { user, enrolled, enroll, hasAccess, toast } = useStore();
  const [open, setOpen] = useState<number[]>([0]);
  if (!c) notFound();

  const isEnrolled = enrolled.includes(c.slug);
  const cases = labCases.filter((l) => l.course === c.slug);
  const totalMin = c.modules.flatMap((m) => m.lessons).reduce((n, l) => n + l.minutes, 0);

  const onEnroll = () => {
    if (!user) return router.push(`/signup?next=/courses/${c.slug}`);
    if (!hasAccess) return router.push("/pricing");
    enroll(c.slug);
    toast(`Enrolled in ${c.title}`);
    router.push(`/app/learn/${c.slug}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
      <nav className="text-sm text-faint" aria-label="Breadcrumb">
        <Link href="/courses" className="hover:text-text">
          Courses
        </Link>{" "}
        / <span className="text-muted">{c.category}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="indigo">{c.category}</Badge>
            <Badge>{c.level}</Badge>
            {c.status === "review" && <Badge tone="amber">Coming soon</Badge>}
          </div>
          <h1 className="font-display mt-4 text-[1.9rem] font-semibold leading-tight sm:text-[2.4rem]">{c.title}</h1>
          <p className="mt-4 max-w-2xl text-[1.02rem] leading-relaxed text-muted">{c.summary}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
            <span className="tnum flex items-center gap-1.5">
              <Star size={14} className="fill-amber text-amber" /> {c.rating} rating
            </span>
            <span className="tnum flex items-center gap-1.5">
              <Users size={14} /> {c.learners.toLocaleString()} learners
            </span>
            <span>Updated {new Date(c.updated).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</span>
          </div>

          <section className="glass mt-10 p-6">
            <h2 className="font-semibold">What you will be able to do</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {c.outcomes.map((o) => (
                <li key={o} className="flex gap-3 text-sm">
                  <Check size={16} className="mt-0.5 shrink-0 text-mint" />
                  {o}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <div className="flex items-end justify-between">
              <h2 className="text-lg font-semibold">Course content</h2>
              <p className="tnum text-sm text-faint">
                {c.modules.length} modules, {lessonCount(c)} lessons, {Math.round(totalMin / 60)} h {totalMin % 60} min
              </p>
            </div>
            <div className="glass mt-4 divide-y divide-line overflow-hidden">
              {c.modules.map((m, i) => {
                const isOpen = open.includes(i);
                return (
                  <div key={m.title}>
                    <button
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-tint/[0.03]"
                      onClick={() => setOpen(isOpen ? open.filter((x) => x !== i) : [...open, i])}
                      aria-expanded={isOpen}
                    >
                      <span className="font-semibold">{m.title}</span>
                      <span className="flex items-center gap-3 text-xs text-faint">
                        {m.lessons.length} lessons
                        <ChevronDown size={16} className={cx("transition-transform", isOpen && "rotate-180")} />
                      </span>
                    </button>
                    {isOpen && (
                      <ul className="pb-2">
                        {m.lessons.map((l) => {
                          const Icon = kindIcon[l.kind];
                          return (
                            <li key={l.id} className="flex items-center gap-3 px-5 py-2.5 text-sm">
                              <Icon size={16} className="shrink-0 text-faint" />
                              <span className="flex-1">{l.title}</span>
                              {l.preview ? <Badge tone="indigo">Preview</Badge> : <Lock size={13} className="text-faint" />}
                              <span className="tnum w-14 text-right text-xs text-faint">{l.minutes} min</span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {cases.length > 0 && (
            <section className="mt-10">
              <h2 className="text-lg font-semibold">Lab cases in this course</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {cases.map((l) => (
                  <div key={l.id} className="glass p-5">
                    <div className="flex items-center gap-2 text-xs text-faint">
                      <FlaskConical size={14} className="text-orchid" /> {l.port}
                    </div>
                    <p className="mt-2 font-semibold">{l.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{l.brief}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* sticky enrol card */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="glass-strong edge-lit overflow-hidden">
            <Cover code={c.code} hue={c.hue} category={c.category} className="h-40" />
            <div className="p-6">
              <p className="text-sm text-muted">Included in Monthly, Professional and Firm plans</p>
              {isEnrolled ? (
                <Link href={`/app/learn/${c.slug}`} className="btn btn-primary btn-lg mt-5 w-full">
                  Continue learning
                </Link>
              ) : (
                <button onClick={onEnroll} disabled={c.status !== "published"} className="btn btn-primary btn-lg mt-5 w-full">
                  {c.status !== "published" ? "Opens soon" : user && hasAccess ? "Enrol now" : "Start with a plan"}
                </button>
              )}
              <ul className="mt-6 space-y-2.5 text-sm text-muted">
                <li>{c.hours} hours of video and reading</li>
                <li>Certificate with public verification</li>
                <li>Audience: {c.audience.join(", ")}</li>
              </ul>
              <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                <Avatar name={c.instructor} size={40} />
                <div className="text-sm">
                  <p className="font-semibold">{c.instructor}</p>
                  <p className="text-xs text-faint">{c.instructorTitle}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
