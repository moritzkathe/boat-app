"use client";
import { Box, Typography, Card, CardContent, CardMedia } from "@mui/material";
import { t } from "@/lib/i18n";

export default function PayPage() {
  return (
    <Box sx={{ my: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h6" fontWeight={600}>{t('home.pay.title')}</Typography>
      
      <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <CardMedia
          component="img"
          src="/paypal-qr.jpg"
          alt="PayPal QR Code"
          sx={{ height: 300, objectFit: 'contain', p: 2 }}
        />
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t('home.pay.title')}
          </Typography>
          <Typography color="text.secondary">
            {t('home.pay.subtitle')}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
