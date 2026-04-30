import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import LogoutButton from "@/components/logout-button";
import { CheckSquare, LayoutDashboard, ListTodo } from "lucide-react";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session) {
        redirect("/login");
    }

    const displayName = session.name?.trim() || session.email;
    const initial = (session.name?.trim()?.[0] ?? session.email?.[0] ?? "?").toUpperCase();

    return (
        <div className="min-h-screen" style={{ background: "oklch(0.97 0.01 280)" }}>
            {/* Header */}
            <header className="sticky top-0 z-30" style={{
                background: "linear-gradient(135deg, oklch(0.18 0.05 280), oklch(0.14 0.04 300))",
                borderBottom: "1px solid oklch(1 0 0 / 8%)",
                boxShadow: "0 4px 30px oklch(0 0 0 / 30%)",
            }}>
                <div className="container mx-auto flex items-center justify-between gap-4 py-3.5 px-5">
                    {/* Brand + Nav */}
                    <nav className="flex items-center gap-6">
                        <Link href="/dashboard" className="flex items-center gap-2.5 group">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ background: "linear-gradient(135deg, oklch(0.55 0.22 280), oklch(0.65 0.24 310))" }}>
                                <CheckSquare className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-base font-bold text-white tracking-tight">TaskFlow</span>
                        </Link>

                        <div className="hidden sm:flex items-center gap-1">
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all duration-150"
                            >
                                <LayoutDashboard className="w-3.5 h-3.5" />
                                Dashboard
                            </Link>
                            <Link
                                href="/dashboard/todos"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/8 transition-all duration-150"
                            >
                                <ListTodo className="w-3.5 h-3.5" />
                                My Todos
                            </Link>
                        </div>
                    </nav>

                    {/* User info + Logout */}
                    <div className="flex items-center gap-3">
                        {session.image ? (
                            <img
                                src={session.image}
                                alt={displayName}
                                className="h-8 w-8 rounded-full object-cover ring-2"
                                style={{ ringColor: "oklch(0.65 0.22 280 / 60%)" }}
                                width={32}
                                height={32}
                            />
                        ) : (
                            <div
                                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                                style={{ background: "linear-gradient(135deg, oklch(0.55 0.22 280), oklch(0.65 0.24 310))" }}
                                aria-hidden
                            >
                                {initial}
                            </div>
                        )}
                        <span className="hidden text-sm text-white/60 sm:inline">{displayName}</span>
                        <LogoutButton />
                    </div>
                </div>
            </header>

            {/* Subtle accent line */}
            <div className="h-px w-full"
                style={{ background: "linear-gradient(90deg, transparent, oklch(0.65 0.22 280 / 60%), transparent)" }}
            />

            {/* Page content */}
            <main className="container mx-auto py-8 px-5">{children}</main>
        </div>
    );
}