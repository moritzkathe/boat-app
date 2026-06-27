"use client";
import { useState } from "react";
import {
  Box, Typography, Stack, Paper,
  Select, MenuItem, FormControl, InputLabel, ListSubheader,
  Chip,
} from "@mui/material";
import { CheckCircleOutline, PhoneOutlined, LanguageOutlined, InfoOutlined } from "@mui/icons-material";
import { dt } from "@/app/theme";

type BookingType = 'pompomela' | 'boatpark' | 'direkt';

type Harbor = {
  name: string;
  country: 'DE' | 'CH' | 'AT';
  km: number;
  kurzanleger: boolean;
  gastplaetze: number | string;
  kosten: string;
  buchung: BookingType;
  verfahren: string;
  telefon?: string;
  website?: string;
  notizen?: string;
};

const harbors: Record<string, Harbor[]> = {
  Deutschland: [
    {
      name: 'Hagnau',
      country: 'DE', km: 4,
      kurzanleger: true, gastplaetze: 7, kosten: '22 € / Nacht',
      buchung: 'pompomela',
      verfahren: 'Einfahren, 7er-Stander setzen — der Hafenmeister kommt zu dir. Buchung und Bezahlung direkt über die Pompomela-App.',
      telefon: '0159 0202 2295',
      website: 'https://www.gemeinde-hagnau.de/bootsliegeplaetze',
      notizen: 'Neuer Westhafen seit 2024 — einer der ersten Pompomela-Häfen am Bodensee. Check-in ab 16:00, Check-out bis 11:00.',
    },
    {
      name: 'Meersburg',
      country: 'DE', km: 8,
      kurzanleger: true, gastplaetze: 15, kosten: '12–18 € / Nacht + 2 € Kurtaxe',
      buchung: 'direkt',
      verfahren: 'Städtischer Seglerhafen (Am Waschplätzle). Einfahren, 7er-Stander setzen. Hafenmeister meldet sich i.d.R. 09:30–10:00 und 16:00–18:00 Uhr. Dienstag ist Ruhetag — dann Umschlag in den Briefkasten am Steg.',
      telefon: '07532 440-4710',
      notizen: 'Direkt in der Altstadt. Dienstag kein Hafenmeister — Zahlung per Briefkasten.',
    },
    {
      name: 'Friedrichshafen',
      country: 'DE', km: 10,
      kurzanleger: true, gastplaetze: 'mehrere', kosten: '7–21 € / Nacht',
      buchung: 'direkt',
      verfahren: 'BSB-Schiffshafen. Beim Hafenmeister persönlich melden. Hafen liegt zentral mit guter Infrastruktur (Strom, Wasser, Kran, WC-Entleerung).',
      telefon: '0170 1294797',
      website: 'https://www.bsb.de/de/info-service/liegeplatzverwaltung',
      notizen: 'Einfahrt im Osten der Stadt hinter dem roten Drehfeuer. Betreiber: BSB GmbH.',
    },
    {
      name: 'Langenargen',
      country: 'DE', km: 16,
      kurzanleger: true, gastplaetze: 6, kosten: '12 € / Nacht',
      buchung: 'direkt',
      verfahren: 'Gemeindehafen: beim Hafenmeister im Haus am Gondelhafen registrieren. Alternativ: BMK Yachthafen (größer, mit Restaurant Schuppen 13).',
      telefon: '07543 9618331',
      notizen: 'Zwei Optionen: Gemeindehafen (zentral, 6 Gastplätze) oder BMK Yachthafen (größer, mehr Service).',
    },
    {
      name: 'Überlingen',
      country: 'DE', km: 18,
      kurzanleger: true, gastplaetze: 'mehrere', kosten: '18 € / Nacht (bis 9 m)',
      buchung: 'direkt',
      verfahren: 'Sportboothafen Ost (Haupthafen). Einfahren, 7er-Stander setzen. Hafenmeister erscheint. In der Hochsaison max. 1 Nacht Gastaufenthalt. Saisonbetrieb 1. April – 31. Oktober.',
      telefon: '07551 915510',
      website: 'https://www.ueberlingen.de/hafenmeisterei-und-hafenverwaltung',
      notizen: 'Überlingen ist Kurort — ggf. Kurtaxe zusätzlich. Schöne Altstadt, BSB-Landungsbrücke direkt am Hafen.',
    },
    {
      name: 'Konstanz',
      country: 'DE', km: 22,
      kurzanleger: true, gastplaetze: 'mehrere', kosten: '7–21 € / Nacht',
      buchung: 'direkt',
      verfahren: 'Stadthafen (DSMC – Deutsch-Schweizerischer Motorboot-Club). Anlegen, beim Hafenmeister melden. Freie Plätze sind grün markiert. Ab 16:00 kostenpflichtig, Abfahrt bis 12:00.',
      telefon: '07531 26658',
      website: 'https://deutsch-schweizerischer-motorboot-club.de',
      notizen: 'Grenzübergang Schweiz fußläufig. Mindesttiefe 1,4 m. Größte Bodensee-Stadt.',
    },
    {
      name: 'Lindau',
      country: 'DE', km: 30,
      kurzanleger: true, gastplaetze: 'mehrere (5 Marinas)', kosten: '7–21 € / Nacht',
      buchung: 'direkt',
      verfahren: 'Hauptanlaufstelle: BSB Seehafen Lindau. Beim jeweiligen Hafenmeister melden. 5 verschiedene Marinas — Hafenmeister je nach Anleger anrufen.',
      telefon: '0171 8361629',
      website: 'https://www.stadtlindau.de/Quicknavigation/Startseite/Hafenmeister.php',
      notizen: 'Historische Inselstadt mit Löwen-Denkmal. Bayern-Vorschriften. 5 Marinas mit eigenen Hafenmeistern.',
    },
  ],
  Schweiz: [
    {
      name: 'Kreuzlingen',
      country: 'CH', km: 24,
      kurzanleger: true, gastplaetze: 8, kosten: 'ca. CHF 25 / Nacht',
      buchung: 'pompomela',
      verfahren: 'Bootshafen Seegarten. Einfahren, 7er-Stander setzen. Hafenmeister in der Seegartenscheune. Buchung und Bezahlung über Pompomela. Check-in 16:00, Check-out 11:00 (Juli–September).',
      telefon: '+41 71 677 63 71',
      website: 'https://www.kreuzlingen.ch/erlebnis/haefen',
      notizen: 'Grenzt direkt an Konstanz. Kein Zoll nötig — Bodensee ist Gemeinschaftssee. CHF oder EUR akzeptiert.',
    },
    {
      name: 'Arbon',
      country: 'CH', km: 32,
      kurzanleger: true, gastplaetze: 30, kosten: 'ca. CHF 20–35 / Nacht',
      buchung: 'boatpark',
      verfahren: 'Schlosshafen Arbon. Buchung über Boatpark-App oder direkt beim Hafenmeister. Gastbereich mit Duschen, WC und Gemeinschaftsraum. Kraftstoffstation im Hafen!',
      telefon: '+41 71 446 48 80',
      website: 'https://www.arbon.ch/freizeit/tourismus-und-mobilitaet/hafen.html/57',
      notizen: 'Tankstelle im Hafen — ideal für Betankung auf der Rückfahrt. Historisches Schloss direkt am Hafen.',
    },
    {
      name: 'Romanshorn',
      country: 'CH', km: 35,
      kurzanleger: true, gastplaetze: 40, kosten: 'CHF 25 / Nacht inkl. Strom',
      buchung: 'direkt',
      verfahren: 'SBS Yachthafen. Anlegen, Hafenmeisterbüro aufsuchen (8:00–12:00 und 13:30–18:30 Uhr). Keine Reservierung möglich — spontan anfahren und früh ankommen.',
      telefon: '+41 58 346 84 10',
      website: 'https://yachthafen-romanshorn.ch',
      notizen: 'Keine Reservierung möglich! Direkt an der Autofähre Romanshorn–Friedrichshafen. 40 Gastplätze — größtes Schweizer Angebot.',
    },
    {
      name: 'Rorschach',
      country: 'CH', km: 42,
      kurzanleger: true, gastplaetze: 8, kosten: 'ca. CHF 20–30 / Nacht',
      buchung: 'direkt',
      verfahren: 'Segelhafen Rorschach (GSR). Gastplätze im Zwischenhafen, geeignet für Übernachtung bei ruhigem Wetter. Beim Hafenmeister melden.',
      telefon: '+41 78 850 53 81',
      website: 'https://www.sgyc.ch/gsr',
      notizen: 'Nur 8 Gastplätze — bei schönem Wetter früh genug ankommen. 10 Min. Fußweg zum Stadtzentrum.',
    },
  ],
  Österreich: [
    {
      name: 'Bregenz',
      country: 'AT', km: 38,
      kurzanleger: true, gastplaetze: 30, kosten: '19 € / Nacht (bis 3 m Breite)',
      buchung: 'direkt',
      verfahren: 'Sporthafen Bregenz. Freie Gastplätze sind grün markiert, belegte rot. Beim Hafenmeister im Büro melden. Saisonbetrieb 1. April – 31. Oktober.',
      telefon: '+43 664 6141025',
      website: 'https://www.bregenz.gv.at/leben/sport/staedtische-sportanlagen/hafenanlagen/sporthafen',
      notizen: 'Kein Zoll — Bodensee ist Gemeinschaftssee. Cranchi 760 (ca. 2,65 m Breite) fällt in günstigste Kategorie. Festspielstadt!',
    },
  ],
};

const allHarbors = Object.values(harbors).flat();

const bookingLabels: Record<BookingType, { label: string; color: string }> = {
  pompomela: { label: 'Pompomela-App', color: dt.primary },
  boatpark:  { label: 'Boatpark-App',  color: '#2d7a4f' },
  direkt:    { label: 'Direkt / Tel.', color: dt.muted },
};

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

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <Stack direction="row" spacing="12px" alignItems="flex-start">
      <Box sx={{ color: dt.muted, mt: '2px', flexShrink: 0, display: 'flex' }}>{icon}</Box>
      <Box>
        <Typography sx={{ fontSize: '0.75rem', color: dt.muted, mb: '2px' }}>{label}</Typography>
        <Typography sx={{ fontSize: '0.875rem', color: dt.ink, lineHeight: 1.45 }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}

export default function HafenPage() {
  const [selectedName, setSelectedName] = useState('');

  const harbor = allHarbors.find(h => h.name === selectedName) ?? null;
  const booking = harbor ? bookingLabels[harbor.buchung] : null;

  return (
    <Box sx={{ my: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>

      {/* Header */}
      <Box>
        <Typography sx={{ fontSize: '1.625rem', fontWeight: 400, letterSpacing: '-0.03em', color: dt.ink, mb: '4px' }}>
          Häfen am Bodensee
        </Typography>
        <Typography sx={{ fontSize: '0.875rem', color: dt.muted }}>
          Gastlieger & Kurzanleger ab Immenstaad
        </Typography>
      </Box>

      {/* General rules box */}
      <Paper variant="outlined" sx={{ p: '16px 20px', backgroundColor: dt.canvasSoft }}>
        <Stack spacing="12px">
          <SectionLabel>Allgemeines Prozedere</SectionLabel>
          <Stack spacing="8px">
            {[
              '7er-Stander setzen (blau-weiße Flagge) — signalisiert dem Hafenmeister, dass du einen Gastplatz suchst.',
              'Kein VHF auf dem Bodensee — Hafenmeister kommen persönlich zu dir.',
              'Check-in ab 16:00 Uhr, Check-out bis 11:00 Uhr.',
              'Kein Hafenmeister da? Geld in Umschlag mit Bootsname & Kennzeichen in den Briefkasten am Steg.',
              'Schweiz & Österreich: kein Zoll nötig — Bodensee ist Gemeinschaftssee.',
            ].map((rule, i) => (
              <Stack key={i} direction="row" spacing="10px" alignItems="flex-start">
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: dt.muted, mt: '7px', flexShrink: 0 }} />
                <Typography sx={{ fontSize: '0.8125rem', color: dt.ink, lineHeight: 1.5 }}>
                  {rule}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Paper>

      {/* Selector */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <SectionLabel>Hafen auswählen</SectionLabel>
        <FormControl fullWidth>
          <InputLabel>Hafen</InputLabel>
          <Select
            value={selectedName}
            label="Hafen"
            onChange={(e) => setSelectedName(e.target.value)}
          >
            {Object.entries(harbors).map(([country, list]) => [
              <ListSubheader key={country} sx={{
                fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.7px',
                textTransform: 'uppercase', color: dt.muted,
                backgroundColor: dt.canvasSoft, lineHeight: '32px',
              }}>
                {country}
              </ListSubheader>,
              ...list.map(h => (
                <MenuItem key={h.name} value={h.name}>
                  <Stack direction="row" justifyContent="space-between" width="100%">
                    <span>{h.name}</span>
                    <Typography component="span" sx={{ fontSize: '0.8125rem', color: dt.muted }}>
                      ~{h.km} km
                    </Typography>
                  </Stack>
                </MenuItem>
              )),
            ])}
          </Select>
        </FormControl>
      </Box>

      {/* Harbor detail card */}
      {harbor && (
        <Paper variant="outlined" sx={{ p: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Harbor name + badges */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography sx={{ fontSize: '1.25rem', fontWeight: 500, color: dt.ink, letterSpacing: '-0.02em' }}>
                {harbor.name}
              </Typography>
              <Typography sx={{ fontSize: '0.8125rem', color: dt.muted, mt: '2px' }}>
                ~{harbor.km} km ab Immenstaad
              </Typography>
            </Box>
            <Stack direction="row" spacing="6px" alignItems="center">
              {harbor.kurzanleger && (
                <Chip
                  label="Kurzanleger"
                  size="small"
                  icon={<CheckCircleOutline sx={{ fontSize: '14px !important' }} />}
                  sx={{
                    fontSize: '0.6875rem', fontWeight: 600, height: 24,
                    backgroundColor: 'rgba(31,138,101,0.1)', color: '#1f8a65',
                    border: '1px solid rgba(31,138,101,0.2)',
                    '& .MuiChip-icon': { color: '#1f8a65' },
                  }}
                />
              )}
            </Stack>
          </Stack>

          <Box sx={{ height: '1px', backgroundColor: dt.hairline }} />

          {/* Übernachtung */}
          <Stack spacing="12px">
            <SectionLabel>Gastlieger / Übernachtung</SectionLabel>
            <Stack spacing="10px">
              <InfoRow
                icon={<CheckCircleOutline sx={{ fontSize: 16 }} />}
                label="Gastplätze"
                value={typeof harbor.gastplaetze === 'number' ? `${harbor.gastplaetze} Plätze` : harbor.gastplaetze}
              />
              <InfoRow
                icon={<InfoOutlined sx={{ fontSize: 16 }} />}
                label="Kosten"
                value={harbor.kosten}
              />
              <InfoRow
                icon={<InfoOutlined sx={{ fontSize: 16 }} />}
                label="Buchung"
                value={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mt: '2px' }}>
                    <Box sx={{
                      display: 'inline-block', px: '8px', py: '2px',
                      borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600,
                      backgroundColor: `${booking!.color}18`,
                      color: booking!.color,
                      border: `1px solid ${booking!.color}30`,
                    }}>
                      {booking!.label}
                    </Box>
                  </Box>
                }
              />
            </Stack>
          </Stack>

          <Box sx={{ height: '1px', backgroundColor: dt.hairline }} />

          {/* Verfahren */}
          <Stack spacing="10px">
            <SectionLabel>Wie es funktioniert</SectionLabel>
            <Typography sx={{ fontSize: '0.875rem', color: dt.ink, lineHeight: 1.6 }}>
              {harbor.verfahren}
            </Typography>
          </Stack>

          {/* Notizen */}
          {harbor.notizen && (
            <Box sx={{
              borderLeft: `2px solid ${dt.hairlineStrong}`,
              pl: '12px',
            }}>
              <Typography sx={{ fontSize: '0.8125rem', color: dt.muted, lineHeight: 1.5 }}>
                {harbor.notizen}
              </Typography>
            </Box>
          )}

          <Box sx={{ height: '1px', backgroundColor: dt.hairline }} />

          {/* Kontakt */}
          <Stack spacing="10px">
            <SectionLabel>Kontakt</SectionLabel>
            {harbor.telefon && (
              <InfoRow
                icon={<PhoneOutlined sx={{ fontSize: 16 }} />}
                label="Telefon"
                value={
                  <a href={`tel:${harbor.telefon.replace(/\s/g, '')}`} style={{ color: dt.primary, textDecoration: 'none' }}>
                    {harbor.telefon}
                  </a>
                }
              />
            )}
            {harbor.website && (
              <InfoRow
                icon={<LanguageOutlined sx={{ fontSize: 16 }} />}
                label="Website"
                value={
                  <a href={harbor.website} target="_blank" rel="noopener noreferrer" style={{ color: dt.primary, textDecoration: 'none', wordBreak: 'break-all' }}>
                    {harbor.website.replace(/^https?:\/\//, '')}
                  </a>
                }
              />
            )}
          </Stack>
        </Paper>
      )}

      {/* Empty state */}
      {!harbor && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography sx={{ fontSize: '0.875rem', color: dt.muted }}>
            Hafen auswählen für Gastlieger-Infos
          </Typography>
        </Box>
      )}

      {/* Footer */}
      <Typography sx={{ fontSize: '0.75rem', color: dt.mutedSoft, textAlign: 'center', lineHeight: 1.5 }}>
        Infos nach bestem Wissen · Gebühren und Verfahren können sich ändern
      </Typography>
    </Box>
  );
}
