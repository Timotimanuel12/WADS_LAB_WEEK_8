"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { getAvatarUrl } from "@/lib/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, User, Mail, Lock, CheckSquare } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const validate = (): string | null => {
        const trimmedName = name.trim();
        if (!trimmedName) return "Name is required.";
        if (!email.trim()) return "Email is required.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return "Please enter a valid email address.";
        if (password.length < 8) return "Password must be at least 8 characters.";
        if (password !== confirmPassword) return "Passwords do not match.";
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const error = validate();
        if (error) {
            toast.error(error);
            return;
        }

        try {
            setLoading(true);

            const image = getAvatarUrl(name);

            const { data, error } = await authClient.signUp.email({
                name: name.trim(),
                email: email.trim(),
                password,
                image,
                callbackURL: "/dashboard",
            });

            if (error) {
                toast.error(error.message ?? "Registration failed.");
                return;
            }

            if (data) {
                toast.success("Account created successfully. Welcome!");
                router.push("/dashboard");
                router.refresh();
            }
        } catch (err: unknown) {
            console.error(err);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        background: "oklch(1 0 0 / 7%)",
        border: "1px solid oklch(1 0 0 / 12%)",
    };
    const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder:text-white/25 transition-all duration-200 outline-none disabled:opacity-50";

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.currentTarget.style.border = "1px solid oklch(0.65 0.22 280 / 80%)";
    };
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        e.currentTarget.style.border = "1px solid oklch(1 0 0 / 12%)";
    };

    return (
        <div className="animated-gradient-bg min-h-screen flex items-center justify-center px-4 py-12">
            {/* Decorative orbs */}
            <div aria-hidden className="pointer-events-none absolute top-1/4 right-1/3 w-96 h-96 rounded-full opacity-15"
                style={{ background: "radial-gradient(circle, oklch(0.65 0.25 280), transparent 70%)", filter: "blur(60px)" }} />
            <div aria-hidden className="pointer-events-none absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full opacity-10"
                style={{ background: "radial-gradient(circle, oklch(0.65 0.25 310), transparent 70%)", filter: "blur(60px)" }} />

            <div className="glass-card w-full max-w-md rounded-2xl p-8 relative z-10">
                {/* Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
                        style={{ background: "linear-gradient(135deg, oklch(0.55 0.22 280), oklch(0.65 0.25 310))" }}>
                        <CheckSquare className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Create account</h1>
                    <p className="text-white/50 text-sm mt-1">Start organizing your tasks today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-white/60 uppercase tracking-widest">Name</label>
                        <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                            <input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={loading}
                                autoComplete="name"
                                className={inputClass}
                                style={inputStyle}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-white/60 uppercase tracking-widest">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                autoComplete="email"
                                className={inputClass}
                                style={inputStyle}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-white/60 uppercase tracking-widest">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                            <input
                                id="password"
                                type="password"
                                placeholder="At least 8 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                autoComplete="new-password"
                                className={inputClass}
                                style={inputStyle}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                        </div>
                    </div>

                    {/* Confirm password */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-white/60 uppercase tracking-widest">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="Repeat your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={loading}
                                autoComplete="new-password"
                                className={inputClass}
                                style={inputStyle}
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                        </div>
                    </div>

                    <Separator className="opacity-10 my-2" />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        style={{
                            background: "linear-gradient(135deg, oklch(0.55 0.22 280), oklch(0.62 0.24 305))",
                            boxShadow: "0 4px 24px oklch(0.55 0.22 280 / 35%)",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 6px 30px oklch(0.55 0.22 280 / 55%)")}
                        onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 24px oklch(0.55 0.22 280 / 35%)")}
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {loading ? "Creating account…" : "Create account"}
                    </button>
                </form>

                <p className="text-center text-sm text-white/40 mt-6">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="text-white/80 font-semibold hover:text-white transition-colors underline underline-offset-4"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}