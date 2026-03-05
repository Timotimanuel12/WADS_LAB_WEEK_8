import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    return NextResponse.json({ 
      success: true, 
      message: `Task ${params.id} successfully updated`, 
      data: body 
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Invalid update data" }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ 
    success: true, 
    message: `Task ${params.id} successfully deleted` 
  });
}