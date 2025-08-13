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

  // Add custom CSS for calendar styling
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .fc-header-toolbar {
        flex-direction: column !important;
        gap: 8px !important;
      }
      .fc-header-toolbar .fc-toolbar-chunk:first-child {
        order: 1;
        text-align: center;
        font-size: 1.2rem;
        font-weight: 600;
        color: #1e88e5;
      }
      .fc-header-toolbar .fc-toolbar-chunk:last-child {
        order: 2;
        display: flex;
        justify-content: center;
        gap: 8px;
      }
      .fc-button {
        background-color: #f5f5f5 !important;
        border-color: #e0e0e0 !important;
        color: #1e88e5 !important;
        font-weight: 500 !important;
      }
      .fc-button:hover {
        background-color: #e3f2fd !important;
        border-color: #1e88e5 !important;
      }
      .fc-button-active {
        background-color: #1e88e5 !important;
        border-color: #1e88e5 !important;
        color: white !important;
      }
      .fc-prev-button, .fc-next-button {
        background-color: #1e88e5 !important;
        border-color: #1e88e5 !important;
        color: white !important;
      }
      .fc-prev-button:hover, .fc-next-button:hover {
        background-color: #1565c0 !important;
        border-color: #1565c0 !important;
      }
      .fc-today-button {
        background-color: #f5f5f5 !important;
        border-color: #e0e0e0 !important;
        color: #1e88e5 !important;
      }
      .fc-today-button:hover {
        background-color: #e3f2fd !important;
        border-color: #1e88e5 !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

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
        headerToolbar={{
          left: 'title',
          center: '',
          right: 'dayGridMonth,timeGridWeek prev,today,next'
        }}
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
        height="auto"
        titleFormat={{ month: 'short', year: 'numeric' }}
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
          // Allow cancel only in week view and for non-background events
          if (info.view.type !== 'timeGridWeek') return;
          if (info.event.display === 'background') return;
          setPendingDeleteId(info.event.id as string);
          setConfirmOpen(true);
        }}
      />
      <DeleteDialog
        open={confirmOpen}
        onClose={() => { setConfirmOpen(false); setPendingDeleteId(null); }}
        onConfirm={() => {
          if (!pendingDeleteId) return;
          fetch(`/api/events?id=${pendingDeleteId}`, { method: 'DELETE' })
            .then(() => fetch('/api/events'))
            .then((r) => r.json())
            .then((d) => setEvents(d.events || []))
            .finally(() => { setConfirmOpen(false); setPendingDeleteId(null); });
        }}
      />
      <Stack direction="row" spacing={1} mt={2} alignItems="center" justifyContent="center">
        <Chip size="small" label={`${t('calendar.mario')} (${t('calendar.primary')})`} sx={{ bgcolor: "#e3f2fd", color: "#0d47a1" }} />
        <Chip size="small" label={`${t('calendar.moritz')} (${t('calendar.primary')})`} sx={{ bgcolor: "#ffe0b2", color: "#e65100" }} />
      </Stack>
    </Box>
  );
}
