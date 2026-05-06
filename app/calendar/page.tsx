"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import deLocale from "@fullcalendar/core/locales/de";
import { Box, Stack, Divider } from "@mui/material";
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
      /* === Design tokens ===
         primary (blue): #4a82b4 | primary-active: #3a6d9a
         ink: #26251e | canvas: #f7f7f4 | canvas-soft: #fafaf7
         hairline: #e6e5e0 | muted: #807d72 | amber (Moritz): #c08532
      */

      /* ── Toolbar ── */
      .fc-header-toolbar {
        flex-direction: column !important;
        gap: 10px !important;
        padding: 16px 16px 8px !important;
      }
      .fc-header-toolbar .fc-toolbar-chunk:first-child {
        order: 1;
        text-align: center;
        font-size: 1rem;
        font-weight: 600;
        letter-spacing: -0.02em;
        color: #26251e;
      }
      .fc-header-toolbar .fc-toolbar-chunk:last-child {
        order: 2;
        display: flex;
        justify-content: center;
        gap: 6px;
      }

      /* ── Buttons ── */
      .fc-button {
        background-color: #ffffff !important;
        border: 1px solid #e6e5e0 !important;
        color: #807d72 !important;
        font-weight: 500 !important;
        font-size: 0.8125rem !important;
        box-shadow: none !important;
        border-radius: 8px !important;
        transition: background-color 0.15s, color 0.15s, border-color 0.15s !important;
        min-height: 36px !important;
        padding: 0 12px !important;
      }
      .fc-button:hover {
        background-color: #fafaf7 !important;
        border-color: #cfcdc4 !important;
        color: #26251e !important;
        box-shadow: none !important;
      }
      .fc-button-active,
      .fc-button-primary:not(:disabled).fc-button-active {
        background-color: #4a82b4 !important;
        border-color: #4a82b4 !important;
        color: #ffffff !important;
        box-shadow: none !important;
      }
      .fc-prev-button, .fc-next-button {
        background-color: #4a82b4 !important;
        border-color: #4a82b4 !important;
        color: #ffffff !important;
        width: 36px !important;
        padding: 0 !important;
      }
      .fc-prev-button:hover, .fc-next-button:hover {
        background-color: #3a6d9a !important;
        border-color: #3a6d9a !important;
      }
      .fc-today-button {
        background-color: #f7f7f4 !important;
        border-color: #e6e5e0 !important;
        color: #26251e !important;
      }
      .fc-today-button:hover {
        background-color: #efeee8 !important;
      }
      .fc-button:active { transform: scale(0.96) !important; }

      /* ── Grid lines ── */
      .fc-theme-standard td, .fc-theme-standard th {
        border-color: #efeee8 !important;
      }
      .fc-scrollgrid { border-radius: 0 0 12px 12px !important; }
      .fc-scrollgrid-section-header > td { border-top: none !important; }

      /* ── Column headers (Mon, Tue…) ── */
      .fc-col-header-cell {
        font-size: 0.6875rem !important;
        font-weight: 600 !important;
        letter-spacing: 0.6px !important;
        text-transform: uppercase !important;
        color: #a09c92 !important;
        background-color: #fafaf7 !important;
        padding: 10px 0 !important;
        border-bottom: 1px solid #e6e5e0 !important;
      }
      .fc-col-header-cell-cushion { text-decoration: none !important; color: inherit !important; }

      /* ── Day cells ── */
      .fc-daygrid-day { min-height: 64px !important; }
      .fc-daygrid-day-top { padding: 4px 6px !important; }
      .fc-daygrid-day-number {
        font-size: 0.8125rem !important;
        font-weight: 400 !important;
        color: #5a5852 !important;
        text-decoration: none !important;
        width: 26px;
        height: 26px;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        border-radius: 50% !important;
        transition: background-color 0.12s !important;
      }
      .fc-daygrid-day:not(.fc-day-today):hover .fc-daygrid-day-number {
        background-color: #efeee8 !important;
      }
      .fc-day-other .fc-daygrid-day-number { color: #cfcdc4 !important; }

      /* ── Today ── */
      .fc-day-today { background-color: transparent !important; }
      .fc-day-today .fc-daygrid-day-number {
        background-color: #4a82b4 !important;
        color: #ffffff !important;
        font-weight: 600 !important;
      }

      /* ── Events ── */
      .fc-event {
        border: none !important;
        border-radius: 6px !important;
        font-size: 0.8125rem !important;
        font-weight: 500 !important;
        padding: 2px 6px !important;
        cursor: pointer !important;
        touch-action: manipulation !important;
      }
      .fc-event:active { opacity: 0.8 !important; }
      .fc-event .fc-event-main { padding: 0 !important; }
      .fc-daygrid-event { margin: 1px 4px !important; }

      /* ── Time grid ── */
      .fc-timegrid-slot { min-height: 40px !important; }
      .fc-timegrid-slot-label-cushion { font-size: 0.75rem !important; color: #a09c92 !important; }

      /* ── Mobile ── */
      .fc-prev-button, .fc-next-button {
        min-width: 36px !important;
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
    <Box sx={{ my: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <EventCreator onCreated={refreshEvents} />
      <Divider />
      {/* Calendar wrapped in a rounded card */}
      <Box sx={{
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #e6e5e0',
        backgroundColor: '#ffffff',
      }}>
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
      </Box>{/* end calendar card */}

      {/* Legend */}
      <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="center">
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Box sx={{ width: 10, height: 10, borderRadius: '3px', backgroundColor: '#4a82b4', flexShrink: 0 }} />
          <span style={{ fontSize: '0.75rem', color: '#807d72', fontWeight: 500 }}>{t('calendar.mario')}</span>
        </Stack>
        <Box sx={{ width: 1, height: 12, backgroundColor: '#e6e5e0' }} />
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Box sx={{ width: 10, height: 10, borderRadius: '3px', backgroundColor: '#c08532', flexShrink: 0 }} />
          <span style={{ fontSize: '0.75rem', color: '#807d72', fontWeight: 500 }}>{t('calendar.moritz')}</span>
        </Stack>
      </Stack>
    </Box>
  );
}
