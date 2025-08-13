import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { randomUUID } from "crypto";

type MemoryExpense = {
  id: string;
  description: string;
  amountCents: number;
  date: string; // ISO
  paidBy: "MARIO" | "MORITZ";
};

// In-memory fallback store for prototype when DB is unavailable
const memoryExpenses: MemoryExpense[] = [];

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({ orderBy: { date: "desc" } });
    return NextResponse.json({ expenses: [
      ...expenses,
      ...memoryExpenses.map((e) => ({ ...e, date: new Date(e.date) })),
    ] });
  } catch {
    return NextResponse.json({ expenses: memoryExpenses.map((e) => ({ ...e, date: new Date(e.date) })) });
  }
}

const ExpenseSchema = z.object({
  description: z.string().min(1),
  amountCents: z.number().int().nonnegative(),
  date: z.string(),
  paidBy: z.enum(["MARIO", "MORITZ"]),
});

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = ExpenseSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const { description, amountCents, date, paidBy } = parsed.data;
  try {
    const created = await prisma.expense.create({
      data: { description, amountCents, date: new Date(date), paidBy },
    });
    return NextResponse.json({ expense: created });
  } catch {
    const mem: MemoryExpense = {
      id: randomUUID(),
      description,
      amountCents,
      date: new Date(date).toISOString(),
      paidBy,
    };
    memoryExpenses.unshift(mem);
    return NextResponse.json({ expense: mem });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  try {
    await prisma.expense.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    const index = memoryExpenses.findIndex((e) => e.id === id);
    if (index !== -1) {
      memoryExpenses.splice(index, 1);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false }, { status: 404 });
  }
}
