"use client";

import Link from "next/link";
import { notFound, useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, Plus, Trash2, Upload } from "lucide-react";
import { Badge, Panel, PanelHead, StateBadge, Switch, Tabs, cx, kindIcon } from "@/components/ui";
import { getCourse, type Course, type CourseModule, type Lesson, type PublishState } from "@/lib/data";
import { useStore } from "@/lib/store";

const flow: PublishState[] = ["draft", "review", "scheduled", "published"];

export default function CourseEditor() {
  const { slug } = useParams<{ slug: string }>();
  const sp = useSearchParams();
  const c: Course | undefined =
    slug === "new"
      ? {
          slug: "new",
          code: (sp.get("title") ?? "NC").slice(0, 2).toUpperCase(),
          title: sp.get("title") ?? "Untitled course",
          summary: "",
          category: sp.get("category") ?? "Classification",
          level: (sp.get("level") as Course["level"]) ?? "Foundation",
          hours: 0,
          rating: 0,
          learners: 0,
          instructor: sp.get("instructor") || "Unassigned",
          instructorTitle: "",
          audience: [],
          outcomes: [],
          hue: 220,
          status: "draft",
          updated: "2026-11-26",
          modules: [{ title: "Module 1", lessons: [{ id: "new-1", title: "Introduction", kind: "video", minutes: 10, preview: true }] }],
        }
      : getCourse(slug);
  const { toast } = useStore();
  const [tab, setTab] = useState<"content" | "details" | "publishing">("content");
  const [mods, setMods] = useState<CourseModule[]>(() => structuredClone(c?.modules ?? []));
  const [info, setInfo] = useState({ title: c?.title ?? "", summary: c?.summary ?? "", outcomes: c?.outcomes.join("\n") ?? "" });
  const [state, setState] = useState<PublishState>(c?.status ?? "draft");
  const [when, setWhen] = useState("2026-12-01T10:00");
  const [opts, setOpts] = useState({ selfEnrol: true, certificate: true, sequential: true, watermark: true });
  if (!c) notFound();

  const updLesson = (mi: number, li: number, patch: Partial<Lesson>) =>
    setMods(mods.map((m, i) => (i !== mi ? m : { ...m, lessons: m.lessons.map((l, j) => (j === li ? { ...l, ...patch } : l)) })));
  const move = (mi: number, li: number, dir: -1 | 1) => {
    const m = [...mods[mi].lessons];
    const j = li + dir;
    if (j < 0 || j >= m.length) return;
    [m[li], m[j]] = [m[j], m[li]];
    setMods(mods.map((x, i) => (i === mi ? { ...x, lessons: m } : x)));
  };
  const addLesson = (mi: number) =>
    setMods(mods.map((m, i) => (i !== mi ? m : { ...m, lessons: [...m.lessons, { id: "new" + Date.now(), title: "Untitled lesson", kind: "video", minutes: 10 }] })));
  const removeLesson = (mi: number, li: number) => setMods(mods.map((m, i) => (i !== mi ? m : { ...m, lessons: m.lessons.filter((_, j) => j !== li) })));

  const advance = (to: PublishState) => {
    setState(to);
    toast(
      to === "review"
        ? "Sent to review. Examiners have been notified."
        : to === "scheduled"
          ? `Scheduled to publish on ${new Date(when).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}`
          : to === "published"
            ? "Published. Subscribers can now see the course."
            : "Moved back to draft",
    );
  };

  return (
    <div className="space-y-5">
      <Link href="/admin/courses" className="inline-flex items-center gap-1 text-sm text-faint hover:text-text">
        <ChevronLeft size={15} /> Courses and CMS
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">{info.title}</h1>
          <div className="mt-1.5 flex items-center gap-2">
            <StateBadge state={state} />
            <span className="text-xs text-faint">Autosaved just now</span>
          </div>
        </div>
        <div className="flex gap-2">
          {c.slug !== "new" && (
            <Link href={`/courses/${c.slug}`} className="btn btn-glass btn-sm">
              Preview
            </Link>
          )}
          <button className="btn btn-primary btn-sm" onClick={() => toast("Changes saved")}>
            Save changes
          </button>
        </div>
      </div>

      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "content", label: "Content" },
          { id: "details", label: "Details" },
          { id: "publishing", label: "Publishing" },
        ]}
      />

      {tab === "content" && (
        <div className="space-y-4">
          {mods.map((m, mi) => (
            <Panel key={mi}>
              <div className="flex items-center gap-3 px-5 pt-5">
                <input
                  value={m.title}
                  onChange={(e) => setMods(mods.map((x, i) => (i === mi ? { ...x, title: e.target.value } : x)))}
                  className="field !h-9 max-w-md font-semibold"
                  aria-label="Module title"
                />
                <span className="text-xs text-faint">{m.lessons.length} {m.lessons.length === 1 ? "lesson" : "lessons"}</span>
              </div>
              <ul className="mt-3 divide-y divide-line">
                {m.lessons.map((l, li) => {
                  const Icon = kindIcon[l.kind];
                  return (
                    <li key={l.id} className="flex flex-wrap items-center gap-3 px-5 py-2.5">
                      <Icon size={16} className="text-faint" />
                      <input value={l.title} onChange={(e) => updLesson(mi, li, { title: e.target.value })} className="field !h-8 min-w-48 flex-1 !text-sm" aria-label="Lesson title" />
                      <select value={l.kind} onChange={(e) => updLesson(mi, li, { kind: e.target.value as Lesson["kind"] })} className="field !h-8 !w-28 !text-sm" aria-label="Type">
                        <option value="video">Video</option>
                        <option value="reading">Reading</option>
                        <option value="quiz">Quiz</option>
                        <option value="lab">Lab</option>
                      </select>
                      <input type="number" value={l.minutes} onChange={(e) => updLesson(mi, li, { minutes: +e.target.value })} className="field tnum !h-8 !w-20 !text-sm" aria-label="Minutes" />
                      <label className="flex items-center gap-2 text-xs text-muted">
                        <Switch on={!!l.preview} onChange={(v) => updLesson(mi, li, { preview: v })} label="Free preview" /> Preview
                      </label>
                      <div className="flex">
                        <button className="btn btn-ghost btn-sm !px-1.5" onClick={() => move(mi, li, -1)} aria-label="Move up">
                          <ArrowUp size={14} />
                        </button>
                        <button className="btn btn-ghost btn-sm !px-1.5" onClick={() => move(mi, li, 1)} aria-label="Move down">
                          <ArrowDown size={14} />
                        </button>
                        <button className="btn btn-ghost btn-sm !px-1.5 hover:!text-rose" onClick={() => removeLesson(mi, li)} aria-label="Delete lesson">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="flex gap-2 p-4">
                <button className="btn btn-glass btn-sm" onClick={() => addLesson(mi)}>
                  <Plus size={14} /> Add lesson
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => toast("Video uploaded. Transcription and notes queued on the AI pipeline.")}>
                  <Upload size={14} /> Upload video
                </button>
              </div>
            </Panel>
          ))}
          <button className="btn btn-glass" onClick={() => setMods([...mods, { title: `Module ${mods.length + 1}`, lessons: [] }])}>
            <Plus size={15} /> Add module
          </button>
        </div>
      )}

      {tab === "details" && (
        <Panel className="max-w-3xl p-6">
          <div className="space-y-4">
            <div>
              <label className="label" htmlFor="t">
                Title
              </label>
              <input id="t" className="field" value={info.title} onChange={(e) => setInfo({ ...info, title: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="s">
                Summary
              </label>
              <textarea id="s" rows={3} className="field" value={info.summary} onChange={(e) => setInfo({ ...info, summary: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="o">
                Learning outcomes (one per line)
              </label>
              <textarea id="o" rows={5} className="field" value={info.outcomes} onChange={(e) => setInfo({ ...info, outcomes: e.target.value })} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label">Title (Bangla)</label>
                <input className="field" placeholder="বাংলা শিরোনাম" />
              </div>
              <div>
                <label className="label">Instructor</label>
                <input className="field" defaultValue={c.instructor} />
              </div>
            </div>
          </div>
        </Panel>
      )}

      {tab === "publishing" && (
        <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          <Panel>
            <PanelHead title="Publishing workflow" meta="Courses move draft → review → scheduled → published" />
            <ol className="flex flex-wrap gap-2 px-5">
              {flow.map((s, i) => {
                const reached = flow.indexOf(state) >= i;
                return (
                  <li key={s} className={cx("flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold", reached ? "border-indigo/40 bg-indigo/10 text-indigo" : "border-line text-faint")}>
                    <span className="tnum">{i + 1}</span> {s[0].toUpperCase() + s.slice(1)}
                  </li>
                );
              })}
            </ol>
            <div className="space-y-4 p-5">
              {state === "draft" && (
                <button className="btn btn-primary" onClick={() => advance("review")}>
                  Send to review
                </button>
              )}
              {state === "review" && (
                <div className="space-y-3">
                  <div>
                    <label className="label" htmlFor="when">
                      Publish at
                    </label>
                    <input id="when" type="datetime-local" className="field max-w-xs" value={when} onChange={(e) => setWhen(e.target.value)} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button className="btn btn-primary" onClick={() => advance("scheduled")}>
                      Approve and schedule
                    </button>
                    <button className="btn btn-glass" onClick={() => advance("published")}>
                      Publish now
                    </button>
                    <button className="btn btn-ghost" onClick={() => advance("draft")}>
                      Return to author
                    </button>
                  </div>
                </div>
              )}
              {state === "scheduled" && (
                <div className="flex flex-wrap gap-2">
                  <button className="btn btn-primary" onClick={() => advance("published")}>
                    Publish now
                  </button>
                  <button className="btn btn-ghost" onClick={() => advance("review")}>
                    Cancel schedule
                  </button>
                </div>
              )}
              {state === "published" && (
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone="mint">Visible to subscribers</Badge>
                  <button className="btn btn-danger btn-sm" onClick={() => advance("draft")}>
                    Unpublish
                  </button>
                </div>
              )}
            </div>
          </Panel>
          <Panel>
            <PanelHead title="Delivery settings" />
            <ul className="divide-y divide-line">
              {(
                [
                  ["selfEnrol", "Subscribers can self-enrol"],
                  ["sequential", "Lessons unlock in order"],
                  ["certificate", "Issue certificate on completion"],
                  ["watermark", "Watermark videos with viewer email"],
                ] as const
              ).map(([k, label]) => (
                <li key={k} className="flex items-center justify-between px-5 py-3.5 text-sm">
                  {label}
                  <Switch on={opts[k]} onChange={(v) => setOpts({ ...opts, [k]: v })} label={label} />
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      )}
    </div>
  );
}
