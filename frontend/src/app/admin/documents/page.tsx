"use client";

import { useRef, useState } from "react";
import { FileText, Folder, History, Trash2, Upload } from "lucide-react";
import { PageHeader, cx } from "@/components/ui";
import { documents as seed, fmtDate } from "@/lib/data";
import { useStore } from "@/lib/store";

const access = ["All students", "HS course", "Examiners only", "Mentors only"];

export default function Documents() {
  const { toast } = useStore();
  const [docs, setDocs] = useState(seed);
  const [folder, setFolder] = useState("All");
  const file = useRef<HTMLInputElement>(null);
  const folders = ["All", ...new Set(seed.map((d) => d.folder))];
  const rows = docs.filter((d) => folder === "All" || d.folder === folder);

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setDocs([{ id: "d" + Date.now(), name: f.name, folder: folder === "All" ? "Course material" : folder, size: `${(f.size / 1048576).toFixed(1)} MB`, updated: new Date().toISOString(), access: "All students", version: 1 }, ...docs]);
    toast(`Uploaded ${f.name}`);
    e.target.value = "";
  };

  return (
    <>
      <PageHeader
        title="Documents"
        sub="Legislation, tariff files, handouts and answer keys, with version history and access control."
        actions={
          <>
            <input ref={file} type="file" className="hidden" onChange={onUpload} />
            <button className="btn btn-primary btn-sm" onClick={() => file.current?.click()}>
              <Upload size={15} /> Upload document
            </button>
          </>
        }
      />
      <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
        <aside className="glass h-fit p-2">
          {folders.map((f) => (
            <button key={f} onClick={() => setFolder(f)} className={cx("flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm", folder === f ? "bg-tint/[0.06] font-semibold" : "text-muted hover:bg-tint/[0.03]")}>
              <Folder size={15} className="text-faint" />
              <span className="flex-1">{f}</span>
              <span className="tnum text-xs text-faint">{f === "All" ? docs.length : docs.filter((d) => d.folder === f).length}</span>
            </button>
          ))}
        </aside>
        <div className="glass overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr>
                <th>Name</th>
                <th>Folder</th>
                <th>Size</th>
                <th>Version</th>
                <th>Updated</th>
                <th>Who can see it</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((d) => (
                <tr key={d.id}>
                  <td>
                    <span className="flex items-center gap-2.5 font-medium">
                      <FileText size={16} className="shrink-0 text-indigo" /> {d.name}
                    </span>
                  </td>
                  <td className="text-muted">{d.folder}</td>
                  <td className="tnum text-muted">{d.size}</td>
                  <td className="tnum text-muted">v{d.version}</td>
                  <td className="whitespace-nowrap text-muted">{fmtDate(d.updated)}</td>
                  <td>
                    <select
                      className="field !h-8 !w-40 !text-xs"
                      value={d.access}
                      onChange={(e) => {
                        setDocs(docs.map((x) => (x.id === d.id ? { ...x, access: e.target.value } : x)));
                        toast(`Access changed to ${e.target.value}`);
                      }}
                      aria-label="Access"
                    >
                      {access.map((a) => (
                        <option key={a}>{a}</option>
                      ))}
                    </select>
                  </td>
                  <td className="whitespace-nowrap text-right">
                    <button className="btn btn-ghost btn-sm !px-2" onClick={() => toast(`${d.version} versions on file. Latest by Content editor.`)} aria-label="Version history">
                      <History size={15} />
                    </button>
                    <button
                      className="btn btn-ghost btn-sm !px-2 hover:!text-rose"
                      onClick={() => {
                        setDocs(docs.filter((x) => x.id !== d.id));
                        toast(`Moved ${d.name} to trash`, "warn");
                      }}
                      aria-label="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
