"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check } from "lucide-react";
import { Modal, cx } from "@/components/ui";
import { fmtBDT, plans, type PlanId } from "@/lib/data";
import { useStore } from "@/lib/store";

const methods = ["bKash", "Nagad", "Card (SSLCommerz)", "Bank transfer"];

export default function Pricing() {
  const { user, subscribe, toast } = useStore();
  const router = useRouter();
  const [checkout, setCheckout] = useState<PlanId | null>(null);
  const [method, setMethod] = useState(methods[0]);
  const [seats, setSeats] = useState(5);
  const [paying, setPaying] = useState(false);
  const plan = plans.find((p) => p.id === checkout);
  const total = plan ? (plan.id === "firm" ? plan.price * seats : plan.price) : 0;

  const choose = (id: PlanId) => {
    if (!user) return router.push(`/signup?next=/pricing`);
    setCheckout(id);
  };

  const pay = () => {
    setPaying(true);
    setTimeout(() => {
      subscribe(checkout!);
      setPaying(false);
      setCheckout(null);
      toast(`${plan?.name} plan is active. Payment of ${fmtBDT(total)} received.`);
      router.push("/app");
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pt-14 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="font-display text-[2rem] font-semibold sm:text-[2.6rem]">Plans</h1>
        <p className="mt-3 text-muted">
          AI Academy is a paid platform. Every plan includes all published courses. Live classes, mentors and certificates start at Professional.
        </p>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {plans.map((p) => {
          const hl = p.id === "professional";
          const current = user?.plan === p.id;
          return (
            <div key={p.id} className={cx(hl ? "glass-strong edge-lit" : "glass", "flex flex-col p-7")}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{p.name}</h2>
                {hl && <span className="rounded-full bg-indigo/15 px-2.5 py-1 text-xs font-semibold text-indigo">Most chosen</span>}
              </div>
              <p className="mt-2 text-sm text-muted">{p.for}</p>
              <p className="mt-6">
                <span className="tnum font-display text-[2.2rem] font-semibold">{fmtBDT(p.price)}</span>
                <span className="ml-1 text-sm text-faint">/ {p.period}</span>
              </p>
              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <Check size={16} className="mt-0.5 shrink-0 text-indigo" />
                    {f}
                  </li>
                ))}
              </ul>
              <button disabled={current} onClick={() => choose(p.id)} className={cx("btn btn-lg mt-8 w-full", hl ? "btn-primary" : "btn-glass")}>
                {current ? "Your current plan" : p.id === "firm" ? "Set up a firm workspace" : `Choose ${p.name}`}
              </button>
            </div>
          );
        })}
      </div>

      <section className="glass mt-12 grid gap-8 p-7 md:grid-cols-3">
        {[
          ["Can I cancel?", "Yes. Your access continues to the end of the paid period. Monthly plans don't renew if you cancel before the renewal date."],
          ["Who writes the courses?", "Curriculum is authored and owned by the academy's subject experts. The AI generates questions and simulations from that material, not the syllabus itself."],
          ["Do firms get invoices?", "Firm plans are billed per seat each quarter with a single VAT invoice. Seats can be reassigned when staff change."],
        ].map(([q, a]) => (
          <div key={q}>
            <h3 className="font-semibold">{q}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{a}</p>
          </div>
        ))}
      </section>

      <Modal open={!!checkout} onClose={() => !paying && setCheckout(null)} title={`Subscribe to ${plan?.name ?? ""}`}>
        {plan && (
          <div className="space-y-5">
            {plan.id === "firm" && (
              <div>
                <label className="label" htmlFor="seats">
                  Seats
                </label>
                <input id="seats" type="number" min={5} value={seats} onChange={(e) => setSeats(Math.max(5, +e.target.value))} className="field tnum" />
                <p className="mt-1 text-xs text-faint">Minimum 5 seats.</p>
              </div>
            )}
            <fieldset>
              <legend className="label">Payment method</legend>
              <div className="grid grid-cols-2 gap-2">
                {methods.map((m) => (
                  <button
                    key={m}
                    onClick={() => setMethod(m)}
                    className={cx("rounded-xl border px-3 py-3 text-left text-sm", method === m ? "border-indigo/50 bg-indigo/10" : "border-line bg-tint/[0.035] hover:bg-tint/5")}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="glass-inset space-y-2 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">
                  {plan.name}
                  {plan.id === "firm" && ` × ${seats} seats`}
                </span>
                <span className="tnum">{fmtBDT(total)}</span>
              </div>
              <div className="flex justify-between border-t border-line pt-2 font-semibold">
                <span>Due today</span>
                <span className="tnum">{fmtBDT(total)}</span>
              </div>
            </div>
            <button onClick={pay} disabled={paying} className="btn btn-primary btn-lg w-full">
              {paying ? "Processing payment…" : `Pay ${fmtBDT(total)} with ${method}`}
            </button>
            <p className="text-center text-xs text-faint">Demo checkout. No money is taken.</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
