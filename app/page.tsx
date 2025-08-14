"use client";
import Link from "next/link";
import { Box, Stack, Typography, Card, CardMedia, CardContent, CardActionArea, Button } from "@mui/material";
import { CalendarMonth, Payments, FavoriteBorder, QrCode2 } from "@mui/icons-material";
import { t } from "@/lib/i18n";

export default function Home() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 4 }}>
      <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <CardMedia
          component="img"
          src="/hero.jpg"
          alt="Boot bei Sonnenuntergang"
          sx={{ height: 240, objectFit: 'cover' }}
        />
        <CardContent>
          <Typography variant="h4" fontWeight={600} gutterBottom>
            {t('home.headline')}
          </Typography>
          <Typography color="text.secondary">
            {t('home.tagline')}
          </Typography>
        </CardContent>
      </Card>

      <Stack direction="column" spacing={2}>
        <Card sx={{ borderRadius: 2, width: '100%' }}>
          <CardActionArea component={Link} href="/calendar" sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <CalendarMonth color="primary" sx={{ fontSize: 36 }} />
              <Box>
                <Typography variant="h6" fontWeight={600}>{t('home.calendar.title')}</Typography>
                <Typography color="text.secondary">{t('home.calendar.subtitle')}</Typography>
              </Box>
            </Stack>
          </CardActionArea>
        </Card>
        <Card sx={{ borderRadius: 2, width: '100%' }}>
          <CardActionArea component={Link} href="/expenses" sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Payments color="primary" sx={{ fontSize: 36 }} />
              <Box>
                <Typography variant="h6" fontWeight={600}>{t('home.expenses.title')}</Typography>
                <Typography color="text.secondary">{t('home.expenses.subtitle')}</Typography>
              </Box>
            </Stack>
          </CardActionArea>
        </Card>
        <Card sx={{ borderRadius: 2, width: '100%' }}>
          <CardActionArea component={Link} href="/wishlist" sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <FavoriteBorder color="primary" sx={{ fontSize: 36 }} />
              <Box>
                <Typography variant="h6" fontWeight={600}>{t('wishlist.title')}</Typography>
                <Typography color="text.secondary">{t('wishlist.reasonPlaceholder')}</Typography>
              </Box>
            </Stack>
          </CardActionArea>
        </Card>
        <Card sx={{ borderRadius: 2, width: '100%' }}>
          <CardActionArea component={Link} href="/pay" sx={{ p: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <QrCode2 color="primary" sx={{ fontSize: 36 }} />
              <Box>
                <Typography variant="h6" fontWeight={600}>{t('home.pay.title')}</Typography>
                <Typography color="text.secondary">{t('home.pay.subtitle')}</Typography>
              </Box>
            </Stack>
          </CardActionArea>
        </Card>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button 
            component={Link} 
            href="/status" 
            variant="text" 
            size="small"
            sx={{ 
              fontSize: '0.75rem',
              color: 'text.secondary',
              textTransform: 'none',
              p: 0.5
            }}
          >
            {t('home.status.title')}
          </Button>
          <Button 
            component={Link} 
            href="/backup" 
            variant="text" 
            size="small"
            sx={{ 
              fontSize: '0.75rem',
              color: 'text.secondary',
              textTransform: 'none',
              p: 0.5
            }}
          >
            Backup
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
