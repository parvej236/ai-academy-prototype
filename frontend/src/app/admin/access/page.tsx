"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { Badge, Bar, Modal, PageHeader, Tabs, cx } from "@/components/ui";
import { permissions, rolePerms, roles, tenants as seed } from "@/lib/data";
import { useStore } from "@/lib/store";

const tenantTone = { active: "mint", trial: "amber", suspended: "rose" } as const;

export default function Access() {
  const { toast } = useStore();
  const [tab, setTab] = useState<"roles" | "tenants">("roles");
  const [matrix, setMatrix] = useState<Record<string, string[]>>(rolePerms);
  const [tenants, setTenants] = useState(seed);
  const [open, setOpen] = useState(false);
  const [d, setD] = useState({ name: "", admin: "", seats: 5 });

  const toggle = (role: string, p: string) => {
    if (role === "super") return toast("Super admin always has every permission.", "warn");
    const cur = matrix[role];
    setMatrix({ ...matrix, [role]: cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p] });
  };

  return (
    <>
      <PageHeader
        title="Roles and tenants"
        sub="Global role-based access control, and firm workspaces (tenants) with their own seats and admins."
        actions={
          tab === "tenants" ? (
            <button className="btn btn-primary btn-sm" onClick={() => setOpen(true)}>
              <Plus size={15} /> New firm workspace
            </button>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={() => toast("Permission changes saved and logged")}>
              Save permissions
            </button>
          )
        }
      />
      <Tabs
        className="mb-5"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "roles", label: "Roles and permissions" },
          { id: "tenants", label: `Firm workspaces (${tenants.length})` },
        ]}
      />
      {tab === "roles" && (
        <div className="glass overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr>
                <th className="sticky left-0 bg-white/90">Permission</th>
                {roles.map((r) => (
                  <th key={r.id} className="text-center">
                    {r.name}
                    <span className="tnum block text-[0.68rem] font-normal">{r.users.toLocaleString()} users</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.map((p) => (
                <tr key={p}>
                  <td className="sticky left-0 bg-white/90 font-medium">{p}</td>
                  {roles.map((r) => {
                    const on = matrix[r.id].includes(p);
                    return (
                      <td key={r.id} className="text-center">
                        <button
                          onClick={() => toggle(r.id, p)}
                          role="checkbox"
                          aria-checked={on}
                          aria-label={`${r.name}: ${p}`}
                          className={cx("mx-auto flex h-6 w-6 items-center justify-center rounded-md border transition-colors", on ? "border-indigo bg-indigo text-white" : "border-line-strong border-tint/20 hover:border-indigo/50")}
                        >
                          {on && <Check size={13} />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === "tenants" && (
        <div className="glass overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr>
                <th>Firm</th>
                <th>Admin</th>
                <th>Seats used</th>
                <th>Renews</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {tenants.map((t) => (
                <tr key={t.id}>
                  <td className="font-medium">{t.name}</td>
                  <td className="text-muted">{t.admin}</td>
                  <td className="min-w-40">
                    <div className="flex items-center gap-2">
                      <Bar value={(t.used / t.seats) * 100} className="w-20" tone={t.used >= t.seats ? "amber" : "cyan"} />
                      <span className="tnum text-xs text-muted">
                        {t.used}/{t.seats}
                      </span>
                    </div>
                  </td>
                  <td className="tnum text-muted">{t.renews}</td>
                  <td>
                    <Badge tone={tenantTone[t.status as keyof typeof tenantTone]} dot>
                      {t.status}
                    </Badge>
                  </td>
                  <td className="text-right">
                    {t.status === "suspended" ? (
                      <button className="btn btn-glass btn-sm" onClick={() => { setTenants(tenants.map((x) => (x.id === t.id ? { ...x, status: "active" } : x))); toast(`${t.name} reactivated`); }}>
                        Reactivate
                      </button>
                    ) : (
                      <button className="btn btn-ghost btn-sm" onClick={() => { setTenants(tenants.map((x) => (x.id === t.id ? { ...x, status: "suspended" } : x))); toast(`${t.name} suspended. Staff lose access at once.`, "warn"); }}>
                        Suspend
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="New firm workspace">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!d.name.trim()) return;
            setTenants([...tenants, { id: "tn" + Date.now(), name: d.name, admin: d.admin || "Pending", seats: d.seats, used: 0, plan: "Firm", status: "trial", renews: "—" }]);
            setOpen(false);
            toast(`${d.name} created with a 14-day trial`);
          }}
        >
          <div>
            <label className="label">Firm name</label>
            <input className="field" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Firm admin email</label>
              <input className="field" value={d.admin} onChange={(e) => setD({ ...d, admin: e.target.value })} />
            </div>
            <div>
              <label className="label">Seats</label>
              <input type="number" min={5} className="field tnum" value={d.seats} onChange={(e) => setD({ ...d, seats: +e.target.value })} />
            </div>
          </div>
          <button className="btn btn-primary w-full">Create workspace</button>
        </form>
      </Modal>
    </>
  );
}
