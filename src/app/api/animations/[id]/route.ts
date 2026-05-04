import { NextResponse } from 'next/server';
import { db } from '@/db';
import { animations } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = parseInt((await params).id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    await db.delete(animations).where(eq(animations.id, id));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete animation:', error);
    return NextResponse.json({ error: 'Failed to delete animation' }, { status: 500 });
  }
}
