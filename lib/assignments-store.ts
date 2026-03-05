// In-memory assignments store with CRUD helpers and validation

let nextId = 4; // next available ID (seed data uses 1-3)

export interface Assignment {
    id: number;
    title: string;
    description: string;
    status: "Created" | "On Process" | "Submitted";
    assignmentDate: string;
    dueDate: string;
}

const VALID_STATUSES = ["Created", "On Process", "Submitted"];

// Seed data
let assignments: Assignment[] = [
    {
        id: 1,
        title: "Next.js REST API Assignment",
        description: "Build a REST API using Next.js with CRUD operations and Swagger documentation.",
        status: "On Process",
        assignmentDate: "2026-03-01T08:00:00.000Z",
        dueDate: "2026-03-10T23:59:00.000Z",
    },
    {
        id: 2,
        title: "Database Normalization Report",
        description: "Write a report on 1NF, 2NF, 3NF normalization with examples.",
        status: "Created",
        assignmentDate: "2026-03-02T10:00:00.000Z",
        dueDate: "2026-03-15T23:59:00.000Z",
    },
    {
        id: 3,
        title: "Linear Algebra Problem Set 5",
        description: "Complete exercises on eigenvalues and eigenvectors.",
        status: "Submitted",
        assignmentDate: "2026-02-28T07:00:00.000Z",
        dueDate: "2026-03-08T23:59:00.000Z",
    },
];

// --- Validation ---

export function validateAssignment(body: Record<string, unknown>): string | null {
    if (!body.title || typeof body.title !== "string" || body.title.trim() === "") {
        return "Field 'title' is required and must be a non-empty string.";
    }
    if (!body.description || typeof body.description !== "string" || body.description.trim() === "") {
        return "Field 'description' is required and must be a non-empty string.";
    }
    if (!body.dueDate || typeof body.dueDate !== "string" || body.dueDate.trim() === "") {
        return "Field 'dueDate' is required and must be a non-empty string (ISO 8601 format).";
    }
    if (body.status && !VALID_STATUSES.includes(body.status as string)) {
        return `Field 'status' must be one of: ${VALID_STATUSES.join(", ")}.`;
    }
    return null;
}

export function validatePartialAssignment(body: Record<string, unknown>): string | null {
    if (body.title !== undefined && (typeof body.title !== "string" || body.title.trim() === "")) {
        return "Field 'title' must be a non-empty string.";
    }
    if (body.description !== undefined && (typeof body.description !== "string" || body.description.trim() === "")) {
        return "Field 'description' must be a non-empty string.";
    }
    if (body.dueDate !== undefined && (typeof body.dueDate !== "string" || body.dueDate.trim() === "")) {
        return "Field 'dueDate' must be a non-empty string (ISO 8601 format).";
    }
    if (body.status !== undefined && !VALID_STATUSES.includes(body.status as string)) {
        return `Field 'status' must be one of: ${VALID_STATUSES.join(", ")}.`;
    }
    return null;
}

// --- CRUD Operations ---

export function getAll(): Assignment[] {
    return assignments;
}

export function getById(id: number): Assignment | undefined {
    return assignments.find((a) => a.id === id);
}

export function create(data: Record<string, unknown>): Assignment {
    const newAssignment: Assignment = {
        id: nextId++,
        title: (data.title as string).trim(),
        description: (data.description as string).trim(),
        status: (data.status as Assignment["status"]) || "Created",
        assignmentDate: new Date().toISOString(),
        dueDate: (data.dueDate as string).trim(),
    };
    assignments.push(newAssignment);
    return newAssignment;
}

export function update(id: number, data: Record<string, unknown>): Assignment | null {
    const index = assignments.findIndex((a) => a.id === id);
    if (index === -1) return null;

    const existing = assignments[index];
    const updated: Assignment = {
        ...existing,
        title: typeof data.title === "string" ? data.title.trim() : existing.title,
        description: typeof data.description === "string" ? data.description.trim() : existing.description,
        status: VALID_STATUSES.includes(data.status as string)
            ? (data.status as Assignment["status"])
            : existing.status,
        dueDate: typeof data.dueDate === "string" ? data.dueDate.trim() : existing.dueDate,
    };
    assignments[index] = updated;
    return updated;
}

export function remove(id: number): boolean {
    const index = assignments.findIndex((a) => a.id === id);
    if (index === -1) return false;
    assignments.splice(index, 1);
    return true;
}
