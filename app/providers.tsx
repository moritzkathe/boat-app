"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container, AppBar, Toolbar, Button, Box } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import LogoutIcon from "@mui/icons-material/Logout";
import { ThemeProvider } from "@mui/material/styles";
import { t } from "@/lib/i18n";
import theme from "./theme";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/de";

export default function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  
  const handleLogout = () => {
    localStorage.removeItem('boat-app-authenticated');
    window.location.reload();
  };
  
  return (
    <ThemeProvider theme={theme}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'saturate(180%) blur(8px)',
          zIndex: 1100,
        }}
      >
        <Toolbar sx={{ minHeight: 64, px: 2 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '120px 1fr 120px', alignItems: 'center', width: '100%' }}>
            <Box sx={{ justifySelf: 'start' }}>
              {!isHome && (
                <Button component={Link} href="/" startIcon={<ArrowBackRoundedIcon />} color="primary">
                  {t('nav.back')}
                </Button>
              )}
            </Box>
            <Box sx={{ justifySelf: 'center', display: 'flex', alignItems: 'center' }}>
              <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
                <img src="/logo.svg" alt="Logo" style={{ width: 48, height: 48, display: 'block' }} />
              </Link>
            </Box>
            <Box sx={{ justifySelf: 'end' }}>
              <Button
                variant="text"
                size="small"
                onClick={handleLogout}
                sx={{ fontSize: '0.75rem' }}
              >
                Abmelden
              </Button>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
        <Container maxWidth="sm" sx={{ paddingTop: 10, paddingBottom: 6 }}>
          {children}
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
