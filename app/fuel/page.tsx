"use client";
import { useState } from "react";
import {
  Box, Typography, Stack, Divider, Paper,
  ToggleButtonGroup, ToggleButton,
  Select, MenuItem, FormControl, InputLabel, ListSubheader,
} from "@mui/material";
import { dt } from "@/app/theme";

// Kosten werden aus km × Rate berechnet (1,50 €/km Sparfahrt, 1,80 €/km Gleitfahrt)
// Stimmt mit den PDF-Werten überein: z.B. Bregenz 38 km × 1,50 = 57 € ✓
const SPAR_PER_KM    = 1.50;
const GLEIT_PER_KM   = 1.80;

type Destination = { name: string; km: number; country: 'DE' | 'CH' | 'AT' };

const destinations: Record<string, Destination[]> = {
  Deutschland: [
    { name: 'Hagnau',                km: 4,  country: 'DE' },
    { name: 'Meersburg',             km: 8,  country: 'DE' },
    { name: 'Friedrichshafen',       km: 10, country: 'DE' },
    { name: 'Uhldingen-Mühlhofen',   km: 14, country: 'DE' },
    { name: 'Langenargen',           km: 16, country: 'DE' },
    { name: 'Überlingen',            km: 18, country: 'DE' },
    { name: 'Kressbronn',            km: 21, country: 'DE' },
    { name: 'Sipplingen',            km: 20, country: 'DE' },
    { name: 'Konstanz',              km: 22, country: 'DE' },
    { name: 'Wasserburg',            km: 26, country: 'DE' },
    { name: 'Bodman-Ludwigshafen',   km: 28, country: 'DE' },
    { name: 'Lindau',                km: 30, country: 'DE' },
  ],
  Schweiz: [
    { name: 'Münsterlingen',         km: 20, country: 'CH' },
    { name: 'Kreuzlingen',           km: 24, country: 'CH' },
    { name: 'Güttingen',             km: 28, country: 'CH' },
    { name: 'Arbon',                 km: 32, country: 'CH' },
    { name: 'Romanshorn',            km: 35, country: 'CH' },
    { name: 'Rorschach',             km: 42, country: 'CH' },
  ],
  Österreich: [
    { name: 'Hard',                  km: 36, country: 'AT' },
    { name: 'Bregenz',               km: 38, country: 'AT' },
    { name: 'Lochau',                km: 40, country: 'AT' },
  ],
};

const allDestinations = Object.values(destinations).flat();

const wakeModes = [
  {
    key:      'normal',
    label:    'Normal',
    sublabel: 'Standard Wakeboarden',
    note:     '40–60 l/h',
    minH: 70,  maxH: 110,
  },
  {
    key:      'intensiv',
    label:    'Intensiv',
    sublabel: 'Viel Anfahren & Wenden',
    note:     '60–80 l/h — mehr Verbrauch durch häufige Starts',
    minH: 110, maxH: 145,
  },
] as const;

const durationOptions = [
  { value: 0.5, label: '30 min' },
  { value: 1,   label: '1 Std'  },
  { value: 1.5, label: '1,5 Std'},
  { value: 2,   label: '2 Std'  },
];

type DriveMode = 'sparfahrt' | 'gleitfahrt';
type WakeKey   = typeof wakeModes[number]['key'];

const euro = new Intl.NumberFormat('de-DE', {
  style: 'currency', currency: 'EUR',
  minimumFractionDigits: 0, maximumFractionDigits: 0,
});

function SectionLabel({ children }: { children: string }) {
  return (
    <Typography sx={{
      fontSize: '0.6875rem', fontWeight: 600,
      letterSpacing: '0.88px', textTransform: 'uppercase', color: dt.muted,
    }}>
      {children}
    </Typography>
  );
}

function ResultRow({ label, value, accent, compact }: { label: string; value: string; accent?: boolean; compact?: boolean }) {
  return (
    <Box>
      <Typography sx={{ fontSize: '0.75rem', color: dt.muted, mb: '3px' }}>{label}</Typography>
      <Typography sx={{
        fontSize: compact ? '1.25rem' : '1.75rem', fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1,
        color: accent ? dt.primary : dt.ink,
      }}>
        {value}
      </Typography>
    </Box>
  );
}

function PickerBox({
  selected, onClick, children,
}: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        py: '10px', textAlign: 'center', borderRadius: '8px',
        border: `1px solid ${selected ? dt.primary : dt.hairline}`,
        backgroundColor: selected ? 'rgba(74,130,180,0.06)' : dt.surfaceCard,
        cursor: 'pointer', userSelect: 'none',
        transition: 'border-color 0.12s, background-color 0.12s',
        '&:hover': { borderColor: selected ? dt.primary : dt.hairlineStrong },
      }}
    >
      {children}
    </Box>
  );
}

const IMMENSTAAD = 'Immenstaad';

export default function FuelPage() {
  const [startName, setStartName] = useState(IMMENSTAAD);
  const [destName, setDestName]   = useState('');
  const [driveMode, setDriveMode] = useState<DriveMode>('gleitfahrt');
  const [persons, setPersons]     = useState(2);
  const [wakeKey, setWakeKey]     = useState<WakeKey>('normal');
  const [wakeDur, setWakeDur]     = useState(1);

  const startKm   = startName === IMMENSTAAD ? 0 : (allDestinations.find(d => d.name === startName)?.km ?? 0);
  const dest      = allDestinations.find(d => d.name === destName) ?? null;
  const routeKm   = dest ? Math.abs(dest.km - startKm) : null;
  const costPerKm = driveMode === 'sparfahrt' ? SPAR_PER_KM : GLEIT_PER_KM;
  const totalCost = routeKm != null ? Math.round(routeKm * 2 * costPerKm) : null;

  function handleStartChange(name: string) {
    setStartName(name);
    if (destName === name) setDestName('');
  }

  const wm          = wakeModes.find(m => m.key === wakeKey)!;
  const wakeCostMin = Math.round(wm.minH * wakeDur);
  const wakeCostMax = Math.round(wm.maxH * wakeDur);

  const durLabel = wakeDur === 0.5 ? '30 min' : wakeDur === 1 ? '1 Stunde' : `${wakeDur} Stunden`;

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
        <SectionLabel>Strecke</SectionLabel>

        {/* Start + Destination dropdowns */}
        <Stack direction="column" spacing="10px">
          {/* Von */}
          <FormControl fullWidth>
            <InputLabel>Von</InputLabel>
            <Select
              value={startName}
              label="Von"
              onChange={(e) => handleStartChange(e.target.value)}
            >
              <MenuItem value={IMMENSTAAD}>
                <Stack direction="row" justifyContent="space-between" width="100%">
                  <span>Immenstaad</span>
                  <Typography component="span" sx={{ fontSize: '0.8125rem', color: dt.primary, fontWeight: 500 }}>
                    Heimat
                  </Typography>
                </Stack>
              </MenuItem>
              <Box sx={{ height: '1px', backgroundColor: dt.hairline, mx: 1, my: '4px' }} />
              {Object.entries(destinations).map(([country, cities]) => [
                <ListSubheader key={country} sx={{
                  fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.7px',
                  textTransform: 'uppercase', color: dt.muted,
                  backgroundColor: dt.canvasSoft, lineHeight: '32px',
                }}>
                  {country}
                </ListSubheader>,
                ...cities.map(d => (
                  <MenuItem key={d.name} value={d.name}>
                    {d.name}
                  </MenuItem>
                )),
              ])}
            </Select>
          </FormControl>

          {/* Nach */}
          <FormControl fullWidth>
            <InputLabel>Nach</InputLabel>
            <Select
              value={destName}
              label="Nach"
              onChange={(e) => setDestName(e.target.value)}
            >
              {Object.entries(destinations).map(([country, cities]) => [
                <ListSubheader key={country} sx={{
                  fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.7px',
                  textTransform: 'uppercase', color: dt.muted,
                  backgroundColor: dt.canvasSoft, lineHeight: '32px',
                }}>
                  {country}
                </ListSubheader>,
                ...cities.filter(d => d.name !== startName).map(d => (
                  <MenuItem key={d.name} value={d.name}>
                    {d.name}
                  </MenuItem>
                )),
              ])}
            </Select>
          </FormControl>
        </Stack>

        {/* Drive mode */}
        <ToggleButtonGroup
          exclusive value={driveMode}
          onChange={(_, v) => v && setDriveMode(v)}
          sx={{ width: '100%' }}
        >
          <ToggleButton value="sparfahrt" sx={{ flex: 1, py: 1.5 }}>
            Sparfahrt
            <Box component="span" sx={{ ml: 0.75, fontSize: '0.75rem', opacity: 0.65 }}>6–8 km/h</Box>
          </ToggleButton>
          <ToggleButton value="gleitfahrt" sx={{ flex: 1, py: 1.5 }}>
            Gleitfahrt
            <Box component="span" sx={{ ml: 0.75, fontSize: '0.75rem', opacity: 0.65 }}>30–35 km/h</Box>
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Persons */}
        <Box>
          <Typography sx={{ fontSize: '0.8125rem', color: dt.muted, mb: 1 }}>Personen</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
            {[1, 2, 3, 4, 5, 6].map(n => (
              <PickerBox key={n} selected={persons === n} onClick={() => setPersons(n)}>
                <Typography sx={{ fontSize: '0.9375rem', fontWeight: persons === n ? 600 : 400, color: persons === n ? dt.primary : dt.ink }}>
                  {n}
                </Typography>
              </PickerBox>
            ))}
          </Box>
        </Box>

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
          ) : routeKm === 0 ? (
            <Typography sx={{ fontSize: '0.875rem', color: dt.mutedSoft, textAlign: 'center', py: 1 }}>
              Start und Ziel sind gleich
            </Typography>
          ) : (
            <>
              <Typography sx={{
                fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.88px',
                textTransform: 'uppercase', color: dt.muted, mb: '16px',
              }}>
                {startName} → {dest.name} → {startName} · {routeKm! * 2} km
              </Typography>
              <Stack direction="row" spacing={3} alignItems="flex-end">
                <ResultRow label="Gesamt (Hin & Zurück)" value={euro.format(totalCost!)} />
                <Box sx={{ width: '1px', height: 48, backgroundColor: dt.hairline, flexShrink: 0 }} />
                <ResultRow
                  label={`Pro Person (÷ ${persons})`}
                  value={euro.format(Math.round(totalCost! / persons))}
                  accent
                />
              </Stack>
            </>
          )}
        </Paper>

        {/* Tip */}
        <Typography sx={{
          fontSize: '0.8125rem', color: dt.muted, lineHeight: 1.5,
          borderLeft: `2px solid ${dt.hairlineStrong}`, pl: 1.5,
        }}>
          15–20 km/h vermeiden — teuerster Bereich. Entweder langsam oder sauber gleiten.
        </Typography>
      </Box>

      {/* ── Wakeboard ── */}
      <Paper variant="outlined" sx={{
        p: '20px 20px 24px',
        backgroundColor: dt.canvasSoft,
        display: 'flex', flexDirection: 'column', gap: 2,
      }}>
        <SectionLabel>Wakeboarden</SectionLabel>

        {/* Mode */}
        <ToggleButtonGroup
          exclusive value={wakeKey}
          onChange={(_, v) => v && setWakeKey(v)}
          sx={{ width: '100%' }}
        >
          {wakeModes.map(m => (
            <ToggleButton key={m.key} value={m.key} sx={{ flex: 1, py: 1.5 }}>
              {m.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {/* Mode explanation */}
        <Typography sx={{ fontSize: '0.8125rem', color: dt.muted, lineHeight: 1.5 }}>
          {wakeKey === 'normal'
            ? 'Gleichmäßige Fahrt — Motor läuft konstant im mittleren Bereich.'
            : 'Häufiges Anfahren und Wenden erhöht den Verbrauch deutlich — jeder Start kostet viel Sprit.'}
        </Typography>

        {/* Duration */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {durationOptions.map(({ value, label }) => (
            <PickerBox key={value} selected={wakeDur === value} onClick={() => setWakeDur(value)}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: wakeDur === value ? 600 : 400, color: wakeDur === value ? dt.primary : dt.ink }}>
                {label}
              </Typography>
            </PickerBox>
          ))}
        </Box>

        {/* Persons for wakeboard */}
        <Box>
          <Typography sx={{ fontSize: '0.8125rem', color: dt.muted, mb: 1 }}>Personen</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
            {[1, 2, 3, 4, 5, 6].map(n => (
              <PickerBox key={n} selected={persons === n} onClick={() => setPersons(n)}>
                <Typography sx={{ fontSize: '0.9375rem', fontWeight: persons === n ? 600 : 400, color: persons === n ? dt.primary : dt.ink }}>
                  {n}
                </Typography>
              </PickerBox>
            ))}
          </Box>
        </Box>

        {/* Result */}
        <Paper variant="outlined" sx={{ p: '20px 24px', backgroundColor: dt.surfaceCard }}>
          <Typography sx={{
            fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.88px',
            textTransform: 'uppercase', color: dt.muted, mb: '16px',
          }}>
            {wm.sublabel} · {durLabel}
          </Typography>
          <Stack direction="row" spacing={3} alignItems="flex-end">
            <ResultRow
              label="Spritkosten"
              value={`${wakeCostMin}–${wakeCostMax} €`}
              compact
            />
            <Box sx={{ width: '1px', height: 48, backgroundColor: dt.hairline, flexShrink: 0 }} />
            <ResultRow
              label={`Pro Person (÷ ${persons})`}
              value={`${Math.round(wakeCostMin / persons)}–${Math.round(wakeCostMax / persons)} €`}
              accent
              compact
            />
          </Stack>
        </Paper>
      </Paper>{/* end wakeboard card */}

      {/* Footer */}
      <Typography sx={{ fontSize: '0.75rem', color: dt.mutedSoft, textAlign: 'center', lineHeight: 1.5 }}>
        Richtwerte · 1,80 €/l · Sparfahrt 1,50 €/km · Gleitfahrt 1,80 €/km
      </Typography>
    </Box>
  );
}
