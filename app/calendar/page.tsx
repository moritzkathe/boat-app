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
import { t } from "../../lib/i18n";

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
      /* === Design tokens === */
      /* ink: #26251e | canvas: #f7f7f4 | canvas-soft: #fafaf7 */
      /* hairline: #e6e5e0 | muted: #807d72 | primary: #f54e00 */

      .fc-header-toolbar {
        flex-direction: column !important;
        gap: 8px !important;
      }
      .fc-header-toolbar .fc-toolbar-chunk:first-child {
        order: 1;
        text-align: center;
        font-size: 1rem;
        font-weight: 600;
        letter-spacing: -0.01em;
        color: #26251e;
      }
      .fc-header-toolbar .fc-toolbar-chunk:last-child {
        order: 2;
        display: flex;
        justify-content: center;
        gap: 6px;
      }
      .fc-button {
        background-color: #ffffff !important;
        border-color: #e6e5e0 !important;
        color: #807d72 !important;
        font-weight: 500 !important;
        font-size: 0.8125rem !important;
        box-shadow: none !important;
        border-radius: 8px !important;
        transition: background-color 0.15s ease, color 0.15s ease !important;
      }
      .fc-button:hover {
        background-color: #fafaf7 !important;
        border-color: #cfcdc4 !important;
        color: #26251e !important;
        box-shadow: none !important;
      }
      .fc-button-active, .fc-button-primary:not(:disabled).fc-button-active {
        background-color: #26251e !important;
        border-color: #26251e !important;
        color: #f7f7f4 !important;
        box-shadow: none !important;
      }
      .fc-prev-button, .fc-next-button {
        background-color: #26251e !important;
        border-color: #26251e !important;
        color: #f7f7f4 !important;
      }
      .fc-prev-button:hover, .fc-next-button:hover {
        background-color: #3d3c34 !important;
        border-color: #3d3c34 !important;
      }
      .fc-today-button {
        background-color: #f7f7f4 !important;
        border-color: #e6e5e0 !important;
        color: #26251e !important;
      }
      .fc-today-button:hover {
        background-color: #efeee8 !important;
      }
      /* Calendar grid */
      .fc-theme-standard td, .fc-theme-standard th {
        border-color: #efeee8 !important;
      }
      .fc-col-header-cell {
        font-size: 0.6875rem !important;
        font-weight: 600 !important;
        letter-spacing: 0.5px !important;
        text-transform: uppercase !important;
        color: #807d72 !important;
        background-color: #fafaf7 !important;
        padding: 8px 0 !important;
      }
      .fc-daygrid-day-number {
        color: #5a5852 !important;
        font-size: 0.8125rem !important;
        font-weight: 400 !important;
      }
      .fc-day-today {
        background-color: rgba(245,78,0,0.04) !important;
      }
      .fc-day-today .fc-daygrid-day-number {
        color: #f54e00 !important;
        font-weight: 600 !important;
      }
      /* Mobile touch */
      .fc-button {
        min-height: 44px !important;
        min-width: 44px !important;
        touch-action: manipulation !important;
      }
      .fc-button:active {
        transform: scale(0.97) !important;
      }
      .fc-event {
        min-height: 24px !important;
        touch-action: manipulation !important;
        border-radius: 4px !important;
        border: none !important;
        font-size: 0.8125rem !important;
        font-weight: 500 !important;
      }
      .fc-event:active {
        opacity: 0.8 !important;
      }
      .fc-daygrid-day {
        min-height: 60px !important;
      }
      .fc-timegrid-slot {
        min-height: 40px !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const refreshEvents = async () => {
    try {
      const response = await fetch("/api/events");
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error refreshing events:', error);
    }
  };

  return (
    <Box sx={{ my: 2 }}>
      <EventCreator onCreated={refreshEvents} />
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
        onConfirm={async () => {
          if (!pendingDeleteId) return;
          try {
            await fetch(`/api/events?id=${pendingDeleteId}`, { method: 'DELETE' });
            await refreshEvents();
          } catch (error) {
            console.error('Error deleting event:', error);
          } finally {
            setConfirmOpen(false);
            setPendingDeleteId(null);
          }
        }}
      />
      <Stack direction="row" spacing={1} mt={2} alignItems="center" justifyContent="center">
        <Chip size="small" label={t('calendar.mario')} sx={{ bgcolor: "#2196f3", color: "white" }} />
        <Chip size="small" label={t('calendar.moritz')} sx={{ bgcolor: "#ff9800", color: "white" }} />
      </Stack>
    </Box>
  );
}
