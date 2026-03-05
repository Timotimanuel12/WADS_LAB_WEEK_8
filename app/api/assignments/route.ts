import { NextResponse } from "next/server";
import { getAll, create, validateAssignment } from "@/lib/assignments-store";

// GET /api/assignments — List all assignments
export async function GET() {
    const assignments = getAll();
    return NextResponse.json(
        { success: true, count: assignments.length, data: assignments },
        { status: 200 }
    );
}

// POST /api/assignments — Create a new assignment
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const error = validateAssignment(body);
        if (error) {
            return NextResponse.json(
                { success: false, message: error },
                { status: 400 }
            );
        }

        const newAssignment = create(body);
        return NextResponse.json(
            { success: true, message: "Assignment created successfully", data: newAssignment },
            { status: 201 }
        );
    } catch {
        return NextResponse.json(
            { success: false, message: "Invalid JSON body" },
            { status: 400 }
        );
    }
}
