"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge, PageHeader, Panel, PanelHead, Switch } from "@/components/ui";
import { fmtBDT, fmtDate, payments, plans } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function Settings() {
  const { user, toast, subscribe } = useStore();
  const plan = plans.find((p) => p.id === user?.plan);
  const [prefs, setPrefs] = useState({ live: true, sms: true, digest: false, forum: true });
  const [profile, setProfile] = useState({ name: user?.name ?? "", org: user?.org ?? "", phone: "01712345678" });
  const mine = payments.filter((p) => p.who === user?.name);

  return (
    <>
      <PageHeader title="Plan and settings" />
      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-5">
          <Panel lit className="p-6">
            <p className="text-sm text-muted">Current plan</p>
            {plan ? (
              <>
                <div className="mt-2 flex items-baseline gap-3">
                  <p className="font-display text-2xl font-semibold">{plan.name}</p>
                  <span className="tnum text-muted">
                    {fmtBDT(plan.price)} / {plan.period}
                  </span>
                </div>
                <p className="mt-1 text-sm text-faint">Renews on 25 Feb 2027. Paid with bKash.</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link href="/pricing" className="btn btn-glass btn-sm">
                    Change plan
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      subscribe("none");
                      toast("Subscription cancelled. Paid features are now locked.", "warn");
                    }}
                  >
                    Cancel subscription
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="font-display mt-2 text-2xl font-semibold">No active plan</p>
                <Link href="/pricing" className="btn btn-primary btn-sm mt-4">
                  Choose a plan
                </Link>
              </>
            )}
          </Panel>

          <Panel>
            <PanelHead title="Profile" />
            <form
              className="grid gap-4 px-5 pb-5 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                toast("Profile saved");
              }}
            >
              <div>
                <label className="label" htmlFor="n">
                  Full name
                </label>
                <input id="n" className="field" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
              </div>
              <div>
                <label className="label" htmlFor="o">
                  Company
                </label>
                <input id="o" className="field" value={profile.org} onChange={(e) => setProfile({ ...profile, org: e.target.value })} />
              </div>
              <div>
                <label className="label" htmlFor="e">
                  Email
                </label>
                <input id="e" className="field" value={user?.email} disabled />
              </div>
              <div>
                <label className="label" htmlFor="p">
                  Mobile
                </label>
                <input id="p" className="field" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <button className="btn btn-primary btn-sm">Save profile</button>
              </div>
            </form>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel>
            <PanelHead title="Notifications" />
            <ul className="divide-y divide-line">
              {(
                [
                  ["live", "Live class scheduled or starting"],
                  ["sms", "SMS reminders for live classes and exams"],
                  ["forum", "Replies to my forum posts"],
                  ["digest", "Weekly progress email"],
                ] as const
              ).map(([k, label]) => (
                <li key={k} className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm">
                  {label}
                  <Switch on={prefs[k]} onChange={(v) => setPrefs({ ...prefs, [k]: v })} label={label} />
                </li>
              ))}
            </ul>
          </Panel>
          <Panel>
            <PanelHead title="Payment history" />
            <ul className="divide-y divide-line">
              {(mine.length ? mine : payments.slice(0, 1)).map((p) => (
                <li key={p.id} className="flex items-center justify-between px-5 py-3.5 text-sm">
                  <div>
                    <p>{p.plan}</p>
                    <p className="tnum text-xs text-faint">
                      {p.id}, {fmtDate(p.date)}, {p.method}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="tnum">{fmtBDT(p.amount)}</p>
                    <Badge tone="mint">Paid</Badge>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </>
  );
}
