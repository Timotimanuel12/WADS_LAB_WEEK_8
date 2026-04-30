"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Link from "next/link";
import { Loader2, Mail, Lock, CheckSquare } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const createFirebaseSession = async (idToken: string) => {
        const res = await fetch("/api/auth/firebase", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        });
        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error ?? "Failed to create session");
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setGoogleLoading(true);
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();
            await createFirebaseSession(idToken);
            toast.success("Login successful");
            router.push("/dashboard");
            router.refresh();
        } catch (err: unknown) {
            console.error(err);
            const message = err instanceof Error ? err.message : "Google sign-in failed.";
            toast.error(message);
        } finally {
            setGoogleLoading(false);
        }
    };

    const validateEmailPassword = (): string | null => {
        const trimmedEmail = email.trim();
        if (!trimmedEmail) return "Email is required.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) return "Please enter a valid email address.";
        if (!password) return "Password is required.";
        return null;
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validateEmailPassword();
        if (validationError) {
            toast.error(validationError);
            return;
        }

        try {
            setLoading(true);

            const { data, error } = await authClient.signIn.email({
                email: email.trim(),
                password,
                callbackURL: "/dashboard",
            });

            if (error) {
                if (error.message?.toLowerCase().includes("invalid credentials") || error.message?.toLowerCase().includes("invalid email or password")) {
                    toast.error("Invalid email or password.");
                } else if (error.message?.toLowerCase().includes("user not found") || error.message?.toLowerCase().includes("user does not exist")) {
                    toast.error("No account found with this email. Please sign up first.");
                } else {
                    toast.error(error.message ?? "Sign-in failed. Please try again.");
                }
                return;
            }

            if (data) {
                toast.success("Login successful");
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

    return (
        <div className="animated-gradient-bg min-h-screen flex items-center justify-center px-4 py-12">
            {/* Decorative orbs */}
            <div
                aria-hidden
                className="pointer-events-none absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20"
                style={{
                    background: "radial-gradient(circle, oklch(0.65 0.25 280), transparent 70%)",
                    filter: "blur(60px)",
                }}
            />
            <div
                aria-hidden
                className="pointer-events-none absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-15"
                style={{
                    background: "radial-gradient(circle, oklch(0.65 0.25 320), transparent 70%)",
                    filter: "blur(60px)",
                }}
            />

            <div className="glass-card w-full max-w-md rounded-2xl p-8 relative z-10">
                {/* Logo / Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 pulse-ring"
                        style={{ background: "linear-gradient(135deg, oklch(0.55 0.22 280), oklch(0.65 0.25 310))" }}>
                        <CheckSquare className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back</h1>
                    <p className="text-white/50 text-sm mt-1">Sign in to manage your tasks</p>
                </div>

                {/* Google Button */}
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={googleLoading || loading}
                    className="w-full flex items-center justify-center gap-3 rounded-xl py-3 px-4 text-sm font-semibold transition-all duration-200 mb-5 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                        background: "oklch(1 0 0 / 10%)",
                        border: "1px solid oklch(1 0 0 / 18%)",
                        color: "white",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "oklch(1 0 0 / 18%)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "oklch(1 0 0 / 10%)")}
                >
                    {googleLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                    )}
                    {googleLoading ? "Processing…" : "Continue with Google"}
                </button>

                <div className="flex items-center gap-3 mb-5">
                    <Separator className="flex-1 opacity-20" />
                    <span className="text-white/40 text-xs font-medium">OR</span>
                    <Separator className="flex-1 opacity-20" />
                </div>

                {/* Email / Password Form */}
                <form onSubmit={handleEmailLogin} className="space-y-4">
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
                                disabled={loading || googleLoading}
                                autoComplete="email"
                                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder:text-white/25 transition-all duration-200 outline-none disabled:opacity-50"
                                style={{
                                    background: "oklch(1 0 0 / 7%)",
                                    border: "1px solid oklch(1 0 0 / 12%)",
                                }}
                                onFocus={e => (e.currentTarget.style.border = "1px solid oklch(0.65 0.22 280 / 80%)")}
                                onBlur={e => (e.currentTarget.style.border = "1px solid oklch(1 0 0 / 12%)")}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-white/60 uppercase tracking-widest">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading || googleLoading}
                                autoComplete="current-password"
                                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder:text-white/25 transition-all duration-200 outline-none disabled:opacity-50"
                                style={{
                                    background: "oklch(1 0 0 / 7%)",
                                    border: "1px solid oklch(1 0 0 / 12%)",
                                }}
                                onFocus={e => (e.currentTarget.style.border = "1px solid oklch(0.65 0.22 280 / 80%)")}
                                onBlur={e => (e.currentTarget.style.border = "1px solid oklch(1 0 0 / 12%)")}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || googleLoading}
                        className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                        style={{
                            background: "linear-gradient(135deg, oklch(0.55 0.22 280), oklch(0.62 0.24 305))",
                            boxShadow: "0 4px 24px oklch(0.55 0.22 280 / 35%)",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 6px 30px oklch(0.55 0.22 280 / 55%)")}
                        onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 24px oklch(0.55 0.22 280 / 35%)")}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {loading ? "Signing in…" : "Sign in with Email"}
                    </button>
                </form>

                <p className="text-center text-sm text-white/40 mt-6">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="text-white/80 font-semibold hover:text-white transition-colors underline underline-offset-4"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}