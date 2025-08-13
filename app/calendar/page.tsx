"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import deLocale from "@fullcalendar/core/locales/de";
import { Box, Chip, Stack, Divider } from "@mui/material";
import EventCreator from "./EventCreator";
import DeleteDialog from "./DeleteDialog";
import { t } from "@/lib/i18n";

type EventItem = {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  color?: string;
  display?: 'background';
  extendedProps?: { owner?: 'MARIO' | 'MORITZ' };
};

export default function CalendarPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const calendarRef = useRef<FullCalendar | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const todayStr = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }, []);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => setEvents(data.events || []))
      .catch(() => setEvents([]));
  }, []);

  const headerToolbar = useMemo(
    () => ({
      left: "dayGridMonth,timeGridWeek",
      center: "title",
      right: "prev,today,next",
    }),
    []
  );

  return (
    <Box sx={{ my: 2 }}>
      <EventCreator onCreated={() => {
        fetch("/api/events").then(r => r.json()).then(d => setEvents(d.events || []));
      }} />
      <Divider sx={{ my: 2 }} />
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={headerToolbar}
        firstDay={1}
        locales={[deLocale]}
        locale="de"
        events={events}
        validRange={{ start: todayStr }}
        allDaySlot={false}
        slotMinTime="06:00:00"
        slotMaxTime="23:00:00"
        slotDuration="01:00:00"
        snapDuration="01:00:00"
        slotLabelInterval="01:00"
        slotLabelFormat={{ hour: '2-digit', minute: '2-digit', hour12: false }}
        eventDisplay="block"
        displayEventTime={false}
        dateClick={(arg) => {
          if (arg.view.type === 'dayGridMonth') {
            const clicked = new Date(arg.date);
            const today = new Date(); today.setHours(0,0,0,0);
            if (clicked < today) return;
            const api = calendarRef.current?.getApi();
            api?.changeView('timeGridWeek', arg.date);
          }
        }}
        eventContent={(arg) => {
          if (arg.event.display === 'background') return undefined;
          const owner = arg.event.extendedProps?.owner as 'MARIO' | 'MORITZ' | undefined;
          const name = owner === 'MARIO' ? t('calendar.mario') : owner === 'MORITZ' ? t('calendar.moritz') : (arg.event.title || '');
          const el = document.createElement('div');
          el.textContent = name;
          return { domNodes: [el] };
        }}
        eventClick={(info) => {
          if (info.view.type !== 'timeGridWeek') return;
          if (info.event.display === 'background') return;
          setPendingDeleteId(info.event.id as string);
          setConfirmOpen(true);
        }}
      />
      <DeleteDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={async () => {
          if (pendingDeleteId) {
            await fetch(`/api/events?id=${pendingDeleteId}`, { method: 'DELETE' });
            fetch("/api/events").then(r => r.json()).then(d => setEvents(d.events || []));
          }
          setConfirmOpen(false);
          setPendingDeleteId(null);
        }}
      />
    </Box>
  );
}
