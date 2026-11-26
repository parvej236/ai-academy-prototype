"use client";

/* Client-side state standing in for the backend. Persisted to
   localStorage so the demo survives reloads. Replace each action with
   an API call when the backend lands. */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { forumThreads, notificationsSeed, type ForumThread, type PlanId, type Role } from "./data";

export interface User {
  name: string;
  email: string;
  role: Role;
  plan: PlanId;
  org: string;
}

interface Toast {
  id: number;
  text: string;
  tone: "ok" | "warn" | "err";
}

export type Lang = "en" | "bn";

interface State {
  lang: Lang;
  user: User | null;
  enrolled: string[];
  completed: Record<string, string[]>;
  threads: ForumThread[];
  joinedGroups: string[];
  examResults: Record<string, { score: number; at: string }>;
  labResults: Record<string, { score: number; at: string }>;
  registeredLive: string[];
  notifications: typeof notificationsSeed;
}

const initial: State = {
  lang: "en",
  user: null,
  enrolled: ["asycuda-world", "hs-classification", "customs-valuation"],
  completed: {
    "asycuda-world": ["aw-1", "aw-2", "aw-3", "aw-4", "aw-5", "aw-6"],
    "hs-classification": ["hs-1", "hs-2", "hs-3", "hs-4", "hs-5", "hs-6", "hs-7"],
    "customs-valuation": ["cv-1"],
  },
  threads: forumThreads,
  joinedGroups: ["cf-agents", "importers"],
  examResults: { "gir-check": { score: 80, at: "2026-11-21" } },
  labResults: { "laptops-ctg": { score: 72, at: "2026-11-19" } },
  registeredLive: ["budget-2026"],
  notifications: notificationsSeed,
};

export const demoUsers: Record<Role, User> = {
  student: { name: "Nadia Karim", email: "nadia.k@example.com", role: "student", plan: "professional", org: "Karim Traders" },
  mentor: { name: "Shirin Akter", email: "shirin@example.com", role: "mentor", plan: "professional", org: "AI Academy" },
  admin: { name: "Academy Admin", email: "admin@example.com", role: "admin", plan: "firm", org: "Tradevics AI" },
};

interface Ctx extends State {
  ready: boolean;
  setLang: (l: Lang) => void;
  login: (role: Role) => void;
  signup: (name: string, email: string, org: string) => void;
  logout: () => void;
  subscribe: (plan: PlanId) => void;
  enroll: (slug: string) => void;
  toggleLesson: (slug: string, lessonId: string) => void;
  addThread: (t: Pick<ForumThread, "group" | "title" | "body" | "tags">) => string;
  addReply: (threadId: string, body: string) => void;
  voteThread: (threadId: string) => void;
  toggleGroup: (id: string) => void;
  saveExam: (id: string, score: number) => void;
  saveLab: (id: string, score: number) => void;
  toggleLive: (id: string) => void;
  markAllRead: () => void;
  toast: (text: string, tone?: Toast["tone"]) => void;
  toasts: Toast[];
  hasAccess: boolean;
}

const StoreCtx = createContext<Ctx | null>(null);
const KEY = "ai-academy-demo-v1";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [ready, setReady] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const tid = useRef(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from storage once on mount
      if (raw) setState({ ...initial, ...JSON.parse(raw) });
    } catch {
      /* storage unavailable: run with defaults */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = state.lang;
  }, [state.lang]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, ready]);

  const toast = useCallback((text: string, tone: Toast["tone"] = "ok") => {
    const id = ++tid.current;
    setToasts((t) => [...t, { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const set = (fn: (s: State) => Partial<State>) => setState((s) => ({ ...s, ...fn(s) }));

  const value: Ctx = useMemo(
    () => ({
      ...state,
      ready,
      toasts,
      toast,
      hasAccess: !!state.user && state.user.plan !== "none",
      setLang: (lang) => set(() => ({ lang })),
      login: (role) => set(() => ({ user: demoUsers[role] })),
      signup: (name, email, org) => set(() => ({ user: { name, email, org, role: "student", plan: "none" } })),
      logout: () => set(() => ({ user: null })),
      subscribe: (plan) => set((s) => ({ user: s.user ? { ...s.user, plan } : s.user })),
      enroll: (slug) => set((s) => ({ enrolled: s.enrolled.includes(slug) ? s.enrolled : [...s.enrolled, slug] })),
      toggleLesson: (slug, lessonId) =>
        set((s) => {
          const cur = s.completed[slug] ?? [];
          const next = cur.includes(lessonId) ? cur.filter((x) => x !== lessonId) : [...cur, lessonId];
          return { completed: { ...s.completed, [slug]: next } };
        }),
      addThread: (t) => {
        const id = "t" + Date.now();
        set((s) => ({
          threads: [
            {
              ...t,
              id,
              author: s.user?.name ?? "You",
              role: s.user?.role === "mentor" ? "Mentor" : "Member",
              at: new Date().toISOString(),
              votes: 0,
              views: 1,
              replies: [],
            },
            ...s.threads,
          ],
        }));
        return id;
      },
      addReply: (threadId, body) =>
        set((s) => ({
          threads: s.threads.map((t) =>
            t.id === threadId
              ? {
                  ...t,
                  replies: [
                    ...t.replies,
                    { id: "r" + Date.now(), author: s.user?.name ?? "You", role: "Member", body, at: new Date().toISOString(), votes: 0 },
                  ],
                }
              : t,
          ),
        })),
      voteThread: (threadId) => set((s) => ({ threads: s.threads.map((t) => (t.id === threadId ? { ...t, votes: t.votes + 1 } : t)) })),
      toggleGroup: (id) =>
        set((s) => ({ joinedGroups: s.joinedGroups.includes(id) ? s.joinedGroups.filter((g) => g !== id) : [...s.joinedGroups, id] })),
      saveExam: (id, score) => set((s) => ({ examResults: { ...s.examResults, [id]: { score, at: new Date().toISOString() } } })),
      saveLab: (id, score) => set((s) => ({ labResults: { ...s.labResults, [id]: { score, at: new Date().toISOString() } } })),
      toggleLive: (id) =>
        set((s) => ({
          registeredLive: s.registeredLive.includes(id) ? s.registeredLive.filter((x) => x !== id) : [...s.registeredLive, id],
        })),
      markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
    }),
    [state, ready, toasts, toast],
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore outside StoreProvider");
  return c;
}
