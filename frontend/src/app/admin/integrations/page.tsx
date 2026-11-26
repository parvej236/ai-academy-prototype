"use client";

import { useState } from "react";
import { Copy, KeyRound, Plus } from "lucide-react";
import { Badge, Modal, PageHeader, Panel, PanelHead, Switch } from "@/components/ui";
import { apiKeys as seedKeys, integrations as seedInt } from "@/lib/data";
import { useStore } from "@/lib/store";

const scopes = ["users:read", "users:write", "subscriptions:write", "live:write", "reports:read", "certificates:read"];

export default function Integrations() {
  const { toast } = useStore();
  const [keys, setKeys] = useState(seedKeys);
  const [ints, setInts] = useState(seedInt);
  const [open, setOpen] = useState(false);
  const [d, setD] = useState({ name: "", scopes: ["reports:read"] as string[] });
  const [secret, setSecret] = useState("");

  const create = (e: React.FormEvent) => {
    e.preventDefault();
    if (!d.name.trim()) return;
    const s = "tva_live_" + Array.from({ length: 32 }, () => "abcdef0123456789"[Math.floor(Math.random() * 16)]).join("");
    setKeys([{ id: "k" + Date.now(), name: d.name, prefix: s.slice(0, 13), scopes: d.scopes, created: new Date().toISOString().slice(0, 10), lastUsed: "Never" }, ...keys]);
    setSecret(s);
  };

  const groups = [...new Set(ints.map((i) => i.kind))];

  return (
    <>
      <PageHeader
        title="API keys and integrations"
        sub="Keys for Tradevics AI and other systems, plus the payment, meeting and messaging services the academy uses."
        actions={
          <button className="btn btn-primary btn-sm" onClick={() => { setOpen(true); setSecret(""); setD({ name: "", scopes: ["reports:read"] }); }}>
            <Plus size={15} /> Create API key
          </button>
        }
      />
      <Panel>
        <PanelHead title="API keys" />
        <div className="overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr>
                <th>Name</th>
                <th>Key</th>
                <th>Scopes</th>
                <th>Created</th>
                <th>Last used</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr key={k.id}>
                  <td className="font-medium">
                    <span className="flex items-center gap-2">
                      <KeyRound size={14} className="text-faint" /> {k.name}
                    </span>
                  </td>
                  <td className="tnum text-muted">{k.prefix}••••••••</td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {k.scopes.map((s) => (
                        <Badge key={s}>{s}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="tnum text-muted">{k.created}</td>
                  <td className="text-muted">{k.lastUsed}</td>
                  <td className="whitespace-nowrap text-right">
                    <button className="btn btn-ghost btn-sm" onClick={() => toast(`${k.name} rotated. Update the key where it's used within 24 hours.`, "warn")}>
                      Rotate
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => { setKeys(keys.filter((x) => x.id !== k.id)); toast(`${k.name} revoked`, "warn"); }}>
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((g) => (
          <Panel key={g}>
            <PanelHead title={g} />
            <ul className="divide-y divide-line">
              {ints
                .filter((i) => i.kind === g)
                .map((i) => (
                  <li key={i.id} className="flex items-center justify-between gap-3 px-5 py-3.5 text-sm">
                    <span>
                      {i.name}
                      <span className={`ml-2 text-xs ${i.connected ? "text-mint" : "text-faint"}`}>{i.connected ? "Connected" : "Not connected"}</span>
                    </span>
                    <Switch
                      on={i.connected}
                      onChange={(v) => {
                        setInts(ints.map((x) => (x.id === i.id ? { ...x, connected: v } : x)));
                        toast(v ? `${i.name} connected` : `${i.name} disconnected`, v ? "ok" : "warn");
                      }}
                      label={i.name}
                    />
                  </li>
                ))}
            </ul>
          </Panel>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={secret ? "Copy your key now" : "Create API key"}>
        {secret ? (
          <div className="space-y-4">
            <p className="text-sm text-muted">This is the only time the full key is shown. Store it in your secrets manager.</p>
            <div className="glass-inset flex items-center gap-2 p-3">
              <code className="min-w-0 flex-1 break-all text-sm">{secret}</code>
              <button
                className="btn btn-glass btn-sm !px-2"
                onClick={() => {
                  navigator.clipboard?.writeText(secret).catch(() => {});
                  toast("Key copied");
                }}
                aria-label="Copy key"
              >
                <Copy size={14} />
              </button>
            </div>
            <button className="btn btn-primary w-full" onClick={() => setOpen(false)}>
              I&apos;ve stored it
            </button>
          </div>
        ) : (
          <form onSubmit={create} className="space-y-4">
            <div>
              <label className="label">Name</label>
              <input className="field" value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} placeholder="What will use this key?" />
            </div>
            <fieldset>
              <legend className="label">Scopes</legend>
              <div className="grid grid-cols-2 gap-2">
                {scopes.map((s) => (
                  <label key={s} className="glass-inset flex items-center gap-2 px-3 py-2 text-sm">
                    <input
                      type="checkbox"
                      checked={d.scopes.includes(s)}
                      onChange={() => setD({ ...d, scopes: d.scopes.includes(s) ? d.scopes.filter((x) => x !== s) : [...d.scopes, s] })}
                      className="accent-[var(--indigo)]"
                    />
                    {s}
                  </label>
                ))}
              </div>
            </fieldset>
            <button className="btn btn-primary w-full">Create key</button>
          </form>
        )}
      </Modal>
    </>
  );
}
