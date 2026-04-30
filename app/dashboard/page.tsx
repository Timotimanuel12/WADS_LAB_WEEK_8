"use client";

import Link from "next/link";
import { ArrowUpRight, ListTodo, Sparkles, Clock, Target, Zap, Activity } from "lucide-react";
import { useEffect, useState } from "react";

const QUOTES = [
    "Focus on being productive instead of busy.",
    "The secret of getting ahead is getting started.",
    "Great acts are made up of small deeds.",
    "Simplicity is the ultimate sophistication.",
    "Done is better than perfect.",
];

function useTimeGreeting() {
    const [greeting, setGreeting] = useState("Good day");
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");

    useEffect(() => {
        const update = () => {
            const now = new Date();
            const h = now.getHours();
            setGreeting(h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening");
            setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
            setDate(now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" }));
        };
        update();
        const id = setInterval(update, 30_000);
        return () => clearInterval(id);
    }, []);

    return { greeting, time, date };
}

export default function DashboardPage() {
    const { greeting, time, date } = useTimeGreeting();
    const [quoteIdx, setQuoteIdx] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const id = setInterval(() => setQuoteIdx(i => (i + 1) % QUOTES.length), 6000);
        return () => clearInterval(id);
    }, []);

    if (!mounted) return null;

    return (
        <div className="relative min-h-[80vh]">
            <style>{`
                /* Background Grid Pattern */
                .bg-grid-pattern {
                    background-size: 40px 40px;
                    background-image: linear-gradient(to right, var(--ios-sep) 1px, transparent 1px),
                                      linear-gradient(to bottom, var(--ios-sep) 1px, transparent 1px);
                    mask-image: radial-gradient(circle at center, black 20%, transparent 80%);
                    -webkit-mask-image: radial-gradient(circle at center, black 20%, transparent 80%);
                    opacity: 0.15;
                }

                /* Core Card Styles */
                .dash-card {
                    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1),
                                box-shadow 0.3s ease, border-color 0.3s ease;
                    border: 1px solid var(--ios-sep);
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                    position: relative;
                    overflow: hidden;
                }
                .dash-card::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: inherit;
                    padding: 1px;
                    background: linear-gradient(145deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%);
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    pointer-events: none;
                }
                .dash-card:hover {
                    transform: scale(1.01) translateY(-4px);
                    border-color: rgba(120,120,128,0.3);
                }

                /* Shimmer Text */
                .shimmer-text {
                    background: linear-gradient(90deg, var(--ios-blue) 0%, var(--ios-purple) 30%, var(--ios-teal) 70%, var(--ios-blue) 100%);
                    background-size: 300% auto;
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: shimmer-text 6s linear infinite;
                }
                @keyframes shimmer-text {
                    0%   { background-position: 0% center; }
                    100% { background-position: 300% center; }
                }

                /* Premium Card Shades */
                .shade-hero {
                    background: linear-gradient(160deg, rgba(255,255,255,0.8) 0%, rgba(242,242,247,0.4) 100%);
                    box-shadow: 0 20px 40px -20px rgba(0,122,255,0.15);
                }
                .dark .shade-hero {
                    background: linear-gradient(160deg, rgba(28,28,30,0.8) 0%, rgba(0,0,0,0.4) 100%);
                    box-shadow: 0 20px 40px -20px rgba(10,132,255,0.2);
                }
                
                .shade-glass {
                    background: var(--ios-nav-bg);
                    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
                }
                .dark .shade-glass {
                    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.4);
                }

                /* Intelligence Glow */
                .ai-glow {
                    background: linear-gradient(90deg, rgba(0,122,255,0.08), rgba(175,82,222,0.08), rgba(255,149,0,0.08));
                    background-size: 200% auto;
                    animation: shimmer-text 8s linear infinite;
                }
                .dark .ai-glow {
                    background: linear-gradient(90deg, rgba(10,132,255,0.15), rgba(191,90,242,0.15), rgba(255,159,10,0.15));
                }

                /* Circular Progress */
                .progress-ring__circle {
                    transition: stroke-dashoffset 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                    transform: rotate(-90deg);
                    transform-origin: 50% 50%;
                }

                /* Graph Bars */
                .graph-bar {
                    transition: height 1s cubic-bezier(0.34, 1.56, 0.64, 1);
                    animation: bar-grow 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }
                @keyframes bar-grow {
                    from { height: 0%; opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>

            {/* Ambient Background */}
            <div className="absolute inset-0 z-[-1] overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-grid-pattern" />
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[100px] dark:bg-blue-500/20 mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[100px] dark:bg-purple-500/20 mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger relative z-10">

                {/* ── Hero greeting card ── */}
                <div className="dash-card rounded-[28px] shade-hero animate-spring-in p-8 md:col-span-2 lg:col-span-2 flex flex-col justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ background: "var(--ios-fill-3)" }}>
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <p className="text-[12px] font-semibold tracking-wide uppercase" style={{ color: "var(--ios-label-2)" }}>
                                    {greeting}
                                </p>
                            </div>
                            <h1 className="text-[36px] md:text-[44px] font-extrabold leading-[1.1] tracking-tight" style={{ color: "var(--ios-label)" }}>
                                Ready to master<br />
                                <span className="shimmer-text">your workflow?</span>
                            </h1>
                            <p className="mt-4 text-[15px] font-medium" style={{ color: "var(--ios-label-2)" }}>
                                {date}
                            </p>
                        </div>

                        {/* Productivity Score Ring */}
                        <div className="shrink-0 relative w-32 h-32 flex items-center justify-center">
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                <circle
                                    className="text-gray-200 dark:text-gray-800"
                                    strokeWidth="8"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="42"
                                    cx="50"
                                    cy="50"
                                />
                                <circle
                                    className="progress-ring__circle"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    stroke="url(#gradient)"
                                    fill="transparent"
                                    r="42"
                                    cx="50"
                                    cy="50"
                                    style={{ strokeDasharray: 264, strokeDashoffset: 264 - (264 * 75) / 100 }}
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="var(--ios-blue)" />
                                        <stop offset="100%" stopColor="var(--ios-purple)" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-[24px] font-bold tabular-nums" style={{ color: "var(--ios-label)" }}>75<span className="text-[14px] text-gray-500">%</span></span>
                                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--ios-label-3)" }}>Score</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Action Shortcut ── */}
                <Link href="/dashboard/todos" className="dash-card rounded-[28px] shade-glass animate-spring-in flex flex-col justify-between p-7 group md:col-span-2 lg:col-span-1">
                    <div className="flex justify-between items-start">
                        <div className="w-14 h-14 rounded-[18px] flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105" style={{ background: "linear-gradient(135deg, var(--ios-blue), var(--ios-indigo))" }}>
                            <ListTodo className="w-7 h-7 text-white" />
                        </div>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" style={{ background: "var(--ios-fill-3)" }}>
                            <ArrowUpRight className="w-5 h-5" style={{ color: "var(--ios-label)" }} />
                        </div>
                    </div>
                    <div className="mt-8">
                        <p className="text-[20px] font-bold tracking-tight mb-1" style={{ color: "var(--ios-label)" }}>
                            Task Manager
                        </p>
                        <p className="text-[14px] font-medium" style={{ color: "var(--ios-label-2)" }}>
                            Organize, prioritize, and conquer your to-do list.
                        </p>
                    </div>
                </Link>

                {/* ── Weekly Activity Chart ── */}
                <div className="dash-card rounded-[28px] shade-glass animate-spring-in p-7 md:col-span-1 lg:col-span-1">
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-[12px] font-bold uppercase tracking-widest" style={{ color: "var(--ios-label-3)" }}>
                            Activity
                        </p>
                        <Activity className="w-4 h-4" style={{ color: "var(--ios-blue)" }} />
                    </div>
                    <div className="h-[120px] flex items-end justify-between gap-2">
                        {[40, 70, 45, 90, 60, 85, 30].map((val, i) => (
                            <div key={i} className="relative w-full flex flex-col items-center gap-2 group">
                                <div className="w-full rounded-full bg-gray-200 dark:bg-gray-800 relative overflow-hidden" style={{ height: '100px' }}>
                                    <div 
                                        className="absolute bottom-0 left-0 w-full rounded-full graph-bar"
                                        style={{ height: `${val}%`, background: i === 3 ? 'var(--ios-blue)' : 'var(--ios-fill-2)', animationDelay: `${i * 100}ms` }}
                                    />
                                </div>
                                <span className="text-[10px] font-semibold" style={{ color: "var(--ios-label-3)" }}>
                                    {['M','T','W','T','F','S','S'][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Deep Work Stats ── */}
                <div className="dash-card rounded-[28px] shade-glass animate-spring-in p-7 md:col-span-1 lg:col-span-1 flex flex-col justify-between">
                    <p className="text-[12px] font-bold uppercase tracking-widest mb-4" style={{ color: "var(--ios-label-3)" }}>
                        Current Status
                    </p>
                    <div className="space-y-5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-[14px] flex items-center justify-center bg-orange-500/10 dark:bg-orange-500/20">
                                <Zap className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-[24px] font-bold tracking-tight" style={{ color: "var(--ios-label)" }}>8.5 <span className="text-[14px] text-gray-500 font-medium">hrs</span></p>
                                <p className="text-[12px] font-medium" style={{ color: "var(--ios-label-2)" }}>Deep Work Logged</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-[14px] flex items-center justify-center bg-green-500/10 dark:bg-green-500/20">
                                <Target className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-[24px] font-bold tracking-tight" style={{ color: "var(--ios-label)" }}>12 <span className="text-[14px] text-gray-500 font-medium">tasks</span></p>
                                <p className="text-[12px] font-medium" style={{ color: "var(--ios-label-2)" }}>Completed this week</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Intelligence Suggestion (Tip Strip) ── */}
                <div className="dash-card rounded-[24px] ai-glow animate-spring-in flex items-center gap-5 p-6 md:col-span-2 lg:col-span-1 h-full">
                    <div className="relative w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0 bg-white dark:bg-black shadow-sm">
                        <Sparkles className="w-6 h-6 relative z-10" style={{ color: "var(--ios-purple)" }} />
                        <div className="absolute inset-0 rounded-[16px] blur-md opacity-50" style={{ background: "linear-gradient(45deg, var(--ios-blue), var(--ios-purple))" }} />
                    </div>
                    <div>
                        <p className="text-[12px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--ios-purple)" }}>
                            Smart Suggestion
                        </p>
                        <p className="text-[14px] font-medium leading-relaxed" style={{ color: "var(--ios-label)" }}>
                            You usually complete most tasks on Thursdays. Consider scheduling your most challenging work then.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}