"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { LogOut, Loader2 } from "lucide-react";

export default function LogoutButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        try {
            setLoading(true);

            // Clear Better Auth session (for users who signed in with email/password)
            await authClient.signOut();

            // Clear custom session cookie (for users who signed in with Firebase/Google)
            const res = await fetch("/api/logout", {
                method: "POST",
            });

            if (!res.ok) {
                throw new Error("Failed to clear session");
            }

            toast.success("Successfully signed out");
            router.push("/login");
            router.refresh();
        } catch (err: unknown) {
            console.error(err);
            toast.error(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
                    style={{ background: "oklch(1 0 0 / 8%)", color: "oklch(1 0 0 / 60%)" }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = "oklch(0.577 0.245 27.325 / 20%)";
                        e.currentTarget.style.color = "oklch(0.8 0.12 27)";
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = "oklch(1 0 0 / 8%)";
                        e.currentTarget.style.color = "oklch(1 0 0 / 60%)";
                    }}
                >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Sign out</span>
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl">
                <AlertDialogHeader>
                    <AlertDialogTitle>Sign out</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to sign out of TaskFlow?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleLogout}
                        disabled={loading}
                        className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : null}
                        {loading ? "Signing out…" : "Yes, sign out"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}