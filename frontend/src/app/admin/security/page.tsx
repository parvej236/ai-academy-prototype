"use client";

import { useState } from "react";
import { PageHeader, Panel, PanelHead, Switch } from "@/components/ui";
import { auditLog, securityPolicies } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function Security() {
  const { toast } = useStore();
  const [pol, setPol] = useState(securityPolicies);
  const [pw, setPw] = useState({ min: 8, expiry: 0, lockout: 5, session: 60 });

  return (
    <>
      <PageHeader
        title="Security"
        sub="Policies that apply to every account on the academy."
        actions={
          <button className="btn btn-primary btn-sm" onClick={() => toast("Security policies saved and logged")}>
            Save policies
          </button>
        }
      />
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel>
          <PanelHead title="Access policies" />
          <ul className="divide-y divide-line">
            {pol.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm">
                {p.label}
                <Switch on={p.on} onChange={(v) => setPol(pol.map((x) => (x.id === p.id ? { ...x, on: v } : x)))} label={p.label} />
              </li>
            ))}
          </ul>
        </Panel>
        <Panel>
          <PanelHead title="Passwords and sessions" />
          <div className="grid gap-4 px-5 pb-5 sm:grid-cols-2">
            {(
              [
                ["min", "Minimum password length"],
                ["lockout", "Lock account after failed attempts"],
                ["session", "Sign out after inactivity (minutes)"],
                ["expiry", "Force password change (days, 0 = never)"],
              ] as const
            ).map(([k, label]) => (
              <div key={k}>
                <label className="label" htmlFor={k}>
                  {label}
                </label>
                <input id={k} type="number" className="field tnum" value={pw[k]} onChange={(e) => setPw({ ...pw, [k]: +e.target.value })} />
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <Panel className="mt-5">
        <PanelHead title="Audit log" meta="Every admin and system action, kept for 2 years" action={<button className="btn btn-ghost btn-sm" onClick={() => toast("Audit log exported")}>Export</button>} />
        <div className="overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr>
                <th>Time</th>
                <th>Actor</th>
                <th>Action</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {auditLog.map((a, i) => (
                <tr key={i}>
                  <td className="tnum whitespace-nowrap text-muted">{a.at}</td>
                  <td className="font-medium">{a.who}</td>
                  <td>{a.action}</td>
                  <td className="tnum text-muted">{a.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
