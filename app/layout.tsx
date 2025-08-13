import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "./ThemeRegistry";
import { AppBar, Toolbar, Typography, Box, Container, Button } from "@mui/material";
import { t } from "@/lib/i18n";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: t('app.title'),
  description: "Kalender, Ausgaben & Wunschliste",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={inter.variable}>
        <ThemeRegistry>
          <AppBar position="sticky" elevation={0} sx={{ borderRadius: 0 }}>
            <Toolbar>
              <Box sx={{ display: 'grid', gridTemplateColumns: '120px 1fr 120px', alignItems: 'center', width: '100%' }}>
                <Box sx={{ justifySelf: 'start' }}>
                  <Button 
                    component="a" 
                    href="/" 
                    sx={{ 
                      color: 'inherit', 
                      textDecoration: 'none',
                      display: { xs: 'none', sm: 'block' }
                    }}
                  >
                    ← {t('nav.back')}
                  </Button>
                </Box>
                <Box sx={{ justifySelf: 'center', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <img src="/logo.svg" alt="Logo" style={{ width: 48, height: 48, display: 'block' }} />
                  <Typography variant="h6" component="a" href="/" sx={{ fontWeight: 700, textDecoration: 'none', color: 'inherit', letterSpacing: '0.2px' }}>
                    {t('app.title')}
                  </Typography>
                </Box>
                <Box sx={{ justifySelf: 'end' }}></Box>
              </Box>
            </Toolbar>
          </AppBar>
          <Container maxWidth="sm" sx={{ pb: 6 }}>
            {children}
          </Container>
        </ThemeRegistry>
      </body>
    </html>
  );
}
