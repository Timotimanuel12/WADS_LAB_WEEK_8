"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createTodo, updateTodo, deleteTodo } from "./actions";
import { toast } from "sonner";
import { Loader2, Pencil, Trash2, Plus, Check, X, Search, Command } from "lucide-react";

export type TodoItem = {
    id: string;
    title: string;
    description: string | null;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
};

type TodoListProps = {
    initialTodos: TodoItem[];
};

export function TodoList({ initialTodos }: TodoListProps) {
    const router = useRouter();
    const [todos, setTodos] = useState<TodoItem[]>(initialTodos);
    const [isAdding, setIsAdding] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [search, setSearch] = useState("");
    const titleRef = useRef<HTMLInputElement>(null);

    useEffect(() => { setTodos(initialTodos); }, [initialTodos]);

    useEffect(() => {
        if (showAddForm) setTimeout(() => titleRef.current?.focus(), 50);
    }, [showAddForm]);

    // Keyboard shortcut for adding task
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setShowAddForm(v => !v);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const filtered = todos.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase())
    );
    const active    = filtered.filter(t => !t.completed);
    const completed = filtered.filter(t => t.completed);

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const title = formData.get("title")?.toString().trim();
        if (!title) { toast.error("Title is required."); return; }
        setIsAdding(true);
        try {
            const result = await createTodo(formData);
            if (result.success) {
                toast.success("Task created.");
                form.reset();
                setShowAddForm(false);
                router.refresh();
            } else {
                toast.error(result.error);
            }
        } catch {
            toast.error("Something went wrong.");
        } finally {
            setIsAdding(false);
        }
    };

    const handleToggle = async (todo: TodoItem) => {
        setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t));
        try {
            const result = await updateTodo(todo.id, { completed: !todo.completed });
            if (!result.success) {
                setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, completed: todo.completed } : t));
                toast.error(result.error);
            } else {
                router.refresh();
            }
        } catch {
            setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, completed: todo.completed } : t));
            toast.error("Failed to update.");
        }
    };

    const handleDelete = async (todoId: string) => {
        setTodos(prev => prev.filter(t => t.id !== todoId));
        try {
            const result = await deleteTodo(todoId);
            if (result.success) {
                toast.success("Task deleted.");
                router.refresh();
            } else {
                toast.error(result.error);
                router.refresh();
            }
        } catch {
            toast.error("Failed to delete.");
            router.refresh();
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-4">
            <style>{`
                .todo-row {
                    transition: background 0.12s ease, transform 0.12s ease;
                }
                .todo-row:hover {
                    background: var(--ios-fill-4);
                }
                .add-form-enter {
                    animation: form-drop 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
                }
                @keyframes form-drop {
                    from { opacity:0; transform: translateY(-12px) scale(0.98); }
                    to   { opacity:1; transform: translateY(0) scale(1); }
                }
                .todo-appear {
                    animation: todo-in 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
                }
                @keyframes todo-in {
                    from { opacity:0; transform: translateX(-10px); }
                    to   { opacity:1; transform: translateX(0); }
                }
                .swipe-delete-btn {
                    transition: opacity 0.15s ease, transform 0.15s ease, background 0.15s ease;
                    opacity: 0;
                    transform: translateX(8px);
                }
                .todo-row:hover .swipe-delete-btn {
                    opacity: 1;
                    transform: translateX(0);
                }
                .glass-panel {
                    background: var(--ios-nav-bg);
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                    border: 1px solid var(--ios-sep);
                    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
                }
                .dark .glass-panel {
                    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.4);
                }
            `}</style>

            <div className="space-y-8 stagger">

                {/* ── Header Area ── */}
                <div className="animate-spring-in flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-6" style={{ borderColor: "var(--ios-sep)" }}>
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] mb-3" style={{ background: "var(--ios-blue-mid)" }}>
                            <Command className="w-3.5 h-3.5" style={{ color: "var(--ios-blue)" }} />
                            <span className="text-[11px] font-bold tracking-wide uppercase" style={{ color: "var(--ios-blue)" }}>Workspace</span>
                        </div>
                        <h1 className="text-[32px] md:text-[40px] font-extrabold tracking-tight leading-none" style={{ color: "var(--ios-label)" }}>
                            Inbox
                        </h1>
                        <p className="mt-2 text-[15px] font-medium" style={{ color: "var(--ios-label-2)" }}>
                            {active.length} active tasks, {completed.length} completed
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-none sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--ios-label-3)" }} />
                            <input
                                className="ios-input pl-9 h-10 w-full rounded-[10px]"
                                placeholder="Search tasks..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={() => setShowAddForm(v => !v)}
                            className="flex items-center justify-center h-10 px-4 rounded-[10px] text-[15px] font-bold transition-all duration-200 active:scale-95 shrink-0"
                            style={{
                                background: showAddForm ? "var(--ios-fill-3)" : "var(--ios-blue)",
                                color: showAddForm ? "var(--ios-label)" : "#fff",
                            }}
                        >
                            {showAddForm ? <X className="w-4 h-4" /> : <><Plus className="w-4 h-4 mr-1.5" /> New Task</>}
                        </button>
                    </div>
                </div>

                {/* ── Add form ── */}
                {showAddForm && (
                    <form onSubmit={handleCreate} className="glass-panel add-form-enter rounded-[20px] p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "var(--ios-blue-mid)" }}>
                                <Plus className="w-3.5 h-3.5" style={{ color: "var(--ios-blue)" }} />
                            </div>
                            <span className="text-[13px] font-bold uppercase tracking-wider" style={{ color: "var(--ios-blue)" }}>
                                Create New Task
                            </span>
                        </div>
                        <div className="space-y-3">
                            <input
                                ref={titleRef}
                                name="title"
                                className="ios-input text-[16px] font-medium px-4 py-3 bg-transparent border border-transparent focus:border-blue-500/30 focus:bg-white dark:focus:bg-black"
                                style={{ background: "var(--ios-fill-3)" }}
                                placeholder="What needs to be done?"
                                required
                                maxLength={500}
                                disabled={isAdding}
                            />
                            <textarea
                                name="description"
                                className="ios-input text-[14px] px-4 py-3 min-h-[80px] resize-none bg-transparent border border-transparent focus:border-blue-500/30 focus:bg-white dark:focus:bg-black"
                                style={{ background: "var(--ios-fill-3)" }}
                                placeholder="Add detailed notes, links, or context (optional)..."
                                maxLength={1000}
                                disabled={isAdding}
                            />
                        </div>
                        <div className="flex justify-between items-center mt-4 pt-4 border-t" style={{ borderColor: "var(--ios-sep)" }}>
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-[8px]" style={{ background: "var(--ios-fill-3)" }}>
                                <span className="text-[12px] font-medium" style={{ color: "var(--ios-label-2)" }}>Press</span>
                                <kbd className="text-[11px] font-bold font-mono px-1.5 py-0.5 rounded-[4px] bg-white dark:bg-black shadow-sm border" style={{ borderColor: "var(--ios-sep)", color: "var(--ios-label)" }}>⌘K</kbd>
                                <span className="text-[12px] font-medium" style={{ color: "var(--ios-label-2)" }}>to open</span>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button type="button" onClick={() => setShowAddForm(false)} disabled={isAdding} className="flex-1 sm:flex-none px-5 py-2 rounded-[10px] text-[14px] font-bold" style={{ background: "var(--ios-fill-3)", color: "var(--ios-label-2)" }}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={isAdding} className="flex-1 sm:flex-none flex items-center justify-center px-6 py-2 rounded-[10px] text-[14px] font-bold text-white transition-opacity" style={{ background: "var(--ios-blue)" }}>
                                    {isAdding ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving</> : "Save Task"}
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {/* ── Active tasks ── */}
                {active.length > 0 && (
                    <section className="animate-spring-in space-y-3">
                        <div className="flex items-center gap-2 px-1">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <h2 className="text-[16px] font-bold tracking-tight" style={{ color: "var(--ios-label)" }}>To Do</h2>
                        </div>
                        <div className="rounded-[20px] overflow-hidden" style={{ background: "var(--ios-elevated)", border: "1px solid var(--ios-sep)" }}>
                            {active.map((todo, i) => (
                                <TodoRow
                                    key={todo.id}
                                    todo={todo}
                                    index={i}
                                    onToggle={handleToggle}
                                    onDelete={handleDelete}
                                    onEdit={async (id, title, desc) => {
                                        const result = await updateTodo(id, { title, description: desc });
                                        if (result.success) { toast.success("Task updated."); router.refresh(); }
                                        else toast.error(result.error);
                                    }}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Completed tasks ── */}
                {completed.length > 0 && (
                    <section className="animate-spring-in space-y-3 opacity-80 transition-opacity hover:opacity-100">
                        <div className="flex items-center gap-2 px-1">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <h2 className="text-[16px] font-bold tracking-tight" style={{ color: "var(--ios-label-2)" }}>Completed</h2>
                        </div>
                        <div className="rounded-[20px] overflow-hidden" style={{ background: "var(--ios-fill-3)" }}>
                            {completed.map((todo, i) => (
                                <TodoRow
                                    key={todo.id}
                                    todo={todo}
                                    index={i}
                                    onToggle={handleToggle}
                                    onDelete={handleDelete}
                                    onEdit={async (id, title, desc) => {
                                        const result = await updateTodo(id, { title, description: desc });
                                        if (result.success) { toast.success("Task updated."); router.refresh(); }
                                        else toast.error(result.error);
                                    }}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* ── Empty state ── */}
                {filtered.length === 0 && (
                    <div className="animate-spring-in flex flex-col items-center justify-center py-20 px-4 text-center">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                            <div className="relative w-20 h-20 rounded-[24px] flex items-center justify-center shadow-sm" style={{ background: "var(--ios-elevated)", border: "1px solid var(--ios-sep)" }}>
                                <Check className="w-10 h-10" style={{ color: "var(--ios-blue)" }} />
                            </div>
                        </div>
                        <h3 className="text-[20px] font-bold tracking-tight mb-2" style={{ color: "var(--ios-label)" }}>
                            {search ? "No matches found" : "Inbox Zero!"}
                        </h3>
                        <p className="text-[15px] max-w-sm mb-8" style={{ color: "var(--ios-label-2)" }}>
                            {search
                                ? "We couldn't find any tasks matching your search. Try different keywords."
                                : "You've completely cleared your to-do list. Take a deep breath and enjoy the moment."}
                        </p>
                        {!search && !showAddForm && (
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="flex items-center gap-2 px-6 py-3 rounded-full text-[15px] font-bold text-white transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
                                style={{ background: "var(--ios-blue)" }}
                            >
                                <Plus className="w-4 h-4" /> Add a new task
                            </button>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}

// ── Individual Todo Row ──────────────────────────────────────────────────────
function TodoRow({
    todo,
    index,
    onToggle,
    onDelete,
    onEdit,
}: {
    todo: TodoItem;
    index: number;
    onToggle: (t: TodoItem) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string, title: string, desc: string | null) => Promise<void>;
}) {
    const [editing, setEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(todo.title);
    const [editDesc, setEditDesc] = useState(todo.description ?? "");
    const [saving, setSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editing) setTimeout(() => inputRef.current?.focus(), 50);
    }, [editing]);

    const save = async () => {
        if (!editTitle.trim()) { toast.error("Title cannot be empty."); return; }
        setSaving(true);
        await onEdit(todo.id, editTitle.trim(), editDesc.trim() || null);
        setSaving(false);
        setEditing(false);
    };

    const cancel = () => {
        setEditTitle(todo.title);
        setEditDesc(todo.description ?? "");
        setEditing(false);
    };

    if (editing) {
        return (
            <div className="flex flex-col gap-3 p-5 add-form-enter border-b last:border-b-0" style={{ borderColor: "var(--ios-sep)", background: "var(--ios-bg-2)" }}>
                <input
                    ref={inputRef}
                    className="ios-input text-[16px] font-medium bg-transparent px-0 border-none rounded-none focus:ring-0"
                    style={{ background: "transparent", boxShadow: "none" }}
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    placeholder="Task title"
                    disabled={saving}
                />
                <textarea
                    className="ios-input text-[14px] bg-transparent px-0 border-none rounded-none focus:ring-0 min-h-[40px] resize-none"
                    style={{ background: "transparent", boxShadow: "none", color: "var(--ios-label-2)" }}
                    value={editDesc}
                    onChange={e => setEditDesc(e.target.value)}
                    placeholder="Notes (optional)"
                    disabled={saving}
                />
                <div className="flex gap-2 pt-2">
                    <button onClick={cancel} className="px-4 py-2 rounded-[8px] text-[13px] font-bold" style={{ background: "var(--ios-fill-3)", color: "var(--ios-label-2)" }}>
                        Cancel
                    </button>
                    <button onClick={save} disabled={saving} className="flex items-center px-5 py-2 rounded-[8px] text-[13px] font-bold text-white" style={{ background: "var(--ios-blue)" }}>
                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="todo-row todo-appear group flex items-start gap-4 p-4 sm:p-5 border-b last:border-b-0" style={{ borderColor: "var(--ios-sep)", animationDelay: `${index * 40}ms` }}>
            <button
                onClick={() => onToggle(todo)}
                className="w-6 h-6 rounded-[8px] border-2 flex items-center justify-center shrink-0 transition-all duration-300 mt-0.5"
                style={todo.completed ? {
                    background: "var(--ios-blue)",
                    borderColor: "var(--ios-blue)",
                } : {
                    background: "transparent",
                    borderColor: "var(--ios-sep-opaque)",
                }}
                aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
            >
                {todo.completed && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
            </button>

            <div className="flex-1 min-w-0 pr-2 cursor-pointer" onClick={() => setEditing(true)}>
                <p className={`text-[16px] font-semibold leading-snug transition-colors duration-200 ${todo.completed ? 'opacity-50 line-through' : ''}`} style={{ color: "var(--ios-label)" }}>
                    {todo.title}
                </p>
                {todo.description && (
                    <p className={`text-[14px] mt-1.5 leading-relaxed line-clamp-2 transition-colors duration-200 ${todo.completed ? 'opacity-40 line-through' : ''}`} style={{ color: "var(--ios-label-2)" }}>
                        {todo.description}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
                <button
                    onClick={() => setEditing(true)}
                    className="w-8 h-8 rounded-[8px] flex items-center justify-center swipe-delete-btn"
                    style={{ background: "var(--ios-fill-3)" }}
                    aria-label="Edit task"
                >
                    <Pencil className="w-4 h-4" style={{ color: "var(--ios-label-2)" }} />
                </button>
                <button
                    onClick={() => onDelete(todo.id)}
                    className="w-8 h-8 rounded-[8px] flex items-center justify-center swipe-delete-btn hover:!bg-red-500 hover:![&>svg]:text-white"
                    style={{ background: "rgba(255,59,48,0.1)" }}
                    aria-label="Delete task"
                >
                    <Trash2 className="w-4 h-4 transition-colors" style={{ color: "var(--ios-red)" }} />
                </button>
            </div>
        </div>
    );
}