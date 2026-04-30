"use client";

import Link from "next/link";
import { ArrowUpRight, ListTodo, Sparkles, Clock } from "lucide-react";
import { useEffect, useState } from "react";

const QUOTES = [
  "Progress, not perfection.",
  "One task at a time.",
  "Small wins add up.",
  "Stay focused, stay ahead.",
  "Make today count.",
];

function useTimeGreeting() {
  const [greeting, setGreeting] = useState("Good day");
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = now.getHours();
      setGreeting(h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening");
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  return { greeting, time };
}

export default function DashboardPage() {
  const { greeting, time } = useTimeGreeting();
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setQuoteIdx(i => (i + 1) % QUOTES.length), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>{`
        @keyframes shimmer-x {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes soft-pulse {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
        @keyframes slide-in-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .quote-in { animation: slide-in-up 0.4s ease forwards; }
        .card-hover {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .card-hover:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px oklch(0.55 0.22 280 / 15%);
        }
      `}</style>

      {/* Bento Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-6 grid-rows-[auto_auto_auto] gap-4">

        {/* ── A: Greeting hero — col 1-4 ── */}
        <div className="col-span-4 rounded-3xl p-7 relative overflow-hidden card-hover"
          style={{
            background: "linear-gradient(145deg, oklch(0.20 0.07 285) 0%, oklch(0.16 0.05 300) 100%)",
            border: "1px solid oklch(1 0 0 / 8%)",
          }}>
          {/* Subtle glow blob */}
          <div aria-hidden className="absolute right-0 top-0 w-52 h-52 rounded-full"
            style={{
              background: "radial-gradient(circle, oklch(0.65 0.25 290 / 20%) 0%, transparent 70%)",
              animation: "soft-pulse 5s ease-in-out infinite",
            }} />

          <p className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: "oklch(0.65 0.15 280)" }}>
            {greeting} ✨
          </p>
          <h1 className="text-3xl font-extrabold text-white leading-tight mb-4">
            Ready to tackle<br />your day?
          </h1>

          {/* Live clock */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl"
            style={{ background: "oklch(1 0 0 / 8%)", border: "1px solid oklch(1 0 0 / 10%)" }}>
            <Clock className="w-3.5 h-3.5" style={{ color: "oklch(0.7 0.12 280)" }} />
            <span className="text-sm font-bold" style={{ color: "oklch(0.85 0.06 280)" }}>{time}</span>
          </div>
        </div>

        {/* ── B: Quote card — col 5-6 ── */}
        <div className="col-span-2 rounded-3xl p-6 flex flex-col justify-between card-hover"
          style={{
            background: "oklch(1 0 0)",
            border: "1px solid oklch(0.88 0.02 280)",
            boxShadow: "0 2px 12px oklch(0.55 0.22 280 / 5%)",
          }}>
          <Sparkles className="w-5 h-5 mb-3" style={{ color: "oklch(0.65 0.2 280)" }} />
          <p key={quoteIdx} className="quote-in text-base font-bold leading-snug"
            style={{ color: "oklch(0.25 0.08 280)" }}>
            &ldquo;{QUOTES[quoteIdx]}&rdquo;
          </p>
          <p className="text-xs mt-3" style={{ color: "oklch(0.6 0.05 280)" }}>Daily reminder</p>
        </div>

        {/* ── C: Todo shortcut — col 1-3 ── */}
        <Link href="/dashboard/todos"
          className="col-span-3 rounded-3xl p-6 flex flex-col justify-between group card-hover"
          style={{
            background: "linear-gradient(135deg, oklch(0.55 0.22 280), oklch(0.60 0.22 305))",
            boxShadow: "0 8px 32px oklch(0.55 0.22 280 / 30%)",
          }}>
          <div className="flex items-center justify-between mb-6">
            <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
              <ListTodo className="w-5 h-5 text-white" />
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1">
              <ArrowUpRight className="w-4 h-4 text-white" />
            </div>
          </div>
          <div>
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">Your workspace</p>
            <h2 className="text-xl font-extrabold text-white">My Todo List</h2>
          </div>
        </Link>

        {/* ── D: Gradient strip card — col 4-6 ── */}
        <div className="col-span-3 rounded-3xl p-6 flex flex-col justify-between card-hover"
          style={{
            background: "oklch(0.97 0.01 280)",
            border: "1px solid oklch(0.88 0.02 280)",
          }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: "oklch(0.55 0.1 280)" }}>Today&apos;s vibe</p>
          <div className="space-y-2.5">
            {[
              { label: "Focus", pct: 80, color: "oklch(0.55 0.22 280)" },
              { label: "Energy", pct: 65, color: "oklch(0.7 0.2 40)" },
              { label: "Mood",  pct: 90, color: "oklch(0.65 0.2 160)" },
            ].map(({ label, pct, color }) => (
              <div key={label}>
                <div className="flex justify-between text-xs font-semibold mb-1"
                  style={{ color: "oklch(0.45 0.07 280)" }}>
                  <span>{label}</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: "oklch(0.88 0.02 280)" }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── E: Full-width tip strip ── */}
        <div className="col-span-6 rounded-2xl px-6 py-3.5 flex items-center gap-3"
          style={{
            background: "linear-gradient(90deg, oklch(0.55 0.22 280 / 8%), oklch(0.65 0.2 310 / 6%))",
            border: "1px solid oklch(0.55 0.22 280 / 12%)",
          }}>
          <span className="text-base">💡</span>
          <p className="text-sm font-medium" style={{ color: "oklch(0.42 0.1 280)" }}>
            Tip: Break big tasks into smaller ones — it makes them way less daunting and more satisfying to cross off.
          </p>
        </div>

      </div>
    </>
  );
}