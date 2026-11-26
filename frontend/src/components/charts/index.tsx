"use client";

/* Hand-built SVG charts. Series colours are validated against the white
   chart surface with the dataviz validator:
   S1 #0b93ab, S2 #b02fd1 — CVD ΔE 9.6, normal ΔE 28.8, contrast ≥ 3:1. */

import { useState } from "react";

export const S1 = "#0b93ab";
export const S2 = "#b02fd1";
const GRID = "rgba(27,34,102,0.08)";
const AXIS = "#7a82a5";

function Tip({ x, y, children }: { x: number; y: number; children: React.ReactNode }) {
  return (
    <div
      className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg border border-tint/15 bg-tint/95 px-2.5 py-1.5 text-xs shadow-xl backdrop-blur"
      style={{ left: `${x}%`, top: `calc(${y}% - 8px)` }}
    >
      {children}
    </div>
  );
}

/* ---------- Line / area: one series, crosshair tooltip ---------- */
export function LineChart({
  data,
  height = 180,
  unit = "",
  max,
  label,
}: {
  data: { x: string; y: number }[];
  height?: number;
  unit?: string;
  max?: number;
  label: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 560;
  const H = height;
  const pad = { l: 34, r: 12, t: 12, b: 26 };
  const top = max ?? Math.ceil(Math.max(...data.map((d) => d.y)) * 1.15);
  const xs = (i: number) => pad.l + (i * (W - pad.l - pad.r)) / (data.length - 1);
  const ys = (v: number) => pad.t + (1 - v / top) * (H - pad.t - pad.b);
  const path = data.map((d, i) => `${i ? "L" : "M"}${xs(i)},${ys(d.y)}`).join(" ");
  const area = `${path} L${xs(data.length - 1)},${H - pad.b} L${xs(0)},${H - pad.b} Z`;
  const ticks = [0, top / 2, top];

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={label} onMouseLeave={() => setHover(null)}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={ys(t)} y2={ys(t)} stroke={GRID} />
            <text x={pad.l - 8} y={ys(t) + 4} fontSize="10" fill={AXIS} textAnchor="end">
              {Math.round(t)}
            </text>
          </g>
        ))}
        {data.map((d, i) => (
          <text key={d.x} x={xs(i)} y={H - 8} fontSize="10" fill={AXIS} textAnchor="middle">
            {d.x}
          </text>
        ))}
        <path d={area} fill={S1} fillOpacity="0.1" />
        <path d={path} fill="none" stroke={S1} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {hover !== null && (
          <>
            <line x1={xs(hover)} x2={xs(hover)} y1={pad.t} y2={H - pad.b} stroke="rgba(27,34,102,.25)" strokeDasharray="3 3" />
            <circle cx={xs(hover)} cy={ys(data[hover].y)} r="5" fill={S1} stroke="#ffffff" strokeWidth="2" />
          </>
        )}
        {data.map((d, i) => (
          <rect
            key={i}
            x={xs(i) - (W - pad.l - pad.r) / (data.length - 1) / 2}
            y={0}
            width={(W - pad.l - pad.r) / (data.length - 1)}
            height={H}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
          />
        ))}
      </svg>
      {hover !== null && (
        <Tip x={(xs(hover) / W) * 100} y={(ys(data[hover].y) / H) * 100}>
          <span className="text-muted">{data[hover].x}</span> <span className="tnum font-semibold">{data[hover].y}{unit}</span>
        </Tip>
      )}
    </div>
  );
}

/* ---------- Vertical bars, one series ---------- */
export function BarChart({ data, height = 180, unit = "", label, fmt }: { data: { x: string; y: number }[]; height?: number; unit?: string; label: string; fmt?: (n: number) => string }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 560;
  const H = height;
  const pad = { l: 34, r: 8, t: 12, b: 26 };
  const top = Math.ceil(Math.max(...data.map((d) => d.y)) * 1.15);
  const slot = (W - pad.l - pad.r) / data.length;
  const bw = Math.min(34, slot * 0.56);
  const ys = (v: number) => pad.t + (1 - v / top) * (H - pad.t - pad.b);
  const f = fmt ?? ((n: number) => `${n}${unit}`);
  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={label} onMouseLeave={() => setHover(null)}>
        {[0, top / 2, top].map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={ys(t)} y2={ys(t)} stroke={GRID} />
            <text x={pad.l - 8} y={ys(t) + 4} fontSize="10" fill={AXIS} textAnchor="end">
              {Math.round(t)}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const x = pad.l + i * slot + (slot - bw) / 2;
          const y = ys(d.y);
          const h = H - pad.b - y;
          const r = Math.min(4, h);
          return (
            <g key={d.x} onMouseEnter={() => setHover(i)}>
              <rect x={pad.l + i * slot} y={pad.t} width={slot} height={H - pad.t - pad.b} fill="transparent" />
              <path
                d={`M${x},${H - pad.b} V${y + r} Q${x},${y} ${x + r},${y} H${x + bw - r} Q${x + bw},${y} ${x + bw},${y + r} V${H - pad.b} Z`}
                fill={S1}
                opacity={hover === null || hover === i ? 1 : 0.45}
              />
              <text x={x + bw / 2} y={H - 8} fontSize="10" fill={AXIS} textAnchor="middle">
                {d.x}
              </text>
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <Tip x={((pad.l + hover * slot + slot / 2) / W) * 100} y={(ys(data[hover].y) / H) * 100}>
          <span className="text-muted">{data[hover].x}</span> <span className="tnum font-semibold">{f(data[hover].y)}</span>
        </Tip>
      )}
    </div>
  );
}

/* ---------- Radar: you vs cohort (2 series, legend + table fallback) ---------- */
export function Radar({ data, size = 300 }: { data: { name: string; score: number; cohort: number }[]; size?: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const c = size / 2;
  const R = c - 46;
  const n = data.length;
  const pt = (i: number, v: number) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [c + Math.cos(a) * R * (v / 100), c + Math.sin(a) * R * (v / 100)];
  };
  const poly = (key: "score" | "cohort") => data.map((d, i) => pt(i, d[key]).join(",")).join(" ");
  return (
    <div>
      <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto w-full max-w-[320px]" role="img" aria-label="Skill profile compared with cohort">
        {[25, 50, 75, 100].map((r) => (
          <polygon key={r} points={data.map((_, i) => pt(i, r).join(",")).join(" ")} fill="none" stroke={GRID} />
        ))}
        {data.map((_, i) => {
          const [x, y] = pt(i, 100);
          return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke={GRID} />;
        })}
        <polygon points={poly("cohort")} fill={S2} fillOpacity="0.1" stroke={S2} strokeWidth="2" strokeDasharray="4 3" />
        <polygon points={poly("score")} fill={S1} fillOpacity="0.22" stroke={S1} strokeWidth="2" />
        {data.map((d, i) => {
          const [x, y] = pt(i, d.score);
          const [lx, ly] = pt(i, 122);
          return (
            <g key={d.name} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} className="cursor-default">
              <circle cx={x} cy={y} r={hover === i ? 6 : 4} fill={S1} stroke="#ffffff" strokeWidth="2" />
              <circle cx={x} cy={y} r="14" fill="transparent" />
              <text x={lx} y={ly + 4} fontSize="10.5" fill={hover === i ? "#0f1433" : "#4a5276"} textAnchor="middle">
                {d.name}
              </text>
              {hover === i && (
                <text x={lx} y={ly + 17} fontSize="10" fill="#0f1433" textAnchor="middle" className="tnum">
                  {d.score} vs {d.cohort}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex items-center justify-center gap-5 text-xs text-muted">
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-4 rounded" style={{ background: S1 }} /> You
        </span>
        <span className="flex items-center gap-2">
          <span className="h-0 w-4 border-t-2 border-dashed" style={{ borderColor: S2 }} /> Cohort average
        </span>
      </div>
    </div>
  );
}

/* ---------- Ring: single headline percentage ---------- */
export function Ring({ value, size = 120, stroke = 10, label, color = S1 }: { value: number; size?: number; stroke?: number; label?: string; color?: string }) {
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" role="img" aria-label={`${label ?? "Value"} ${value}%`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(27,34,102,.08)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - value / 100)}
          style={{ transition: "stroke-dashoffset .8s ease" }}
        />
      </svg>
      <span className="tnum font-display absolute text-xl font-semibold">{value}%</span>
    </div>
  );
}

/* ---------- Horizontal bar list (ranked magnitudes) ---------- */
export function BarList({ data, unit = "%", max = 100 }: { data: { name: string; value: number; hint?: string }[]; unit?: string; max?: number }) {
  return (
    <ul className="space-y-3">
      {data.map((d) => (
        <li key={d.name}>
          <div className="mb-1 flex justify-between text-[0.82rem]">
            <span className="text-text">{d.name}</span>
            <span className="tnum text-muted">
              {d.value}
              {unit}
              {d.hint && <span className="ml-2 text-faint">{d.hint}</span>}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-tint/8">
            <div className="h-full rounded-full" style={{ width: `${(d.value / max) * 100}%`, background: S1 }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
