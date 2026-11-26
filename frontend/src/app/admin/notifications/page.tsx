"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { PageHeader, Panel, PanelHead, Switch, cx } from "@/components/ui";
import { notificationRules } from "@/lib/data";
import { useStore } from "@/lib/store";

const channels = ["Email", "In-app", "SMS"];
const audiences = ["All AI Academy users", "Paid subscribers", "Importers", "C&F Agents", "Tax Practitioners", "Firm admins"];

export default function Notifications() {
  const { toast } = useStore();
  const [rules, setRules] = useState(notificationRules);
  const [b, setB] = useState({ audience: audiences[0], title: "", body: "", channels: ["Email", "In-app"] });

  const toggleCh = (id: string, ch: string) =>
    setRules(rules.map((r) => (r.id !== id ? r : { ...r, channels: r.channels.includes(ch) ? r.channels.filter((c) => c !== ch) : [...r.channels, ch] })));

  return (
    <>
      <PageHeader title="Notifications" sub="Automatic notifications for academy events, and one-off announcements." />
      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <Panel>
          <PanelHead title="Automatic notifications" />
          <div className="overflow-x-auto">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Sent to</th>
                  {channels.map((c) => (
                    <th key={c} className="text-center">
                      {c}
                    </th>
                  ))}
                  <th>On</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((r) => (
                  <tr key={r.id} className={cx(!r.on && "opacity-50")}>
                    <td className="font-medium">{r.event}</td>
                    <td className="text-muted">{r.audience}</td>
                    {channels.map((c) => (
                      <td key={c} className="text-center">
                        <input type="checkbox" checked={r.channels.includes(c)} onChange={() => toggleCh(r.id, c)} className="accent-[var(--indigo)]" aria-label={`${r.event} by ${c}`} />
                      </td>
                    ))}
                    <td>
                      <Switch on={r.on} onChange={(v) => setRules(rules.map((x) => (x.id === r.id ? { ...x, on: v } : x)))} label={r.event} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel>
          <PanelHead title="Send an announcement" />
          <form
            className="space-y-4 px-5 pb-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (!b.title.trim() || !b.body.trim()) return toast("Add a title and a message.", "warn");
              toast(`Announcement sent to ${b.audience} by ${b.channels.join(", ")}`);
              setB({ ...b, title: "", body: "" });
            }}
          >
            <div>
              <label className="label">Audience</label>
              <select className="field" value={b.audience} onChange={(e) => setB({ ...b, audience: e.target.value })}>
                {audiences.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Title</label>
              <input className="field" value={b.title} onChange={(e) => setB({ ...b, title: e.target.value })} placeholder="e.g. New SRO on regulatory duty" />
            </div>
            <div>
              <label className="label">Message</label>
              <textarea rows={4} className="field" value={b.body} onChange={(e) => setB({ ...b, body: e.target.value })} />
            </div>
            <fieldset>
              <legend className="label">Channels</legend>
              <div className="flex gap-2">
                {channels.map((c) => {
                  const on = b.channels.includes(c);
                  return (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setB({ ...b, channels: on ? b.channels.filter((x) => x !== c) : [...b.channels, c] })}
                      className={cx("rounded-full border px-3.5 py-1.5 text-sm", on ? "border-indigo/40 bg-indigo/10 text-indigo" : "border-line text-muted")}
                      aria-pressed={on}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <button className="btn btn-primary w-full">
              <Send size={15} /> Send announcement
            </button>
          </form>
        </Panel>
      </div>
    </>
  );
}
