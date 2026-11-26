"use client";

import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import { Paywall } from "@/components/shell/portal";
import { Badge, PageHeader, scoreTone } from "@/components/ui";
import { getCourse, labCases } from "@/lib/data";
import { useStore } from "@/lib/store";

const diffTone = { Easy: "mint", Medium: "amber", Hard: "rose" } as const;

export default function Lab() {
  const { labResults } = useStore();
  const list = labCases.filter((c) => c.status === "published");
  return (
    <>
      <PageHeader
        title="Practical lab"
        sub="Real consignments, real documents. The Simulator Agent plays the officer; the Evaluation Engine scores each answer against the examiner's rubric."
      />
      <Paywall what="The practical lab">
        <div className="grid gap-4 lg:grid-cols-2">
          {list.map((c) => {
            const r = labResults[c.id];
            return (
              <article key={c.id} className="glass flex flex-col p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={diffTone[c.difficulty]}>{c.difficulty}</Badge>
                  <Badge>{getCourse(c.course)?.category}</Badge>
                  {r && (
                    <Badge tone={scoreTone(r.score)} className="ml-auto">
                      Best {r.score}%
                    </Badge>
                  )}
                </div>
                <h2 className="font-display mt-4 text-lg font-semibold">{c.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{c.brief}</p>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-faint">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} /> {c.port}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} /> About {c.minutes} min
                  </span>
                  <span className="tnum">Average score {c.avgScore}%</span>
                </div>
                <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-5 mt-6">
                  <p className="text-xs text-faint">Marked on {c.criteria.map((x) => x.name.toLowerCase()).join(", ")}</p>
                  <Link href={`/app/lab/${c.id}`} className="btn btn-primary btn-sm shrink-0">
                    {r ? "Try again" : "Start case"}
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </Paywall>
    </>
  );
}
