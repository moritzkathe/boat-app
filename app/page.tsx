"use client";
import Link from "next/link";
import { Box, Stack, Typography, Card, CardActionArea } from "@mui/material";
import { CalendarMonth, Payments, FavoriteBorder, QrCode2, LocalGasStation, Anchor } from "@mui/icons-material";
import { t } from "@/lib/i18n";
import { dt } from "./theme";

const navItems = [
  {
    href: "/calendar",
    icon: <CalendarMonth sx={{ fontSize: 20, color: dt.ink }} />,
    title: t('home.calendar.title'),
    subtitle: t('home.calendar.subtitle'),
  },
  {
    href: "/expenses",
    icon: <Payments sx={{ fontSize: 20, color: dt.ink }} />,
    title: t('home.expenses.title'),
    subtitle: t('home.expenses.subtitle'),
  },
  {
    href: "/wishlist",
    icon: <FavoriteBorder sx={{ fontSize: 20, color: dt.ink }} />,
    title: t('wishlist.title'),
    subtitle: t('wishlist.reasonPlaceholder'),
  },
  {
    href: "/pay",
    icon: <QrCode2 sx={{ fontSize: 20, color: dt.ink }} />,
    title: t('home.pay.title'),
    subtitle: t('home.pay.subtitle'),
  },
  {
    href: "/fuel",
    icon: <LocalGasStation sx={{ fontSize: 20, color: dt.ink }} />,
    title: "Spritrechner",
    subtitle: "Strecken & Wakeboard-Kosten",
  },
  {
    href: "/haefen",
    icon: <Anchor sx={{ fontSize: 20, color: dt.ink }} />,
    title: "Häfen",
    subtitle: "Gastlieger & Kurzanleger am Bodensee",
  },
];

export default function Home() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '28px', mt: 1 }}>

      {/* Hero image */}
      <Box sx={{
        borderRadius: '12px',
        overflow: 'hidden',
        border: `1px solid ${dt.hairline}`,
        lineHeight: 0,
      }}>
        <img
          src="/hero.jpg"
          alt="Cranchi Clipper"
          style={{ width: '100%', height: 210, objectFit: 'cover', display: 'block' }}
        />
      </Box>

      {/* Title block */}
      <Box>
        <Typography sx={{
          fontSize: '1.625rem',
          fontWeight: 400,
          letterSpacing: '-0.03em',
          lineHeight: 1.2,
          color: dt.ink,
          mb: '4px',
        }}>
          Cranchi Clipper
        </Typography>
        <Typography sx={{ fontSize: '0.875rem', color: dt.muted, lineHeight: 1.5 }}>
          {t('home.tagline')}
        </Typography>
      </Box>

      {/* Navigation cards */}
      <Stack spacing="10px">
        {navItems.map((item) => (
          <Card key={item.href}>
            <CardActionArea
              component={Link}
              href={item.href}
              sx={{ p: '18px 20px', minHeight: 68 }}
            >
              <Stack direction="row" spacing="14px" alignItems="center">
                <Box sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '8px',
                  border: `1px solid ${dt.hairline}`,
                  backgroundColor: dt.canvasSoft,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {item.icon}
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: dt.ink, lineHeight: 1.3, mb: '2px' }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ fontSize: '0.8125rem', color: dt.muted, lineHeight: 1.4 }}>
                    {item.subtitle}
                  </Typography>
                </Box>
              </Stack>
            </CardActionArea>
          </Card>
        ))}
      </Stack>

      {/* Footer links */}
      <Stack direction="row" justifyContent="center" spacing="20px">
        {[
          { href: '/status', label: t('home.status.title') },
          { href: '/backup-simple', label: 'Backup' },
        ].map((l) => (
          <Link key={l.href} href={l.href} style={{ textDecoration: 'none' }}>
            <Typography sx={{
              fontSize: '0.75rem',
              fontWeight: 500,
              color: dt.mutedSoft,
              letterSpacing: '0.02em',
            }}>
              {l.label}
            </Typography>
          </Link>
        ))}
      </Stack>
    </Box>
  );
}
