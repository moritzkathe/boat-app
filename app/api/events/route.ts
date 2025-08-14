import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { randomUUID } from "crypto";

type MemoryEvent = {
  id: string;
  title?: string;
  start: string; // ISO string
  end: string;   // ISO string
  allDay: boolean;
  owner: "MARIO" | "MORITZ";
};

// In-memory fallback store for prototype usage when DB is unavailable
const memoryEvents: MemoryEvent[] = [];

export async function GET() {
  // Fetch stored events plus generate alternating weekly blocks for Mario and Moritz
  let events: Awaited<ReturnType<typeof prisma.boatEvent.findMany>> = [];
  
  // Debug database connection
  console.log('🔍 Checking database connection...');
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  
  try {
    events = await prisma.boatEvent.findMany();
    console.log('✅ Database connection successful! Found', events.length, 'events');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.log('⚠️ Using in-memory fallback. Set DATABASE_URL for persistent storage.');
    events = [];
  }

  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 1);
  const end = new Date(today.getFullYear(), 11, 31);
  const anchor = new Date(today.getFullYear(), 7, 4); // Aug 04 of current year

  const generated: Array<{ id: string; title: string; start: string; end: string; allDay: boolean; color?: string; display?: 'background' }> = [];

  const formatLocalDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Anchor weekly alternation to Aug 03 with Mario as primary, alternate weekly across the year
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  // Forward from anchor to end
  {
    let current = new Date(anchor);
    let isMario = true; // Mario starts on Aug 03
    while (current <= end) {
      const weekStart = new Date(current);
      const weekEnd = new Date(current.getTime() + weekMs);
      generated.push({
        id: `auto-${weekStart.toISOString()}`,
        title: "",
        start: formatLocalDate(weekStart),
        end: formatLocalDate(weekEnd),
        allDay: true,
        color: isMario ? "#e3f2fd" : "#fff3e0",
        display: 'background',
      });
      isMario = !isMario;
      current = weekEnd;
    }
  }
  // Backward from anchor to start
  {
    let current = new Date(anchor.getTime() - weekMs);
    let isMario = false; // The week before anchor belongs to Moritz
    while (current >= start) {
      const weekStart = new Date(current);
      const weekEnd = new Date(current.getTime() + weekMs);
      generated.push({
        id: `auto-${weekStart.toISOString()}`,
        title: "",
        start: formatLocalDate(weekStart),
        end: formatLocalDate(weekEnd),
        allDay: true,
        color: isMario ? "#e3f2fd" : "#fff3e0",
        display: 'background',
      });
      isMario = !isMario;
      current = new Date(current.getTime() - weekMs);
    }
  }

  const combined = [
    ...generated,
    ...events.map((e) => ({
      id: e.id,
      title: e.title || (e.owner === "MARIO" ? "Mario" : "Moritz"),
      start: e.start.toISOString(),
      end: e.end ? e.end.toISOString() : undefined,
      allDay: e.allDay,
      color: e.owner === "MARIO" ? "#2196f3" : "#ff9800",
      extendedProps: { owner: e.owner },
    })),
    ...memoryEvents.map((e) => ({
      id: e.id,
      title: e.title || (e.owner === "MARIO" ? "Mario" : "Moritz"),
      start: e.start,
      end: e.end,
      allDay: e.allDay,
      color: e.owner === "MARIO" ? "#2196f3" : "#ff9800",
      extendedProps: { owner: e.owner },
    })),
  ];

  return NextResponse.json({ events: combined });
}

const CreateEventSchema = z.object({
  title: z.string().optional(),
  start: z.string(),
  end: z.string(),
  allDay: z.boolean().optional(),
  owner: z.enum(["MARIO", "MORITZ"]),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = CreateEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const { title, start, end, allDay, owner } = parsed.data;
  
  try {
    // prevent past bookings
    const now = new Date();
    const startDate = new Date(start);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (startDate < today) {
      return NextResponse.json({ error: "Cannot book in the past" }, { status: 400 });
    }
    
    const endDate = end ? new Date(end) : new Date(startDate.getTime() + 60 * 60 * 1000); // Default 1 hour
    
    // Check for overlapping events - improved logic
    const overlappingEvents = await prisma.boatEvent.findMany({
      where: {
        AND: [
          {
            // Events overlap if they share any time
            start: { lt: endDate },
            end: { gt: startDate }
          },
          {
            // Exclude background events (weekly blocks)
            NOT: {
              title: ""
            }
          }
        ]
      }
    });
    
    console.log('🔍 Checking for overlaps...');
    console.log('New event:', { 
      start: startDate.toISOString(), 
      end: endDate.toISOString(),
      startLocal: startDate.toLocaleString('de-DE'),
      endLocal: endDate.toLocaleString('de-DE')
    });
    console.log('Found overlapping events:', overlappingEvents.length);
    if (overlappingEvents.length > 0) {
      console.log('Overlapping events:', overlappingEvents.map(e => ({
        id: e.id,
        start: e.start.toISOString(),
        end: e.end?.toISOString(),
        owner: e.owner
      })));
    }
    
    if (overlappingEvents.length > 0) {
      console.log('❌ Overlap detected! Blocking booking.');
      return NextResponse.json({ error: "OVERLAP" }, { status: 409 });
    }
    
    console.log('✅ No overlaps found. Creating event.');
    
    const created = await prisma.boatEvent.create({
      data: {
        title,
        start: startDate,
        end: endDate,
        allDay: allDay ?? false,
        owner,
      },
    });
    return NextResponse.json({ event: created });
  } catch (error) {
    // Fallback to in-memory event in prototype mode
    // Check for overlaps in memory events
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date(startDate.getTime() + 60 * 60 * 1000);
    
    const hasOverlap = memoryEvents.some(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      
      // Simplified overlap logic: events overlap if they share any time
      return eventStart < endDate && eventEnd > startDate;
    });
    
    console.log('🔍 Checking for overlaps in memory...');
    console.log('New event:', { start: startDate, end: endDate });
    console.log('Memory events:', memoryEvents.length);
    
    if (hasOverlap) {
      console.log('❌ Overlap detected in memory! Blocking booking.');
      return NextResponse.json({ error: "OVERLAP" }, { status: 409 });
    }
    
    console.log('✅ No overlaps found in memory. Creating event.');
    
    const mem: MemoryEvent = {
      id: randomUUID(),
      title,
      start,
      end,
      allDay: allDay ?? false,
      owner,
    };
    memoryEvents.push(mem);
    return NextResponse.json({ event: mem });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  try {
    await prisma.boatEvent.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    const idx = memoryEvents.findIndex(e => e.id === id);
    if (idx !== -1) memoryEvents.splice(idx, 1);
    return NextResponse.json({ ok: idx !== -1 });
  }
}
