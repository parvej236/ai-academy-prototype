"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, Sparkles } from "lucide-react";
import { BarList, LineChart } from "@/components/charts";
import { Avatar, Badge, Panel, PanelHead, Stat, scoreTone } from "@/components/ui";
import { fmtDate, mentorReports, recentResults, riskTone, skills, students, weeklyActivity } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function StudentReport() {
  const { id } = useParams<{ id: string }>();
  const s = students.find((x) => x.id === id);
  const { toast, user } = useStore();
  const [reports, setReports] = useState(mentorReports.filter((r) => r.student === id));
  const [draft, setDraft] = useState("");
  const [rating, setRating] = useState("On track");
  const [period, setPeriod] = useState("Nov 21 – Dec 20");
  if (!s) notFound();

  const aiDraft = () => {
    setDraft(
      `${s.name.split(" ")[0]} completed ${s.progress}% of the assigned plan with an average of ${s.avgScore}%. ` +
        `Strongest area is procedures; ${s.weakest.toLowerCase()} is the main gap and was ${s.avgScore < 60 ? "well" : "slightly"} below the cohort. ` +
        `For the next period: finish the ${s.weakest.toLowerCase()} module, attempt the related lab case twice, and sit a 15-minute viva on the key sections.`,
    );
    toast("Draft generated from activity data. Edit before publishing.");
  };

  const publish = (e: React.FormEvent) => {
    e.preventDefault();
    if (draft.trim().length < 40) return toast("Write at least a few sentences before publishing.", "warn");
    setReports([{ id: `new-${reports.length}`, student: s.id, author: user?.name ?? "Mentor", date: "2026-11-26", period, summary: draft, rating }, ...reports]);
    setDraft("");
    toast(`Report published. ${s.name} has been notified.`);
  };

  return (
    <div className="space-y-5">
      <Link href="/mentor/students" className="inline-flex items-center gap-1 text-sm text-faint hover:text-text">
        <ChevronLeft size={15} /> My students
      </Link>
      <div className="flex flex-wrap items-center gap-4">
        <Avatar name={s.name} size={52} />
        <div className="flex-1">
          <h1 className="font-display text-2xl font-semibold">{s.name}</h1>
          <p className="text-sm text-muted">
            {s.org}, {s.group}, {s.email}
          </p>
        </div>
        <Badge tone={riskTone[s.risk]} dot>
          {s.risk}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Stat label="Progress" value={`${s.progress}%`} />
        <Stat label="Average score" value={`${s.avgScore}%`} />
        <Stat label="Weakest area" value={<span className="text-lg">{s.weakest}</span>} />
        <Stat label="Last active" value={<span className="text-lg">{fmtDate(s.lastActive)}</span>} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <Panel>
          <PanelHead title="Score trend" meta="Rolling average of all assessments" />
          <div className="px-4 pb-4">
            <LineChart data={weeklyActivity.map((w) => ({ x: w.week, y: Math.max(20, w.score - (80 - s.avgScore) / 2) }))} unit="%" max={100} label="Student score trend" />
          </div>
        </Panel>
        <Panel>
          <PanelHead title="Skills" />
          <div className="px-5 pb-5">
            <BarList data={skills.map((k) => ({ name: k.name, value: Math.max(20, Math.min(98, k.score + (s.avgScore - 74))) }))} />
          </div>
        </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <Panel>
          <PanelHead
            title="Write a training report"
            meta="Text-based report shared with the student and, for firm seats, their firm admin"
            action={
              <button type="button" onClick={aiDraft} className="btn btn-glass btn-sm">
                <Sparkles size={14} className="text-orchid" /> Draft from activity
              </button>
            }
          />
          <form onSubmit={publish} className="space-y-4 px-5 pb-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="period">
                  Period
                </label>
                <input id="period" className="field" value={period} onChange={(e) => setPeriod(e.target.value)} />
              </div>
              <div>
                <label className="label" htmlFor="rating">
                  Overall
                </label>
                <select id="rating" className="field" value={rating} onChange={(e) => setRating(e.target.value)}>
                  <option>On track</option>
                  <option>Needs support</option>
                  <option>At risk</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label" htmlFor="draft">
                Report
              </label>
              <textarea id="draft" rows={7} className="field" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="What went well, what didn't, and the plan for the next period." />
            </div>
            <div className="flex justify-end">
              <button className="btn btn-primary btn-sm">Publish report</button>
            </div>
          </form>
        </Panel>
        <div className="space-y-5">
          <Panel>
            <PanelHead title="Recent results" />
            <ul className="divide-y divide-line">
              {recentResults.map((r) => (
                <li key={r.title} className="flex items-center justify-between px-5 py-3 text-sm">
                  <span>
                    {r.title}
                    <span className="ml-2 text-xs text-faint">{r.kind}</span>
                  </span>
                  <Badge tone={scoreTone(r.score)}>{r.score}%</Badge>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel>
            <PanelHead title="Previous reports" />
            <div className="space-y-3 px-5 pb-5">
              {reports.length === 0 && <p className="text-sm text-muted">No reports yet.</p>}
              {reports.map((r) => (
                <article key={r.id} className="glass-inset p-4 text-sm">
                  <div className="flex justify-between">
                    <span className="font-semibold">{r.period}</span>
                    <Badge tone={r.rating === "At risk" ? "rose" : r.rating === "On track" ? "mint" : "amber"}>{r.rating}</Badge>
                  </div>
                  <p className="mt-2 leading-relaxed text-muted">{r.summary}</p>
                </article>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
