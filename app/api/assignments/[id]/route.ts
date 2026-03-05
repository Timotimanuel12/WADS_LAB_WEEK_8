import { NextRequest, NextResponse } from "next/server";
import {
    getById,
    update,
    remove,
    validatePartialAssignment,
} from "@/lib/assignments-store";

// GET /api/assignments/:id — Get a single assignment by ID
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const numId = Number(id);
    const assignment = getById(numId);

    if (!assignment) {
        return NextResponse.json(
            { success: false, message: `Assignment with id '${numId}' not found` },
            { status: 404 }
        );
    }

    return NextResponse.json(
        { success: true, data: assignment },
        { status: 200 }
    );
}

// PUT /api/assignments/:id — Update an assignment
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const numId = Number(id);

    try {
        const body = await request.json();

        const error = validatePartialAssignment(body);
        if (error) {
            return NextResponse.json(
                { success: false, message: error },
                { status: 400 }
            );
        }

        const updated = update(numId, body);
        if (!updated) {
            return NextResponse.json(
                { success: false, message: `Assignment with id '${numId}' not found` },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Assignment updated successfully", data: updated },
            { status: 200 }
        );
    } catch {
        return NextResponse.json(
            { success: false, message: "Invalid JSON body" },
            { status: 400 }
        );
    }
}

// DELETE /api/assignments/:id — Delete an assignment
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const numId = Number(id);
    const deleted = remove(numId);

    if (!deleted) {
        return NextResponse.json(
            { success: false, message: `Assignment with id '${numId}' not found` },
            { status: 404 }
        );
    }

    return NextResponse.json(
        { success: true, message: `Assignment '${numId}' deleted successfully` },
        { status: 200 }
    );
}
