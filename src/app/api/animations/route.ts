import { NextResponse } from 'next/server';
import { db } from '@/db';
import { animations } from '@/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const allAnimations = await db.select().from(animations).orderBy(desc(animations.createdAt));
    return NextResponse.json(allAnimations);
  } catch (error) {
    console.error('Failed to fetch animations:', error);
    return NextResponse.json({ error: 'Failed to fetch animations' }, { status: 500 });
  }
}
