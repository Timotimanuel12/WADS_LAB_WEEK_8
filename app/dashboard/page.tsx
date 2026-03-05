"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen, CheckCircle, Clock, Plus, LogOut, Trash2, Pencil, Eye, X,
  ClipboardList, Loader2, Send
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Assignment {
  id: string;
  title: string;
  description: string;
  status: "Created" | "On Process" | "Submitted";
  assignmentDate: string;
  dueDate: string;
}

type ModalMode = "create" | "edit" | "view" | null;

export default function DashboardPage() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "Created" as Assignment["status"],
  });
  const [formError, setFormError] = useState("");

  // Fetch all assignments
  const fetchAssignments = useCallback(async () => {
    try {
      const res = await fetch("/api/assignments");
      const json = await res.json();
      if (json.success) setAssignments(json.data);
    } catch {
      console.error("Failed to fetch assignments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  // Helpers
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Submitted": return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "On Process": return "text-amber-600 bg-amber-50 border-amber-200";
      default: return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Submitted": return <CheckCircle className="w-3 h-3 mr-1" />;
      case "On Process": return <Clock className="w-3 h-3 mr-1" />;
      default: return <Plus className="w-3 h-3 mr-1" />;
    }
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-US", {
        weekday: "short", year: "numeric", month: "short", day: "numeric",
      });
    } catch { return iso; }
  };

  const toInputDate = (iso: string) => {
    try { return new Date(iso).toISOString().slice(0, 16); }
    catch { return ""; }
  };

  // Stats
  const totalAssignments = assignments.length;
  const submittedCount = assignments.filter(a => a.status === "Submitted").length;
  const onProcessCount = assignments.filter(a => a.status === "On Process").length;
  const createdCount = assignments.filter(a => a.status === "Created").length;

  // Modal actions
  const openCreate = () => {
    setForm({ title: "", description: "", dueDate: "", status: "Created" });
    setFormError("");
    setModalMode("create");
    setSelectedAssignment(null);
  };

  const openEdit = (a: Assignment) => {
    setForm({
      title: a.title,
      description: a.description,
      dueDate: toInputDate(a.dueDate),
      status: a.status,
    });
    setFormError("");
    setSelectedAssignment(a);
    setModalMode("edit");
  };

  const openView = (a: Assignment) => {
    setSelectedAssignment(a);
    setModalMode("view");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedAssignment(null);
    setFormError("");
  };

  // CRUD handlers
  const handleSave = async () => {
    setSaving(true);
    setFormError("");

    const body = {
      ...form,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : "",
    };

    try {
      if (modalMode === "create") {
        const res = await fetch("/api/assignments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const json = await res.json();
        if (!json.success) { setFormError(json.message); setSaving(false); return; }
      } else if (modalMode === "edit" && selectedAssignment) {
        const res = await fetch(`/api/assignments/${selectedAssignment.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const json = await res.json();
        if (!json.success) { setFormError(json.message); setSaving(false); return; }
      }
      await fetchAssignments();
      closeModal();
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/assignments/${id}`, { method: "DELETE" });
      await fetchAssignments();
      setDeleteConfirm(null);
    } catch {
      console.error("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* --- Top Navigation Bar --- */}
      <nav className="border-b bg-white px-8 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            <BookOpen className="w-4 h-4" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Assignment Log Book</h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/docs")}
          >
            API Docs
          </Button>
          <Button
            variant="ghost"
            className="text-gray-500 hover:text-red-600"
            onClick={() => router.push("/")}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </div>
      </nav>

      {/* --- Main Dashboard Content --- */}
      <main className="flex-1 p-8 max-w-6xl mx-auto w-full space-y-8">

        {/* Header Area */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">My Assignments 📚</h2>
            <p className="text-muted-foreground mt-1">
              {onProcessCount > 0
                ? `You have ${onProcessCount} assignment${onProcessCount > 1 ? "s" : ""} in progress.`
                : "All caught up! No assignments in progress."}
            </p>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" /> New Assignment
          </Button>
        </div>

        {/* --- Stats Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
              <ClipboardList className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalAssignments}</div>
              <p className="text-xs text-muted-foreground">{createdCount} newly created</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On Process</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{onProcessCount}</div>
              <p className="text-xs text-muted-foreground">currently in progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Submitted</CardTitle>
              <Send className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{submittedCount}</div>
              <p className="text-xs text-muted-foreground">
                {totalAssignments > 0
                  ? `${Math.round((submittedCount / totalAssignments) * 100)}% completion rate`
                  : "No assignments yet"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* --- Assignment List Section --- */}
        <Card>
          <CardHeader className="flex flex-row justify-between items-center border-b pb-4">
            <div>
              <CardTitle className="text-xl">Assignment List</CardTitle>
              <CardDescription>All your assignments sorted by most recent.</CardDescription>
            </div>
            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
              {totalAssignments} total
            </Badge>
          </CardHeader>

          <CardContent className="pt-6 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Loading assignments...
              </div>
            ) : assignments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium">No assignments yet</p>
                <p className="text-sm">Click &quot;New Assignment&quot; to get started.</p>
              </div>
            ) : (
              assignments.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors gap-4"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className={getStatusColor(a.status)}>
                        {getStatusIcon(a.status)}
                        {a.status}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 truncate">{a.title}</h3>
                    {a.description && (
                      <p className="text-sm text-muted-foreground truncate max-w-md">{a.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        Due: {formatDate(a.dueDate)}
                      </span>
                      <span className="text-xs">
                        Created: {formatDate(a.assignmentDate)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => openView(a)}>
                      <Eye className="w-3.5 h-3.5 mr-1" /> View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => openEdit(a)}>
                      <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                    </Button>
                    {deleteConfirm === a.id ? (
                      <div className="flex items-center gap-1">
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(a.id)}>
                          Confirm
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(null)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => setDeleteConfirm(a.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </main>

      {/* --- Modal Overlay --- */}
      {modalMode && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-bold text-gray-900">
                {modalMode === "create" && "New Assignment"}
                {modalMode === "edit" && "Edit Assignment"}
                {modalMode === "view" && "Assignment Details"}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {modalMode === "view" && selectedAssignment ? (
                /* --- View Mode --- */
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</label>
                    <p className="text-gray-900 font-semibold mt-1">{selectedAssignment.title}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</label>
                    <p className="text-gray-700 mt-1 text-sm whitespace-pre-wrap">{selectedAssignment.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</label>
                      <div className="mt-1">
                        <Badge variant="outline" className={getStatusColor(selectedAssignment.status)}>
                          {selectedAssignment.status}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Due Date</label>
                      <p className="text-gray-900 mt-1">{formatDate(selectedAssignment.dueDate)}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t text-xs text-muted-foreground">
                    Assignment Date: {formatDate(selectedAssignment.assignmentDate)}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700" onClick={() => openEdit(selectedAssignment)}>
                      <Pencil className="w-4 h-4 mr-2" /> Edit
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={closeModal}>Close</Button>
                  </div>
                </div>
              ) : (
                /* --- Create / Edit Form --- */
                <>
                  {formError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                      {formError}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g. Next.js REST API Assignment"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={3}
                      placeholder="Assignment description..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                    <input
                      type="datetime-local"
                      value={form.dueDate}
                      onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as Assignment["status"] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm bg-white"
                    >
                      <option value="Created">Created</option>
                      <option value="On Process">On Process</option>
                      <option value="Submitted">Submitted</option>
                    </select>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                      ) : (
                        modalMode === "create" ? "Create Assignment" : "Save Changes"
                      )}
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={closeModal} disabled={saving}>
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}