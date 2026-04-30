"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createTodo, updateTodo, deleteTodo } from "./actions";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Pencil, Trash2, Plus, CheckCircle2, Circle, ClipboardList, Sparkles } from "lucide-react";

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
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        setTodos(initialTodos);
    }, [initialTodos]);

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const title = formData.get("title")?.toString().trim();
        if (!title) {
            toast.error("Title is required.");
            return;
        }
        setIsAdding(true);
        try {
            const result = await createTodo(formData);
            if (result.success) {
                toast.success("Task added!");
                form.reset();
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

    const handleToggleComplete = async (todo: TodoItem) => {
        try {
            const result = await updateTodo(todo.id, { completed: !todo.completed });
            if (result.success) {
                setTodos((prev) =>
                    prev.map((t) => (t.id === todo.id ? { ...t, completed: !t.completed } : t))
                );
                router.refresh();
            } else {
                toast.error(result.error);
            }
        } catch {
            toast.error("Failed to update.");
        }
    };

    const handleEdit = async (todoId: string, title: string, description: string | null) => {
        if (!title.trim()) {
            toast.error("Title cannot be empty.");
            return;
        }
        setEditingId(todoId);
        try {
            const result = await updateTodo(todoId, {
                title: title.trim(),
                description: description?.trim() || null,
            });
            if (result.success) {
                toast.success("Task updated.");
                setEditingId(null);
                router.refresh();
            } else {
                toast.error(result.error);
            }
        } catch {
            toast.error("Failed to update.");
        } finally {
            setEditingId(null);
        }
    };

    const handleDelete = async (todoId: string) => {
        setDeletingId(todoId);
        try {
            const result = await deleteTodo(todoId);
            if (result.success) {
                setTodos((prev) => prev.filter((t) => t.id !== todoId));
                toast.success("Task deleted.");
                setDeletingId(null);
                router.refresh();
            } else {
                toast.error(result.error);
                setDeletingId(null);
            }
        } catch {
            toast.error("Failed to delete.");
            setDeletingId(null);
        }
    };

    const completedCount = todos.filter((t) => t.completed).length;
    const totalCount = todos.length;
    const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, oklch(0.55 0.22 280), oklch(0.65 0.24 310))" }}>
                    <ClipboardList className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight" style={{ color: "oklch(0.15 0.04 280)" }}>My Todo List</h1>
                    <p className="text-sm" style={{ color: "oklch(0.5 0.05 280)" }}>Add, edit, and complete your tasks.</p>
                </div>
            </div>

            {/* Progress bar (only when there are todos) */}
            {totalCount > 0 && (
                <div className="rounded-2xl p-5 border"
                    style={{
                        background: "oklch(1 0 0)",
                        border: "1px solid oklch(0.88 0.02 280)",
                        boxShadow: "0 2px 12px oklch(0.55 0.22 280 / 6%)",
                    }}>
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold" style={{ color: "oklch(0.3 0.08 280)" }}>
                            Progress
                        </span>
                        <span className="text-sm font-bold" style={{ color: "oklch(0.55 0.22 280)" }}>
                            {completedCount} / {totalCount} done
                        </span>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "oklch(0.88 0.02 280)" }}>
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${progress}%`,
                                background: "linear-gradient(90deg, oklch(0.55 0.22 280), oklch(0.65 0.24 310))",
                            }}
                        />
                    </div>
                    {progress === 100 && (
                        <div className="flex items-center gap-1.5 mt-3 text-sm font-semibold"
                            style={{ color: "oklch(0.55 0.22 280)" }}>
                            <Sparkles className="w-4 h-4" />
                            All tasks complete! Great job!
                        </div>
                    )}
                </div>
            )}

            {/* Add todo form */}
            <div className="rounded-2xl border overflow-hidden"
                style={{
                    background: "oklch(1 0 0)",
                    border: "1px solid oklch(0.88 0.02 280)",
                    boxShadow: "0 2px 12px oklch(0.55 0.22 280 / 6%)",
                }}>
                <div className="px-5 pt-5 pb-2">
                    <h2 className="font-semibold text-sm uppercase tracking-widest" style={{ color: "oklch(0.5 0.05 280)" }}>
                        Add a task
                    </h2>
                </div>
                <form onSubmit={handleCreate} className="p-5 pt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
                    <div className="flex-1 space-y-1.5">
                        <Label htmlFor="title" className="text-xs font-medium" style={{ color: "oklch(0.4 0.06 280)" }}>
                            Title <span style={{ color: "oklch(0.55 0.22 280)" }}>*</span>
                        </Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="What needs to be done?"
                            required
                            maxLength={500}
                            disabled={isAdding}
                            className="h-10 rounded-xl text-sm border-0 ring-1 focus-visible:ring-2 transition-all"
                            style={{
                                background: "oklch(0.97 0.01 280)",
                                "--tw-ring-color": "oklch(0.88 0.02 280)",
                            } as React.CSSProperties}
                        />
                    </div>
                    <div className="flex-1 sm:max-w-xs space-y-1.5">
                        <Label htmlFor="description" className="text-xs font-medium" style={{ color: "oklch(0.4 0.06 280)" }}>
                            Description <span className="opacity-50">(optional)</span>
                        </Label>
                        <Input
                            id="description"
                            name="description"
                            placeholder="Add details…"
                            maxLength={1000}
                            disabled={isAdding}
                            className="h-10 rounded-xl text-sm border-0 ring-1 focus-visible:ring-2 transition-all"
                            style={{
                                background: "oklch(0.97 0.01 280)",
                                "--tw-ring-color": "oklch(0.88 0.02 280)",
                            } as React.CSSProperties}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isAdding}
                        className="h-10 px-5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 shrink-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            background: "linear-gradient(135deg, oklch(0.55 0.22 280), oklch(0.62 0.24 305))",
                            boxShadow: "0 4px 16px oklch(0.55 0.22 280 / 30%)",
                        }}
                        onMouseEnter={e => !isAdding && (e.currentTarget.style.boxShadow = "0 6px 20px oklch(0.55 0.22 280 / 50%)")}
                        onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 16px oklch(0.55 0.22 280 / 30%)")}
                    >
                        {isAdding ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Plus className="w-4 h-4" />
                        )}
                        {isAdding ? "Adding…" : "Add"}
                    </button>
                </form>
            </div>

            {/* Todo list */}
            <div className="rounded-2xl border overflow-hidden"
                style={{
                    background: "oklch(1 0 0)",
                    border: "1px solid oklch(0.88 0.02 280)",
                    boxShadow: "0 2px 12px oklch(0.55 0.22 280 / 6%)",
                }}>
                <div className="px-5 py-4 border-b flex items-center justify-between"
                    style={{ borderColor: "oklch(0.93 0.015 280)" }}>
                    <h2 className="font-semibold text-sm uppercase tracking-widest" style={{ color: "oklch(0.5 0.05 280)" }}>
                        Tasks
                    </h2>
                    {totalCount > 0 && (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                            style={{
                                background: "oklch(0.55 0.22 280 / 10%)",
                                color: "oklch(0.45 0.2 280)",
                            }}>
                            {totalCount}
                        </span>
                    )}
                </div>

                {todos.length === 0 ? (
                    <div className="py-14 px-6 text-center">
                        <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                            style={{ background: "oklch(0.55 0.22 280 / 8%)" }}>
                            <ClipboardList className="w-6 h-6" style={{ color: "oklch(0.55 0.22 280 / 50%)" }} />
                        </div>
                        <p className="text-sm font-medium" style={{ color: "oklch(0.5 0.05 280)" }}>No tasks yet</p>
                        <p className="text-xs mt-1" style={{ color: "oklch(0.65 0.03 280)" }}>Add your first task above to get started.</p>
                    </div>
                ) : (
                    <ul className="divide-y" style={{ borderColor: "oklch(0.93 0.015 280)" }}>
                        {todos.map((todo) => (
                            <li
                                key={todo.id}
                                className="todo-item flex items-start gap-4 px-5 py-4"
                            >
                                {/* Checkbox toggle */}
                                <button
                                    type="button"
                                    onClick={() => handleToggleComplete(todo)}
                                    className="mt-0.5 shrink-0 transition-all duration-200"
                                    aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
                                >
                                    {todo.completed ? (
                                        <CheckCircle2
                                            className="w-5 h-5"
                                            style={{ color: "oklch(0.55 0.22 280)" }}
                                        />
                                    ) : (
                                        <Circle
                                            className="w-5 h-5"
                                            style={{ color: "oklch(0.75 0.05 280)" }}
                                        />
                                    )}
                                </button>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <p className={`font-medium text-sm leading-snug transition-all duration-200 ${
                                        todo.completed ? "line-through" : ""
                                    }`}
                                        style={{
                                            color: todo.completed
                                                ? "oklch(0.65 0.03 280)"
                                                : "oklch(0.18 0.04 280)",
                                        }}>
                                        {todo.title}
                                    </p>
                                    {todo.description && (
                                        <p className="text-xs mt-0.5 line-clamp-2"
                                            style={{ color: "oklch(0.58 0.04 280)" }}>
                                            {todo.description}
                                        </p>
                                    )}
                                </div>

                                {/* Completed badge */}
                                {todo.completed && (
                                    <span className="shrink-0 hidden sm:inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full"
                                        style={{
                                            background: "oklch(0.55 0.22 280 / 10%)",
                                            color: "oklch(0.45 0.2 280)",
                                        }}>
                                        Done
                                    </span>
                                )}

                                {/* Actions */}
                                <div className="flex items-center gap-1 shrink-0">
                                    <EditTodoDialog
                                        todo={todo}
                                        onSave={handleEdit}
                                        isEditing={editingId === todo.id}
                                        onOpenChange={(open) => !open && setEditingId(null)}
                                    />
                                    <AlertDialog
                                        open={deletingId === todo.id}
                                        onOpenChange={(open) => !open && setDeletingId(null)}
                                    >
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete task</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete &quot;{todo.title}&quot;? This cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDelete(todo.id)}
                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                >
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                        <button
                                            type="button"
                                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 hover:scale-105"
                                            style={{
                                                background: "oklch(0.577 0.245 27.325 / 0%)",
                                                color: "oklch(0.6 0.1 27)",
                                            }}
                                            onMouseEnter={e => (e.currentTarget.style.background = "oklch(0.577 0.245 27.325 / 10%)")}
                                            onMouseLeave={e => (e.currentTarget.style.background = "oklch(0.577 0.245 27.325 / 0%)")}
                                            onClick={() => setDeletingId(todo.id)}
                                            aria-label="Delete"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </AlertDialog>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

function EditTodoDialog({
    todo,
    onSave,
    isEditing,
    onOpenChange,
}: {
    todo: TodoItem;
    onSave: (id: string, title: string, description: string | null) => Promise<void>;
    isEditing: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [title, setTitle] = useState(todo.title);
    const [description, setDescription] = useState(todo.description ?? "");
    const [open, setOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(todo.id, title, description || null).then(() => setOpen(false));
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(o) => {
                setOpen(o);
                onOpenChange(o);
            }}
        >
            <DialogTrigger asChild>
                <button
                    type="button"
                    disabled={isEditing}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 hover:scale-105 disabled:opacity-50"
                    style={{ background: "transparent", color: "oklch(0.55 0.08 280)" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "oklch(0.55 0.22 280 / 10%)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    aria-label="Edit"
                >
                    {isEditing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Pencil className="w-3.5 h-3.5" />}
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-2xl">
                <DialogHeader>
                    <DialogTitle>Edit task</DialogTitle>
                    <DialogDescription>Update the title and description.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="edit-title" className="text-xs font-semibold uppercase tracking-wider"
                            style={{ color: "oklch(0.45 0.06 280)" }}>
                            Title
                        </Label>
                        <Input
                            id="edit-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title"
                            required
                            maxLength={500}
                            className="rounded-xl h-10"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="edit-description" className="text-xs font-semibold uppercase tracking-wider"
                            style={{ color: "oklch(0.45 0.06 280)" }}>
                            Description <span className="opacity-50 normal-case">(optional)</span>
                        </Label>
                        <Input
                            id="edit-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Description"
                            maxLength={1000}
                            className="rounded-xl h-10"
                        />
                    </div>
                    <DialogFooter className="gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="rounded-xl text-white"
                            style={{
                                background: "linear-gradient(135deg, oklch(0.55 0.22 280), oklch(0.62 0.24 305))",
                            }}
                        >
                            Save changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}