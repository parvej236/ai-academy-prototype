/* Flat vector illustrations for AI Academy.
   Drawn for the customs-and-trade subject (containers, invoices, the
   assessing officer, the port). Brand palette only, no gradients, a 45°
   diamond motif that echoes the Tradevics mark. All decorative: they
   carry aria-hidden and sit beside text that says the same thing. */

const C = {
  navy: "#0f1433",
  ink: "#2a3166",
  indigo: "#4646e8",
  indigoSoft: "#dcdcfc",
  cyan: "#0b93ab",
  cyanSoft: "#cdeff4",
  orchid: "#b02fd1",
  orchidSoft: "#f1d9f8",
  amber: "#f2a93b",
  mint: "#0f9a68",
  paper: "#f5f6fa",
  line: "#dadded",
  white: "#ffffff",
};

type P = { className?: string };

const Diamond = ({ x, y, s, fill }: { x: number; y: number; s: number; fill: string }) => (
  <rect x={x - s / 2} y={y - s / 2} width={s} height={s} rx={s * 0.22} transform={`rotate(45 ${x} ${y})`} fill={fill} />
);

/* ---------- Learn: laptop lesson + tariff book ---------- */
export function LearnArt({ className }: P) {
  return (
    <svg viewBox="0 0 320 200" className={className} aria-hidden fill="none">
      <rect x="0" y="0" width="320" height="200" rx="18" fill={C.paper} />
      <Diamond x={276} y={40} s={26} fill={C.indigoSoft} />
      {/* laptop */}
      <rect x="62" y="44" width="150" height="96" rx="8" fill={C.navy} />
      <rect x="70" y="52" width="134" height="80" rx="4" fill={C.white} />
      <rect x="70" y="52" width="134" height="80" rx="4" fill={C.indigoSoft} opacity=".55" />
      <circle cx="137" cy="88" r="17" fill={C.indigo} />
      <path d="M132 79 L146 88 L132 97 Z" fill={C.white} />
      <rect x="78" y="118" width="118" height="4" rx="2" fill={C.white} />
      <rect x="78" y="118" width="70" height="4" rx="2" fill={C.cyan} />
      <path d="M44 140 H230 L220 152 H54 Z" fill={C.ink} />
      {/* tariff book */}
      <rect x="214" y="78" width="62" height="78" rx="6" fill={C.white} stroke={C.line} strokeWidth="2" />
      <rect x="214" y="78" width="10" height="78" rx="3" fill={C.cyan} />
      <rect x="232" y="92" width="34" height="5" rx="2.5" fill={C.navy} />
      {[106, 116, 126, 136].map((y, i) => (
        <rect key={y} x="232" y={y} width={i % 2 ? 22 : 30} height="4" rx="2" fill={C.line} />
      ))}
      <text x="232" y="150" fontSize="9" fontWeight="700" fill={C.cyan} fontFamily="Inter, sans-serif">
        84.71
      </text>
    </svg>
  );
}

/* ---------- Lab: container, invoice under a magnifier, officer bubble ---------- */
export function LabArt({ className }: P) {
  return (
    <svg viewBox="0 0 320 200" className={className} aria-hidden fill="none">
      <rect x="0" y="0" width="320" height="200" rx="18" fill={C.paper} />
      {/* container */}
      <rect x="34" y="96" width="132" height="66" rx="5" fill={C.cyan} />
      {[50, 66, 82, 98, 114, 130, 146].map((x) => (
        <rect key={x} x={x} y="104" width="6" height="50" rx="2" fill="#0a7f94" />
      ))}
      <rect x="34" y="96" width="132" height="8" rx="3" fill="#0a7f94" />
      <rect x="44" y="168" width="112" height="4" rx="2" fill={C.line} />
      {/* invoice */}
      <rect x="150" y="52" width="86" height="104" rx="7" fill={C.white} stroke={C.line} strokeWidth="2" />
      <rect x="162" y="66" width="40" height="6" rx="3" fill={C.navy} />
      {[82, 94, 106, 118].map((y, i) => (
        <g key={y}>
          <rect x="162" y={y} width="34" height="4" rx="2" fill={C.line} />
          <rect x={206} y={y} width={i === 2 ? 20 : 16} height="4" rx="2" fill={i === 2 ? C.amber : C.line} />
        </g>
      ))}
      <rect x="162" y="134" width="62" height="10" rx="5" fill={C.orchidSoft} />
      {/* magnifier */}
      <circle cx="222" cy="112" r="22" fill={C.white} fillOpacity=".55" stroke={C.navy} strokeWidth="6" />
      <path d="M238 128 L258 148" stroke={C.navy} strokeWidth="8" strokeLinecap="round" />
      {/* officer bubble */}
      <rect x="224" y="24" width="72" height="34" rx="12" fill={C.indigo} />
      <path d="M240 58 L236 68 L250 58 Z" fill={C.indigo} />
      <rect x="236" y="35" width="40" height="4" rx="2" fill={C.white} />
      <rect x="236" y="44" width="26" height="4" rx="2" fill={C.indigoSoft} />
      <Diamond x={60} y={50} s={20} fill={C.orchidSoft} />
    </svg>
  );
}

/* ---------- Exam: clipboard with answers + timer ---------- */
export function ExamArt({ className }: P) {
  return (
    <svg viewBox="0 0 320 200" className={className} aria-hidden fill="none">
      <rect x="0" y="0" width="320" height="200" rx="18" fill={C.paper} />
      <Diamond x={52} y={154} s={24} fill={C.cyanSoft} />
      {/* clipboard */}
      <rect x="92" y="34" width="112" height="140" rx="10" fill={C.ink} />
      <rect x="100" y="44" width="96" height="124" rx="6" fill={C.white} />
      <rect x="126" y="28" width="44" height="16" rx="5" fill={C.indigo} />
      {[64, 92, 120, 148].map((y, i) => (
        <g key={y}>
          <rect x="110" y={y - 8} width="14" height="14" rx="4" fill={i === 2 ? C.white : C.indigo} stroke={C.indigo} strokeWidth="2" />
          {i !== 2 && <path d={`M113 ${y - 1} l3 3 l6 -7`} stroke={C.white} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />}
          <rect x="132" y={y - 5} width={i % 2 ? 42 : 54} height="5" rx="2.5" fill={C.navy} opacity=".85" />
          <rect x="132" y={y + 3} width="30" height="3" rx="1.5" fill={C.line} />
        </g>
      ))}
      {/* timer */}
      <circle cx="238" cy="78" r="34" fill={C.white} stroke={C.line} strokeWidth="3" />
      <circle cx="238" cy="78" r="26" stroke={C.cyanSoft} strokeWidth="7" />
      <path d="M238 52 A26 26 0 1 1 214 88" stroke={C.cyan} strokeWidth="7" strokeLinecap="round" />
      <rect x="232" y="36" width="12" height="8" rx="2" fill={C.ink} />
      <path d="M238 78 L238 64" stroke={C.navy} strokeWidth="3" strokeLinecap="round" />
      <path d="M238 78 L248 84" stroke={C.navy} strokeWidth="3" strokeLinecap="round" />
      {/* score chip */}
      <rect x="214" y="128" width="64" height="28" rx="14" fill={C.mint} />
      <text x="246" y="147" textAnchor="middle" fontSize="13" fontWeight="700" fill={C.white} fontFamily="Inter, sans-serif">
        86%
      </text>
    </svg>
  );
}

/* ---------- Certify: certificate with diamond seal ---------- */
export function CertifyArt({ className }: P) {
  return (
    <svg viewBox="0 0 320 200" className={className} aria-hidden fill="none">
      <rect x="0" y="0" width="320" height="200" rx="18" fill={C.paper} />
      <rect x="54" y="38" width="196" height="132" rx="10" fill={C.white} stroke={C.line} strokeWidth="2" />
      <rect x="64" y="48" width="176" height="112" rx="6" stroke={C.indigoSoft} strokeWidth="2" />
      <rect x="84" y="66" width="56" height="5" rx="2.5" fill={C.line} />
      <rect x="84" y="82" width="108" height="9" rx="4.5" fill={C.navy} />
      <rect x="84" y="98" width="84" height="5" rx="2.5" fill={C.line} />
      <rect x="84" y="108" width="64" height="5" rx="2.5" fill={C.line} />
      <rect x="84" y="138" width="44" height="3" rx="1.5" fill={C.ink} />
      <rect x="140" y="138" width="30" height="3" rx="1.5" fill={C.line} />
      {/* seal */}
      <path d="M212 132 L204 168 L216 160 L222 172 L226 136 Z" fill={C.orchid} />
      <path d="M226 132 L238 166 L240 152 L252 156 L240 130 Z" fill={C.indigo} />
      <Diamond x={224} y={118} s={38} fill={C.indigo} />
      <Diamond x={224} y={118} s={24} fill={C.white} />
      <path d="M216 118 l6 6 l10 -12" stroke={C.indigo} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <Diamond x={276} y={46} s={18} fill={C.cyanSoft} />
    </svg>
  );
}

/* ---------- Live: expert on screen, captions, notes appearing ---------- */
export function LiveArt({ className }: P) {
  return (
    <svg viewBox="0 0 320 200" className={className} aria-hidden fill="none">
      <rect x="0" y="0" width="320" height="200" rx="18" fill={C.paper} />
      <rect x="28" y="30" width="176" height="118" rx="10" fill={C.navy} />
      <circle cx="116" cy="74" r="18" fill={C.orchidSoft} />
      <path d="M84 132 C86 106 146 106 148 132 Z" fill={C.orchid} />
      <rect x="44" y="118" width="144" height="18" rx="6" fill="#000" fillOpacity=".45" />
      <rect x="54" y="125" width="96" height="4" rx="2" fill={C.white} />
      <rect x="40" y="40" width="34" height="14" rx="7" fill="#e5484d" />
      <circle cx="50" cy="47" r="3" fill={C.white} />
      <rect x="56" y="45" width="12" height="4" rx="2" fill={C.white} />
      <rect x="92" y="148" width="48" height="10" fill={C.ink} />
      <rect x="76" y="158" width="80" height="6" rx="3" fill={C.ink} />
      {/* notes card */}
      <rect x="214" y="48" width="80" height="112" rx="8" fill={C.white} stroke={C.line} strokeWidth="2" />
      <rect x="224" y="60" width="36" height="5" rx="2.5" fill={C.navy} />
      {[76, 92, 108, 124].map((y, i) => (
        <g key={y}>
          <rect x="224" y={y} width="6" height="6" rx="3" fill={i < 3 ? C.cyan : C.line} />
          <rect x="236" y={y + 1} width={i % 2 ? 36 : 46} height="4" rx="2" fill={i < 3 ? C.ink : C.line} opacity={i < 3 ? 0.75 : 1} />
        </g>
      ))}
      <Diamond x={254} y={146} s={14} fill={C.orchid} />
    </svg>
  );
}

/* ---------- Port scene: used on dark navy panels ---------- */
export function PortScene({ className }: P) {
  const box = (x: number, y: number, c: string, w = 46) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width={w} height="24" rx="2" fill={c} />
      {[8, 16, 24, 32].filter((d) => d < w - 4).map((d) => (
        <rect key={d} x={x + d} y={y + 4} width="2.5" height="16" fill="#000" fillOpacity=".18" />
      ))}
    </g>
  );
  return (
    <svg viewBox="0 0 480 340" className={className} aria-hidden fill="none">
      {/* sky diamonds */}
      <Diamond x={400} y={62} s={30} fill="#ffffff" />
      <Diamond x={430} y={104} s={14} fill={C.cyan} />
      {/* crane */}
      <rect x="92" y="60" width="10" height="196" fill={C.amber} />
      <rect x="150" y="60" width="10" height="196" fill={C.amber} />
      <rect x="70" y="60" width="250" height="12" fill={C.amber} />
      <path d="M92 110 L160 72 M160 110 L92 72" stroke={C.amber} strokeWidth="4" />
      <rect x="236" y="72" width="3" height="58" fill="#cfd3ea" />
      <rect x="212" y="130" width="52" height="24" rx="2" fill={C.orchid} />
      {/* ship */}
      <path d="M150 262 L430 262 L410 300 L172 300 Z" fill="#ffffff" />
      <rect x="160" y="262" width="270" height="8" fill={C.indigo} />
      {box(184, 214, C.cyan)}
      {box(232, 214, C.indigo)}
      {box(280, 214, "#ffffff")}
      {box(328, 214, C.cyan)}
      {box(208, 190, "#ffffff")}
      {box(256, 190, C.cyan)}
      {box(304, 190, C.indigo)}
      {box(232, 238, C.orchid)}
      {box(280, 238, C.cyan)}
      {box(328, 238, C.indigo)}
      {box(184, 238, "#ffffff")}
      <rect x="378" y="176" width="34" height="62" rx="3" fill="#ffffff" />
      {[186, 198, 210].map((y) => (
        <rect key={y} x="384" y={y} width="22" height="6" rx="2" fill={C.navy} opacity=".7" />
      ))}
      {/* quay stacks */}
      {box(18, 232, C.indigo)}
      {box(18, 208, C.cyan)}
      {box(66, 232, "#ffffff")}
      {/* water */}
      {[312, 326].map((y, i) => (
        <path key={y} d={`M${20 + i * 30} ${y} H${440 - i * 40}`} stroke="#ffffff" strokeOpacity=".25" strokeWidth="3" strokeLinecap="round" strokeDasharray="22 14" />
      ))}
    </svg>
  );
}

/* ---------- Small spot for empty states ---------- */
export function EmptyArt({ className }: P) {
  return (
    <svg viewBox="0 0 120 90" className={className} aria-hidden fill="none">
      <path d="M20 40 L60 22 L100 40 L60 58 Z" fill={C.indigoSoft} />
      <path d="M20 40 L60 58 L60 82 L20 64 Z" fill="#c5c5f7" />
      <path d="M100 40 L60 58 L60 82 L100 64 Z" fill="#b3b3f3" />
      <path d="M20 40 L8 30 L48 12 L60 22 Z" fill="#e8e8fd" />
      <path d="M100 40 L112 30 L72 12 L60 22 Z" fill="#e8e8fd" />
      <Diamond x={60} y={8} s={8} fill={C.cyan} />
    </svg>
  );
}

/* ---------- 404: container with a question mark ---------- */
export function LostArt({ className }: P) {
  return (
    <svg viewBox="0 0 320 200" className={className} aria-hidden fill="none">
      <rect x="40" y="70" width="200" height="96" rx="6" fill={C.cyan} />
      {[60, 80, 100, 120, 140, 160, 180, 200, 220].map((x) => (
        <rect key={x} x={x} y="80" width="7" height="76" rx="2" fill="#0a7f94" />
      ))}
      <rect x="40" y="70" width="200" height="10" rx="4" fill="#0a7f94" />
      <circle cx="140" cy="118" r="30" fill={C.white} />
      <text x="140" y="132" textAnchor="middle" fontSize="40" fontWeight="700" fill={C.navy} fontFamily="Inter, sans-serif">
        ?
      </text>
      <rect x="56" y="172" width="168" height="5" rx="2.5" fill={C.line} />
      <Diamond x={268} y={60} s={30} fill={C.indigoSoft} />
      <Diamond x={284} y={104} s={14} fill={C.orchid} />
    </svg>
  );
}

/* ---------- Category glyphs for course covers (white line art) ---------- */
export function CategoryGlyph({ category, className }: { category: string; className?: string }) {
  const s = { stroke: "#ffffff", strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const g: Record<string, React.ReactNode> = {
    Classification: (
      <g {...s}>
        <path d="M10 18 L28 18 L40 30 L28 42 L10 42 Z" />
        <circle cx="17" cy="30" r="3" />
        <path d="M46 20 H62 M46 30 H58 M46 40 H62" />
      </g>
    ),
    Valuation: (
      <g {...s}>
        <path d="M36 12 V48 M22 48 H50 M14 20 H58" />
        <path d="M14 20 L8 34 H20 Z M58 20 L52 34 H64 Z" />
      </g>
    ),
    Procedures: (
      <g {...s}>
        <rect x="16" y="10" width="34" height="42" rx="4" />
        <path d="M24 22 H42 M24 30 H42 M24 38 H34" />
        <path d="M44 42 l5 5 l9 -11" />
      </g>
    ),
    Tax: (
      <g {...s}>
        <path d="M16 10 H50 V52 L44 48 L38 52 L32 48 L26 52 L20 48 L16 52 Z" />
        <path d="M26 36 L40 22" />
        <circle cx="27" cy="24" r="2.6" />
        <circle cx="39" cy="34" r="2.6" />
      </g>
    ),
    Origin: (
      <g {...s}>
        <circle cx="32" cy="30" r="20" />
        <path d="M12 30 H52 M32 10 C24 20 24 40 32 50 M32 10 C40 20 40 40 32 50" />
      </g>
    ),
    "Trade finance": (
      <g {...s}>
        <path d="M10 22 L32 10 L54 22 Z M14 22 V44 M26 22 V44 M38 22 V44 M50 22 V44 M10 48 H54" />
      </g>
    ),
    "Exam prep": (
      <g {...s}>
        <rect x="16" y="12" width="32" height="40" rx="4" />
        <path d="M26 8 H38 V16 H26 Z" />
        <path d="M23 28 l4 4 l8 -9 M23 42 H41" />
      </g>
    ),
  };
  return (
    <svg viewBox="0 0 64 60" className={className} aria-hidden>
      {g[category] ?? g.Procedures}
    </svg>
  );
}
