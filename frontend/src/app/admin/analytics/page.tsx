"use client";

import { useState } from "react";
import { BarChart, BarList, LineChart } from "@/components/charts";
import { Badge, PageHeader, Panel, PanelHead, Stat, Tabs, scoreTone } from "@/components/ui";
import { exams, questionBank } from "@/lib/data";

const distribution = [
  { x: "0–20", y: 18 },
  { x: "20–40", y: 64 },
  { x: "40–60", y: 210 },
  { x: "60–80", y: 388 },
  { x: "80–100", y: 172 },
];
const topicPerf = [
  { name: "Procedures", value: 81 },
  { name: "Classification", value: 72 },
  { name: "Customs Act", value: 68 },
  { name: "VAT & SD", value: 61 },
  { name: "Valuation", value: 57 },
  { name: "Origin", value: 52 },
];
const viva = [
  { panel: "Batch A, 18 Nov", candidates: 24, avg: 66, pass: 71, strongest: "Procedures", weakest: "Licence suspension" },
  { panel: "Batch B, 11 Nov", candidates: 19, avg: 61, pass: 63, strongest: "Bill of Entry", weakest: "Provisional assessment" },
  { panel: "Batch C, 4 Nov", candidates: 22, avg: 69, pass: 77, strongest: "Duty stack", weakest: "Section 82" },
];
const feedback = [
  { name: "Questions were clear", value: 86 },
  { name: "Feedback helped me improve", value: 79 },
  { name: "Time was enough", value: 64 },
  { name: "Lab felt like a real assessment", value: 88 },
];

export default function Analytics() {
  const [exam, setExam] = useState(exams[1].id);
  const [tab, setTab] = useState<"exams" | "items" | "viva" | "feedback">("exams");
  // Dummy item statistics: stable per question, harder items answered correctly less often.
  const items = questionBank.map((q) => {
    const h = [...q.id].reduce((a, ch) => a * 31 + ch.charCodeAt(0), 7);
    const base = q.difficulty === "Easy" ? 82 : q.difficulty === "Medium" ? 63 : 41;
    return { ...q, pCorrect: Math.max(18, Math.min(96, base + ((h % 21) - 10))), discrimination: Math.round((0.08 + ((h >> 3) % 46) / 100) * 100) / 100 };
  });

  return (
    <>
      <PageHeader
        title="Analytics"
        sub="Exam results, question quality, viva-board performance and learner feedback."
        actions={
          <select className="field !h-9 !w-60" value={exam} onChange={(e) => setExam(e.target.value)} aria-label="Exam">
            {exams.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Attempts" value="852" foot="Last 30 days" />
        <Stat label="Average score" value="64%" delta={{ v: "+3", up: true }} />
        <Stat label="Pass rate" value="71%" foot="Pass mark 65%" />
        <Stat label="Median time" value="16 min" foot="of 20 allowed" />
      </div>
      <Tabs
        className="my-5"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "exams", label: "Results" },
          { id: "items", label: "Question analysis" },
          { id: "viva", label: "Viva board" },
          { id: "feedback", label: "Feedback" },
        ]}
      />
      {tab === "exams" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Panel>
            <PanelHead title="Score distribution" meta="Number of attempts by score band" />
            <div className="px-4 pb-4">
              <BarChart data={distribution} label="Score distribution" />
            </div>
          </Panel>
          <Panel>
            <PanelHead title="Average score by topic" meta="Where learners lose marks" />
            <div className="px-5 pb-5">
              <BarList data={topicPerf} />
            </div>
          </Panel>
          <Panel className="lg:col-span-2">
            <PanelHead title="Pass rate over time" meta="Weekly, %" />
            <div className="px-4 pb-4">
              <LineChart
                data={["W38", "W39", "W40", "W41", "W42", "W43", "W44", "W45", "W46"].map((w, i) => ({ x: w, y: [58, 61, 63, 62, 66, 68, 67, 70, 71][i] }))}
                unit="%"
                max={100}
                label="Pass rate over time"
              />
            </div>
          </Panel>
        </div>
      )}
      {tab === "items" && (
        <Panel>
          <PanelHead title="Question analysis" meta="Items answered correctly by under 40% or with discrimination below 0.2 should be reviewed" />
          <div className="overflow-x-auto">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Topic</th>
                  <th>% correct</th>
                  <th>Discrimination</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((q) => {
                  const review = q.pCorrect < 40 || q.discrimination < 0.2;
                  return (
                    <tr key={q.id}>
                      <td className="max-w-md">{q.text}</td>
                      <td className="text-muted">{q.topic}</td>
                      <td>
                        <Badge tone={scoreTone(q.pCorrect)}>{q.pCorrect}%</Badge>
                      </td>
                      <td className="tnum text-muted">{q.discrimination.toFixed(2)}</td>
                      <td>{review ? <Badge tone="amber">Review</Badge> : <span className="text-faint">OK</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
      {tab === "viva" && (
        <Panel>
          <PanelHead title="Viva-board performance" meta="Scored by the Evaluation Engine, moderated by the examiner panel" />
          <div className="overflow-x-auto">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Board</th>
                  <th>Candidates</th>
                  <th>Average</th>
                  <th>Pass rate</th>
                  <th>Strongest topic</th>
                  <th>Weakest topic</th>
                </tr>
              </thead>
              <tbody>
                {viva.map((v) => (
                  <tr key={v.panel}>
                    <td className="font-medium">{v.panel}</td>
                    <td className="tnum text-muted">{v.candidates}</td>
                    <td>
                      <Badge tone={scoreTone(v.avg)}>{v.avg}%</Badge>
                    </td>
                    <td className="tnum text-muted">{v.pass}%</td>
                    <td className="text-muted">{v.strongest}</td>
                    <td className="text-muted">{v.weakest}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
      {tab === "feedback" && (
        <div className="grid gap-5 lg:grid-cols-2">
          <Panel>
            <PanelHead title="Learner feedback" meta="% agree, 1,204 responses" />
            <div className="px-5 pb-5">
              <BarList data={feedback} />
            </div>
          </Panel>
          <Panel>
            <PanelHead title="Recent comments" />
            <ul className="space-y-3 px-5 pb-5 text-sm text-muted">
              <li className="glass-inset p-3.5">&ldquo;The laptop case felt exactly like my last assessment at Chattogram.&rdquo;</li>
              <li className="glass-inset p-3.5">&ldquo;Mock paper 1 needs five more minutes. The valuation questions are long.&rdquo;</li>
              <li className="glass-inset p-3.5">&ldquo;Viva feedback told me which section I forgot. Very useful.&rdquo;</li>
            </ul>
          </Panel>
        </div>
      )}
    </>
  );
}
