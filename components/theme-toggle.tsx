"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
    const [dark, setDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const isDark = saved === "dark" || (!saved && prefersDark);
        setDark(isDark);
        document.documentElement.classList.toggle("dark", isDark);
    }, []);

    const toggle = () => {
        const next = !dark;
        setDark(next);
        document.documentElement.classList.toggle("dark", next);
        localStorage.setItem("theme", next ? "dark" : "light");
    };

    if (!mounted) return <div className="w-9 h-9" />;

    return (
        <button
            onClick={toggle}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            className="ios-btn-ghost relative w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
            style={{
                background: dark
                    ? "oklch(1 0 0 / 10%)"
                    : "oklch(0 0 0 / 6%)",
            }}
        >
            <span
                className="absolute transition-all duration-300"
                style={{
                    opacity: dark ? 0 : 1,
                    transform: dark ? "rotate(90deg) scale(0.5)" : "rotate(0deg) scale(1)",
                }}
            >
                <Sun className="w-4 h-4" style={{ color: "oklch(0.7 0.15 70)" }} />
            </span>
            <span
                className="absolute transition-all duration-300"
                style={{
                    opacity: dark ? 1 : 0,
                    transform: dark ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0.5)",
                }}
            >
                <Moon className="w-4 h-4" style={{ color: "oklch(0.75 0.12 280)" }} />
            </span>
        </button>
    );
}
