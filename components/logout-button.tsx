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
            await authClient.signOut();
            const res = await fetch("/api/logout", { method: "POST" });
            if (!res.ok) throw new Error("Failed to clear session");
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
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150 active:opacity-50"
                    style={{ background: "rgba(255,59,48,0.12)" }}
                    aria-label="Sign out"
                >
                    <LogOut className="w-4 h-4" style={{ color: "var(--ios-red)" }} />
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent
                className="rounded-[20px] border-none p-0 overflow-hidden max-w-[300px]"
                style={{ background: "var(--ios-elevated)" }}
            >
                <AlertDialogHeader className="px-6 pt-6 pb-3 text-center">
                    <AlertDialogTitle
                        className="text-[17px] font-semibold"
                        style={{ color: "var(--ios-label)" }}
                    >
                        Sign Out
                    </AlertDialogTitle>
                    <AlertDialogDescription
                        className="text-[13px]"
                        style={{ color: "var(--ios-label-2)" }}
                    >
                        Are you sure you want to sign out of TaskFlow?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {/* iOS-style button sheet */}
                <div
                    className="border-t"
                    style={{ borderColor: "var(--ios-sep)" }}
                >
                    <AlertDialogAction
                        onClick={handleLogout}
                        disabled={loading}
                        className="w-full h-12 rounded-none border-none text-[17px] font-semibold bg-transparent hover:bg-transparent shadow-none"
                        style={{ color: "var(--ios-red)" }}
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Sign Out"}
                    </AlertDialogAction>
                </div>
                <div
                    className="border-t"
                    style={{ borderColor: "var(--ios-sep)" }}
                >
                    <AlertDialogCancel
                        className="w-full h-12 rounded-none border-none text-[17px] font-semibold bg-transparent hover:bg-transparent shadow-none"
                        style={{ color: "var(--ios-blue)" }}
                    >
                        Cancel
                    </AlertDialogCancel>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}