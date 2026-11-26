"use client";

import { useState } from "react";
import { BarChart } from "@/components/charts";
import { Badge, PageHeader, Panel, PanelHead, Stat, Tabs } from "@/components/ui";
import { fmtBDT, fmtDate, payments as seedPay, plans as seedPlans, revenueByMonth } from "@/lib/data";
import { useStore } from "@/lib/store";

const payTone = { paid: "mint", failed: "rose", refunded: "neutral", pending: "amber" } as const;

export default function Billing() {
  const { toast } = useStore();
  const [tab, setTab] = useState<"payments" | "plans">("payments");
  const [plans, setPlans] = useState(seedPlans);
  const [pays, setPays] = useState(seedPay);

  return (
    <>
      <PageHeader title="Subscriptions and billing" sub="Plans, payments and refunds. Access to the academy, including live classes, requires an active subscription." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Monthly recurring revenue" value="৳12.6M" delta={{ v: "+22%", up: true }} />
        <Stat label="Active subscriptions" value="14,820" foot="Professional 58%, Monthly 27%, Firm 15%" />
        <Stat label="Failed payments" value="41" foot="Retried automatically after 24 h" />
        <Stat label="Churn" value="3.2%" delta={{ v: "−0.4", up: true }} foot="Monthly" />
      </div>
      <Tabs
        className="my-5"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "payments", label: "Payments" },
          { id: "plans", label: "Plans and prices" },
        ]}
      />
      {tab === "payments" && (
        <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
          <div className="glass overflow-x-auto">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Payment</th>
                  <th>Customer</th>
                  <th>Plan</th>
                  <th>Method</th>
                  <th className="text-right">Amount</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {pays.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <p className="tnum font-medium">{p.id}</p>
                      <p className="text-xs text-faint">{fmtDate(p.date)}</p>
                    </td>
                    <td>{p.who}</td>
                    <td className="text-muted">{p.plan}</td>
                    <td className="text-muted">{p.method}</td>
                    <td className="tnum text-right">{fmtBDT(p.amount)}</td>
                    <td>
                      <Badge tone={payTone[p.status as keyof typeof payTone]}>{p.status}</Badge>
                    </td>
                    <td className="whitespace-nowrap text-right">
                      {p.status === "paid" && (
                        <button className="btn btn-ghost btn-sm" onClick={() => { setPays(pays.map((x) => (x.id === p.id ? { ...x, status: "refunded" } : x))); toast(`Refund of ${fmtBDT(p.amount)} started`, "warn"); }}>
                          Refund
                        </button>
                      )}
                      {p.status === "failed" && (
                        <button className="btn btn-glass btn-sm" onClick={() => { setPays(pays.map((x) => (x.id === p.id ? { ...x, status: "paid" } : x))); toast("Retry succeeded"); }}>
                          Retry
                        </button>
                      )}
                      {p.status === "pending" && (
                        <button className="btn btn-glass btn-sm" onClick={() => { setPays(pays.map((x) => (x.id === p.id ? { ...x, status: "paid" } : x))); toast("Bank transfer marked as received"); }}>
                          Mark received
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Panel>
            <PanelHead title="Revenue" meta="BDT millions" />
            <div className="px-4 pb-4">
              <BarChart data={revenueByMonth.map((r) => ({ x: r.m, y: r.v }))} label="Revenue" fmt={(v) => `৳${v}M`} />
            </div>
          </Panel>
        </div>
      )}
      {tab === "plans" && (
        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((p, i) => (
            <Panel key={p.id} className="p-6">
              <p className="font-semibold">{p.name}</p>
              <label className="label mt-4" htmlFor={`price-${p.id}`}>
                Price (BDT per {p.period})
              </label>
              <input
                id={`price-${p.id}`}
                type="number"
                className="field tnum"
                value={p.price}
                onChange={(e) => setPlans(plans.map((x, j) => (j === i ? { ...x, price: +e.target.value } : x)))}
              />
              <p className="label mt-4">Includes</p>
              <ul className="space-y-1.5 text-sm text-muted">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <button className="btn btn-primary btn-sm mt-5" onClick={() => toast(`${p.name} price set to ${fmtBDT(p.price)}. Applies to new and renewing subscriptions.`)}>
                Save price
              </button>
            </Panel>
          ))}
        </div>
      )}
    </>
  );
}
