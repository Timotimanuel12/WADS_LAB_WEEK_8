import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import LogoutButton from "@/components/logout-button";
import ThemeToggle from "@/components/theme-toggle";
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
        <div className="min-h-screen" style={{ background: "var(--ios-bg)" }}>
            {/* iOS-style translucent navigation bar */}
            <header className="ios-nav sticky top-0 z-30">
                <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4 py-3 px-4 sm:px-6 lg:px-8">

                    {/* Brand */}
                    <Link href="/dashboard" className="flex items-center gap-2.5 group">
                        <div
                            className="w-8 h-8 rounded-[10px] flex items-center justify-center shadow-sm"
                            style={{ background: "var(--ios-blue)" }}
                        >
                            <CheckSquare className="w-4 h-4 text-white" />
                        </div>
                        <span
                            className="text-[17px] font-semibold tracking-tight"
                            style={{ color: "var(--ios-label)" }}
                        >
                            TaskFlow
                        </span>
                    </Link>

                    {/* Nav links — hidden on mobile */}
                    <nav className="hidden sm:flex items-center gap-1">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-[13px] font-medium transition-all duration-150"
                            style={{ color: "var(--ios-blue)" }}
                        >
                            <LayoutDashboard className="w-3.5 h-3.5" />
                            Dashboard
                        </Link>
                        <Link
                            href="/dashboard/todos"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-[13px] font-medium transition-all duration-150"
                            style={{ color: "var(--ios-label-2)" }}
                        >
                            <ListTodo className="w-3.5 h-3.5" />
                            My Todos
                        </Link>
                    </nav>

                    {/* Right side: avatar + theme toggle + logout */}
                    <div className="flex items-center gap-2">
                        <ThemeToggle />

                        {/* Avatar */}
                        {session.image ? (
                            <img
                                src={session.image}
                                alt={displayName}
                                className="h-8 w-8 rounded-full object-cover"
                                style={{ outline: "2px solid var(--ios-blue)", outlineOffset: "1px" }}
                                width={32}
                                height={32}
                            />
                        ) : (
                            <div
                                className="flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold text-white"
                                style={{ background: "var(--ios-blue)" }}
                            >
                                {initial}
                            </div>
                        )}

                        <span
                            className="hidden md:inline text-[13px] font-medium"
                            style={{ color: "var(--ios-label-2)" }}
                        >
                            {displayName}
                        </span>

                        <LogoutButton />
                    </div>
                </div>
            </header>

            {/* Page content — max-width centered like iOS app */}
            <main className="max-w-7xl mx-auto w-full py-6 px-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}