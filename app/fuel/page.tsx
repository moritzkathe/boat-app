"use client";
import { useState } from "react";
import { Box, Typography, Stack, Divider, Paper, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { dt } from "@/app/theme";

const destinations = [
  { name: 'Hagnau',           km: 4,  sparfahrt: 6,  gleitfahrt: 7  },
  { name: 'Meersburg',        km: 8,  sparfahrt: 12, gleitfahrt: 14 },
  { name: 'Friedrichshafen',  km: 10, sparfahrt: 15, gleitfahrt: 18 },
  { name: 'Überlingen',       km: 18, sparfahrt: 27, gleitfahrt: 32 },
  { name: 'Konstanz',         km: 22, sparfahrt: 33, gleitfahrt: 40 },
  { name: 'Lindau',           km: 30, sparfahrt: 45, gleitfahrt: 54 },
  { name: 'Bregenz',          km: 38, sparfahrt: 57, gleitfahrt: 68 },
] as const;

const wakeModes = [
  { key: 'easy',      label: 'Gemütlich',  sublabel: 'Gleitfahrt',                         minH: 55,  maxH: 65  },
  { key: 'wake',      label: 'Wakeboard',  sublabel: 'Wakeboard / Wasserski',              minH: 70,  maxH: 110 },
  { key: 'intense',   label: 'Intensiv',   sublabel: 'Viel Anfahren & Wenden',             minH: 110, maxH: 145 },
] as const;

const durationOptions = [
  { value: 0.5, label: '30 min' },
  { value: 1,   label: '1 Std'  },
  { value: 1.5, label: '1,5 Std'},
  { value: 2,   label: '2 Std'  },
];

type DriveMode = 'sparfahrt' | 'gleitfahrt';
type TripMode  = 'one' | 'round';
type WakeKey   = typeof wakeModes[number]['key'];

function SectionLabel({ children }: { children: string }) {
  return (
    <Typography sx={{
      fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.88px',
      textTransform: 'uppercase', color: dt.muted,
    }}>
      {children}
    </Typography>
  );
}

function ResultRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <Box>
      <Typography sx={{ fontSize: '0.75rem', color: dt.muted, mb: '3px' }}>{label}</Typography>
      <Typography sx={{
        fontSize: '1.75rem', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1,
        color: accent ? dt.primary : dt.ink,
      }}>
        {value}
      </Typography>
    </Box>
  );
}

const euro = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 });

export default function FuelPage() {
  const [dest, setDest]           = useState<typeof destinations[number] | null>(null);
  const [driveMode, setDriveMode] = useState<DriveMode>('gleitfahrt');
  const [tripMode, setTripMode]   = useState<TripMode>('one');
  const [wakeKey, setWakeKey]     = useState<WakeKey>('wake');
  const [wakeDur, setWakeDur]     = useState(1);

  // Route calc
  const multi     = tripMode === 'round' ? 2 : 1;
  const totalKm   = dest ? dest.km * multi : null;
  const totalCost = dest ? dest[driveMode] * multi : null;

  // Wakeboard calc
  const wm           = wakeModes.find(m => m.key === wakeKey)!;
  const wakeCostMin  = Math.round(wm.minH * wakeDur);
  const wakeCostMax  = Math.round(wm.maxH * wakeDur);

  return (
    <Box sx={{ my: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>

      {/* Header */}
      <Box>
        <Typography sx={{ fontSize: '1.625rem', fontWeight: 400, letterSpacing: '-0.03em', color: dt.ink, mb: '4px' }}>
          Spritrechner
        </Typography>
        <Typography sx={{ fontSize: '0.875rem', color: dt.muted }}>
          Cranchi Clipper 760 · Volvo Penta 275 PS · 1,80 €/l
        </Typography>
      </Box>

      {/* ── Strecke ── */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <SectionLabel>Ziel ab Immenstaad</SectionLabel>

        {/* Destination grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {destinations.map((d) => {
            const selected = dest?.name === d.name;
            return (
              <Box
                key={d.name}
                onClick={() => setDest(selected ? null : d)}
                sx={{
                  p: '12px 14px',
                  borderRadius: '8px',
                  border: `1px solid ${selected ? dt.primary : dt.hairline}`,
                  backgroundColor: selected ? 'rgba(74,130,180,0.06)' : dt.surfaceCard,
                  cursor: 'pointer',
                  userSelect: 'none',
                  transition: 'border-color 0.12s, background-color 0.12s',
                  '&:hover': {
                    borderColor: selected ? dt.primary : dt.hairlineStrong,
                    backgroundColor: selected ? 'rgba(74,130,180,0.09)' : dt.canvasSoft,
                  },
                }}
              >
                <Typography sx={{ fontSize: '0.9375rem', fontWeight: selected ? 600 : 400, color: selected ? dt.primary : dt.ink, lineHeight: 1.3 }}>
                  {d.name}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: dt.muted, mt: '2px' }}>
                  {d.km} km
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Drive mode */}
        <ToggleButtonGroup exclusive value={driveMode} onChange={(_, v) => v && setDriveMode(v)} sx={{ width: '100%' }}>
          <ToggleButton value="sparfahrt"  sx={{ flex: 1, py: 1.5 }}>Sparfahrt <Box component="span" sx={{ ml: 0.5, fontSize: '0.75rem', color: 'inherit', opacity: 0.65 }}>6–8 km/h</Box></ToggleButton>
          <ToggleButton value="gleitfahrt" sx={{ flex: 1, py: 1.5 }}>Gleitfahrt <Box component="span" sx={{ ml: 0.5, fontSize: '0.75rem', color: 'inherit', opacity: 0.65 }}>30–35 km/h</Box></ToggleButton>
        </ToggleButtonGroup>

        {/* Trip type */}
        <ToggleButtonGroup exclusive value={tripMode} onChange={(_, v) => v && setTripMode(v)} sx={{ width: '100%' }}>
          <ToggleButton value="one"   sx={{ flex: 1, py: 1.5 }}>Hinfahrt</ToggleButton>
          <ToggleButton value="round" sx={{ flex: 1, py: 1.5 }}>Hin & Zurück</ToggleButton>
        </ToggleButtonGroup>

        {/* Result */}
        <Paper variant="outlined" sx={{
          p: '20px 24px',
          backgroundColor: dest ? 'rgba(74,130,180,0.04)' : dt.canvasSoft,
          borderColor:     dest ? 'rgba(74,130,180,0.2)'  : dt.hairline,
          transition: 'background-color 0.2s, border-color 0.2s',
        }}>
          {!dest ? (
            <Typography sx={{ fontSize: '0.875rem', color: dt.mutedSoft, textAlign: 'center', py: 1 }}>
              Ziel auswählen
            </Typography>
          ) : (
            <>
              <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.88px', textTransform: 'uppercase', color: dt.muted, mb: '16px' }}>
                Immenstaad → {dest.name}{tripMode === 'round' ? ' → Immenstaad' : ''} · {totalKm} km
              </Typography>
              <Stack direction="row" spacing={3} alignItems="flex-end">
                <ResultRow label="Gesamt" value={euro.format(totalCost!)} />
                <Box sx={{ width: '1px', height: 48, backgroundColor: dt.hairline, flexShrink: 0 }} />
                <ResultRow label="Pro Person" value={euro.format(Math.round(totalCost! / 2))} accent />
              </Stack>
            </>
          )}
        </Paper>

        {/* Tip */}
        <Typography sx={{ fontSize: '0.8125rem', color: dt.muted, lineHeight: 1.5, borderLeft: `2px solid ${dt.hairlineStrong}`, pl: 1.5 }}>
          15–20 km/h vermeiden — teuerster Bereich. Entweder langsam oder sauber gleiten.
        </Typography>
      </Box>

      <Divider />

      {/* ── Wakeboard ── */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <SectionLabel>Wakeboarden & Wasserski</SectionLabel>

        {/* Intensity */}
        <ToggleButtonGroup exclusive value={wakeKey} onChange={(_, v) => v && setWakeKey(v)} sx={{ width: '100%' }}>
          {wakeModes.map(m => (
            <ToggleButton key={m.key} value={m.key} sx={{ flex: 1, py: 1.5, fontSize: '0.8125rem' }}>
              {m.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {/* Duration */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {durationOptions.map(({ value, label }) => {
            const selected = wakeDur === value;
            return (
              <Box
                key={value}
                onClick={() => setWakeDur(value)}
                sx={{
                  py: '10px',
                  textAlign: 'center',
                  borderRadius: '8px',
                  border: `1px solid ${selected ? dt.primary : dt.hairline}`,
                  backgroundColor: selected ? 'rgba(74,130,180,0.06)' : dt.surfaceCard,
                  cursor: 'pointer',
                  userSelect: 'none',
                  transition: 'border-color 0.12s, background-color 0.12s',
                  '&:hover': { borderColor: dt.hairlineStrong },
                }}
              >
                <Typography sx={{ fontSize: '0.875rem', fontWeight: selected ? 600 : 400, color: selected ? dt.primary : dt.ink }}>
                  {label}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Result */}
        <Paper variant="outlined" sx={{ p: '20px 24px' }}>
          <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.88px', textTransform: 'uppercase', color: dt.muted, mb: '16px' }}>
            {wm.sublabel} · {wakeDur < 1 ? '30 min' : wakeDur === 1 ? '1 Stunde' : `${wakeDur} Stunden`}
          </Typography>
          <Stack direction="row" spacing={3} alignItems="flex-end">
            <ResultRow label="Spritkosten" value={`${euro.format(wakeCostMin)}–${euro.format(wakeCostMax)}`} />
            <Box sx={{ width: '1px', height: 48, backgroundColor: dt.hairline, flexShrink: 0 }} />
            <ResultRow label="Pro Person" value={`${euro.format(Math.round(wakeCostMin / 2))}–${euro.format(Math.round(wakeCostMax / 2))}`} accent />
          </Stack>
        </Paper>
      </Box>

      {/* Footer note */}
      <Typography sx={{ fontSize: '0.75rem', color: dt.mutedSoft, textAlign: 'center', lineHeight: 1.5 }}>
        Richtwerte gemäß Spritkostenübersicht · gerechnet mit 1,80 €/l
      </Typography>
    </Box>
  );
}
