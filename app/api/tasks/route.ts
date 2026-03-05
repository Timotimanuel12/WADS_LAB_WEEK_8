import { NextResponse } from 'next/server';

//mock data
let mockTasks = [
  { id: 1, title: "Finish Next.js Assignment", status: "In Progress" },
  { id: 2, title: "Study for Midterms", status: "Pending" },
];

export async function GET() {
  return NextResponse.json({ success: true, data: mockTasks });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newTask = { id: Date.now(), ...body };
    mockTasks.push(newTask);
    return NextResponse.json({ success: true, data: newTask }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Invalid data" }, { status: 400 });
  }
}