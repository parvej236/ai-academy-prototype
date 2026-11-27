"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Modal, PageHeader, cx } from "@/components/ui";
import { scheduleItems } from "@/lib/data";
import { useStore } from "@/lib/store";

const days = ["Sun 23", "Mon 24", "Tue 25", "Wed 26", "Thu 27", "Fri 28", "Sat 29"];
const hours = Array.from({ length: 14 }, (_, i) => 8 + i); // 8:00–21:00
const typeStyle: Record<string, string> = {
  Live: "border-rose/30 bg-rose/10 text-rose",
  Release: "border-indigo/30 bg-indigo/10 text-indigo",
  Exam: "border-amber/35 bg-amber/10 text-amber",
  Internal: "border-line bg-tint/5 text-muted",
};
const ROW = 44;

export default function Schedule() {
  const { toast } = useStore();
  const [items, setItems] = useState(scheduleItems);
  const [filter, setFilter] = useState<string[]>(["Live", "Release", "Exam", "Internal"]);
  const [open, setOpen] = useState(false);
  const [d, setD] = useState({ title: "", type: "Live", day: 3, start: 18, len: 1, who: "" });

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!d.title.trim()) return;
    const clash = items.find((i) => i.day === d.day && d.start < i.start + i.len && i.start < d.start + d.len && i.type === d.type);
    setItems([...items, { ...d, id: "sc" + Date.now() }]);
    setOpen(false);
    toast(clash ? `Added. Note: overlaps with "${clash.title}"` : "Added to the master schedule", clash ? "warn" : "ok");
  };

  return (
    <>
      <PageHeader
        title="Master schedule"
        sub="Live classes, course releases, exam windows and internal events in one calendar."
        actions={
          <button className="btn btn-primary btn-sm" onClick={() => setOpen(true)}>
            <Plus size={15} /> Add event
          </button>
        }
      />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button className="btn btn-glass btn-sm !px-2" aria-label="Previous week">
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-semibold">23 – 29 Nov 2026</span>
          <button className="btn btn-glass btn-sm !px-2" aria-label="Next week">
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.keys(typeStyle).map((t) => {
            const on = filter.includes(t);
            return (
              <button
                key={t}
                onClick={() => setFilter(on ? filter.filter((x) => x !== t) : [...filter, t])}
                className={cx("rounded-full border px-3 py-1 text-xs font-semibold", on ? typeStyle[t] : "border-line text-faint line-through")}
                aria-pressed={on}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>
      {/* phones: agenda list by day */}
      <div className="space-y-3 md:hidden">
        {days.map((dname, di) => {
          const dayItems = items.filter((i) => i.day === di && filter.includes(i.type)).sort((a, b) => a.start - b.start);
          return (
            <section key={dname} className="glass p-4">
              <h2 className={cx("text-sm font-semibold", di === 3 && "text-indigo")}>
                {dname}
                {di === 3 && " (today)"}
              </h2>
              {dayItems.length === 0 ? (
                <p className="mt-2 text-sm text-faint">Nothing scheduled</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {dayItems.map((i) => (
                    <li key={i.id} className={cx("flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm", typeStyle[i.type])}>
                      <span className="tnum w-12 shrink-0 font-semibold">
                        {Math.floor(i.start)}:{i.start % 1 ? "30" : "00"}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold">{i.title}</span>
                        <span className="block text-xs opacity-75">
                          {i.type}, {i.who}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      <div className="glass hidden overflow-x-auto md:block">
        <div className="grid min-w-[880px]" style={{ gridTemplateColumns: "56px repeat(7, 1fr)" }}>
          <div />
          {days.map((d, i) => (
            <div key={d} className={cx("border-b border-l border-line px-3 py-3 text-xs font-semibold", i === 3 ? "text-indigo" : "text-muted")}>
              {d}
              {i === 3 && " (today)"}
            </div>
          ))}
          <div className="relative">
            {hours.map((h) => (
              <div key={h} className="tnum pr-2 pt-1 text-right text-[0.68rem] text-faint" style={{ height: ROW }}>
                {h}:00
              </div>
            ))}
          </div>
          {days.map((_, di) => (
            <div key={di} className="relative border-l border-line">
              {hours.map((h) => (
                <div key={h} className="border-b border-line/60" style={{ height: ROW }} />
              ))}
              {items
                .filter((i) => i.day === di && filter.includes(i.type))
                .map((i) => (
                  <div
                    key={i.id}
                    className={cx("absolute inset-x-1 overflow-hidden rounded-lg border px-2 py-1 text-[0.72rem] leading-tight", typeStyle[i.type])}
                    style={{ top: (i.start - 8) * ROW + 2, height: Math.max(i.len * ROW - 4, 26) }}
                    title={`${i.title} (${i.who})`}
                  >
                    <p className="font-semibold">{i.title}</p>
                    <p className="opacity-75">{i.who}</p>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Add to schedule">
        <form onSubmit={add} className="space-y-4">
          <div>
            <label className="label" htmlFor="et">
              Title
            </label>
            <input id="et" className="field" value={d.title} onChange={(e) => setD({ ...d, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="ty">
                Type
              </label>
              <select id="ty" className="field" value={d.type} onChange={(e) => setD({ ...d, type: e.target.value })}>
                {Object.keys(typeStyle).map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="dy">
                Day
              </label>
              <select id="dy" className="field" value={d.day} onChange={(e) => setD({ ...d, day: +e.target.value })}>
                {days.map((x, i) => (
                  <option key={x} value={i}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="st">
                Start hour
              </label>
              <input id="st" type="number" min={8} max={21} step={0.5} className="field tnum" value={d.start} onChange={(e) => setD({ ...d, start: +e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="ln">
                Length (hours)
              </label>
              <input id="ln" type="number" min={0.5} max={4} step={0.25} className="field tnum" value={d.len} onChange={(e) => setD({ ...d, len: +e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="who">
              Owner
            </label>
            <input id="who" className="field" value={d.who} onChange={(e) => setD({ ...d, who: e.target.value })} />
          </div>
          <button className="btn btn-primary w-full">Add event</button>
        </form>
      </Modal>
    </>
  );
}
