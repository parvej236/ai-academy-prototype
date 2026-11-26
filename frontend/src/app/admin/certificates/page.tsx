"use client";

import { useState } from "react";
import { Badge, Modal, PageHeader, Panel, PanelHead, Switch, Tabs } from "@/components/ui";
import { certTemplates, certificates as seed, fmtDate, getCourse, type Certificate } from "@/lib/data";
import { useStore } from "@/lib/store";

const statusTone = { valid: "mint", revoked: "rose", pending: "amber" } as const;

export default function AdminCertificates() {
  const { toast } = useStore();
  const [tab, setTab] = useState<"issued" | "templates" | "rules">("issued");
  const [certs, setCerts] = useState(seed);
  const [revoke, setRevoke] = useState<Certificate | null>(null);
  const [reason, setReason] = useState("");
  const [rules, setRules] = useState({ auto: true, merit: true, review: false, expiry: false });

  return (
    <>
      <PageHeader title="Certificates" sub="Templates, issuance and revocation. Revoked certificates show as revoked on the public verification page immediately." />
      <Tabs
        className="mb-5"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "issued", label: "Issued" },
          { id: "templates", label: "Templates" },
          { id: "rules", label: "Issuance rules" },
        ]}
      />
      {tab === "issued" && (
        <div className="glass overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr>
                <th>Serial</th>
                <th>Learner</th>
                <th>Course</th>
                <th>Score</th>
                <th>Issued</th>
                <th>Template</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {certs.map((c) => (
                <tr key={c.id}>
                  <td className="tnum font-medium">{c.serial}</td>
                  <td>{c.student}</td>
                  <td className="text-muted">{getCourse(c.course)?.title}</td>
                  <td className="tnum text-muted">{c.score}%</td>
                  <td className="whitespace-nowrap text-muted">{fmtDate(c.issued)}</td>
                  <td className="text-muted">{c.template}</td>
                  <td>
                    <Badge tone={statusTone[c.status]} dot>
                      {c.status[0].toUpperCase() + c.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap text-right">
                    {c.status === "pending" && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setCerts(certs.map((x) => (x.id === c.id ? { ...x, status: "valid" } : x)));
                          toast(`Issued ${c.serial} to ${c.student}`);
                        }}
                      >
                        Issue
                      </button>
                    )}
                    {c.status === "valid" && (
                      <button className="btn btn-danger btn-sm" onClick={() => { setRevoke(c); setReason(""); }}>
                        Revoke
                      </button>
                    )}
                    {c.status === "revoked" && (
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => {
                          setCerts(certs.map((x) => (x.id === c.id ? { ...x, status: "valid" } : x)));
                          toast(`${c.serial} reinstated`);
                        }}
                      >
                        Reinstate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === "templates" && (
        <div className="grid gap-4 md:grid-cols-3">
          {certTemplates.map((t) => (
            <div key={t.id} className="glass overflow-hidden">
              <div className="on-dark relative aspect-[1.5] p-5" style={{ background: "#121848" }}>
                <div className="absolute inset-2.5 rounded-xl border border-white/15" />
                <div className="relative flex h-full flex-col">
                  <p className="text-[0.6rem] text-muted">AI Academy, Tradevics AI</p>
                  <p className="mt-auto text-lg font-semibold">Learner name</p>
                  <p className="text-[0.65rem] text-muted">Course title, final score</p>
                  <div className="mt-auto flex justify-between text-[0.55rem] text-faint">
                    <span>{t.signatories.join(" / ")}</span>
                    <span>AIA-2026-00000</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="tnum text-xs text-faint">Used {t.used.toLocaleString()} times</p>
                </div>
                <button className="btn btn-glass btn-sm" onClick={() => toast("Template editor opens once file storage is connected", "warn")}>
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === "rules" && (
        <Panel className="max-w-2xl">
          <PanelHead title="When certificates are issued" />
          <ul className="divide-y divide-line">
            {(
              [
                ["auto", "Issue automatically when the final assessment is passed"],
                ["merit", "Use the Merit template for scores of 90% or above"],
                ["review", "Hold for examiner approval before issuing"],
                ["expiry", "Certificates expire after 3 years"],
              ] as const
            ).map(([k, label]) => (
              <li key={k} className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm">
                {label}
                <Switch on={rules[k]} onChange={(v) => setRules({ ...rules, [k]: v })} label={label} />
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <Modal open={!!revoke} onClose={() => setRevoke(null)} title="Revoke certificate">
        {revoke && (
          <div className="space-y-4">
            <p className="text-sm text-muted">
              <span className="tnum text-text">{revoke.serial}</span> issued to {revoke.student} will show as revoked on the verification page. The learner is notified by email.
            </p>
            <div>
              <label className="label" htmlFor="why">
                Reason (required, kept in the audit log)
              </label>
              <textarea id="why" rows={3} className="field" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Exam integrity breach confirmed by examiner panel" />
            </div>
            <button
              className="btn btn-danger w-full"
              disabled={reason.trim().length < 5}
              onClick={() => {
                setCerts(certs.map((x) => (x.id === revoke.id ? { ...x, status: "revoked" } : x)));
                toast(`${revoke.serial} revoked`, "warn");
                setRevoke(null);
              }}
            >
              Revoke certificate
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}
