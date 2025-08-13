import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { randomUUID } from "crypto";

type MemoryWishlistItem = {
  id: string;
  title: string;
  url: string;
  description?: string;
  proposedBy: "MARIO" | "MORITZ";
  createdAt: string;
};

// In-memory fallback store for prototype when DB is unavailable
const memoryItems: MemoryWishlistItem[] = [];

export async function GET() {
  try {
    const items = await prisma.wishlistItem.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ items: [
      ...items,
      ...memoryItems,
    ] });
  } catch (error) {
    console.error('Database connection failed:', error);
    console.log('Using in-memory fallback. Set DATABASE_URL for persistent storage.');
    return NextResponse.json({ items: memoryItems });
  }
}

const WishlistItemSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  description: z.string().optional(),
  proposedBy: z.enum(["MARIO", "MORITZ"]),
});

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = WishlistItemSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const { title, url, description, proposedBy } = parsed.data;
  try {
    const created = await prisma.wishlistItem.create({
      data: { title, url, description, proposedBy },
    });
    return NextResponse.json({ item: created });
  } catch {
    const mem: MemoryWishlistItem = {
      id: randomUUID(),
      title,
      url,
      description,
      proposedBy,
      createdAt: new Date().toISOString(),
    };
    memoryItems.unshift(mem);
    return NextResponse.json({ item: mem });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  try {
    await prisma.wishlistItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    const index = memoryItems.findIndex((item) => item.id === id);
    if (index !== -1) {
      memoryItems.splice(index, 1);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false }, { status: 404 });
  }
}
