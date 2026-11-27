"use client";

import Link from "next/link";
import { useState } from "react";
import { Paywall } from "@/components/shell/portal";
import { Badge, PageHeader, Tabs, scoreTone } from "@/components/ui";
import { exams, fmtDate, getCourse, type Exam } from "@/lib/data";
import { useStore } from "@/lib/store";

const kinds = ["All", "Quiz", "Mock exam", "Final exam", "Case study", "Viva"] as const;

export default function Exams() {
  const { examResults } = useStore();
  const [k, setK] = useState<(typeof kinds)[number]>("All");
  const list = exams.filter((e) => e.status !== "draft").filter((e) => k === "All" || e.kind === k);
  return (
    <>
      <PageHeader title="Exams" sub="Quizzes, mock papers, finals, case studies and the viva board. The Examiner Agent draws a fresh set from the question bank on every attempt." />
      <Paywall what="Exams">
        <Tabs className="mb-5" value={k} onChange={setK} tabs={kinds.map((x) => ({ id: x, label: x }))} />
        {/* phones: one card per exam */}
        <ul className="space-y-3 sm:hidden">
          {list.map((e: Exam) => {
            const r = examResults[e.id];
            return (
              <li key={e.id} className="glass p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold leading-snug">{e.title}</p>
                    <p className="mt-0.5 text-xs text-faint">{getCourse(e.course)?.title}</p>
                  </div>
                  <Badge tone={e.kind === "Viva" ? "orchid" : e.kind === "Final exam" ? "indigo" : "neutral"}>{e.kind}</Badge>
                </div>
                <p className="tnum mt-3 text-sm text-muted">
                  {e.questions} {e.kind === "Viva" ? "prompts" : "questions"}, {e.minutes} min, pass {e.passMark}%
                </p>
                <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
                  <div className="text-xs text-faint">
                    {e.due ? `Due ${fmtDate(e.due)}` : "Any time"}
                    {r && (
                      <span className="ml-2">
                        <Badge tone={scoreTone(r.score)}>{r.score}%</Badge>
                      </span>
                    )}
                  </div>
                  <Link href={`/app/exams/${e.id}`} className={e.status === "scheduled" ? "btn btn-glass btn-sm" : "btn btn-primary btn-sm"}>
                    {e.status === "scheduled" ? "Practise" : r ? "Retake" : "Start"}
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="glass hidden overflow-x-auto sm:block">
          <table className="tbl">
            <thead>
              <tr>
                <th>Assessment</th>
                <th>Type</th>
                <th>Format</th>
                <th>Due</th>
                <th>Your result</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {list.map((e: Exam) => {
                const r = examResults[e.id];
                return (
                  <tr key={e.id}>
                    <td>
                      <p className="font-medium">{e.title}</p>
                      <p className="text-xs text-faint">{getCourse(e.course)?.title}</p>
                    </td>
                    <td>
                      <Badge tone={e.kind === "Viva" ? "orchid" : e.kind === "Final exam" ? "indigo" : "neutral"}>{e.kind}</Badge>
                    </td>
                    <td className="tnum whitespace-nowrap text-muted">
                      {e.questions} {e.kind === "Viva" ? "prompts" : "questions"}, {e.minutes} min, pass {e.passMark}%
                    </td>
                    <td className="whitespace-nowrap text-muted">{e.due ? fmtDate(e.due) : "Any time"}</td>
                    <td>{r ? <Badge tone={scoreTone(r.score)}>{r.score}%</Badge> : <span className="text-faint">Not attempted</span>}</td>
                    <td className="text-right">
                      {e.status === "scheduled" ? (
                        <Link href={`/app/exams/${e.id}`} className="btn btn-glass btn-sm">
                          Practise
                        </Link>
                      ) : (
                        <Link href={`/app/exams/${e.id}`} className="btn btn-primary btn-sm">
                          {r ? "Retake" : "Start"}
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-faint">The viva board is graded on its scheduled date. Until then, practice attempts are scored but not recorded on your transcript.</p>
      </Paywall>
    </>
  );
}
