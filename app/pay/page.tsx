"use client";
import { Box, Card, CardMedia } from "@mui/material";

export default function PayPage() {
  return (
    <Box sx={{ my: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Card sx={{ borderRadius: 2, overflow: 'hidden', maxWidth: '100%' }}>
        <CardMedia
          component="img"
          src="/paypal-qr.jpg"
          alt="PayPal QR Code"
          sx={{ 
            width: '100%', 
            maxWidth: 400, 
            height: 'auto', 
            objectFit: 'contain',
            display: 'block'
          }}
        />
      </Card>
    </Box>
  );
}
