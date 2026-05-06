"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container, AppBar, Toolbar, Button, Box } from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { ThemeProvider } from "@mui/material/styles";
import { t } from "@/lib/i18n";
import theme, { dt } from "./theme";
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
      <AppBar position="fixed" color="inherit" elevation={0}>
        <Toolbar sx={{ minHeight: 64, px: 2 }}>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: '120px 1fr 120px',
            alignItems: 'center',
            width: '100%',
          }}>
            {/* Left: back */}
            <Box sx={{ justifySelf: 'start' }}>
              {!isHome && (
                <Button
                  component={Link}
                  href="/"
                  startIcon={<ArrowBackRoundedIcon sx={{ fontSize: '16px !important' }} />}
                  variant="text"
                  size="small"
                  sx={{ color: dt.body, fontSize: '0.875rem', fontWeight: 500, px: 1 }}
                >
                  {t('nav.back')}
                </Button>
              )}
            </Box>

            {/* Center: logo */}
            <Box sx={{ justifySelf: 'center' }}>
              <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
                <img src="/logo.svg" alt="Logo" style={{ width: 44, height: 44, display: 'block' }} />
              </Link>
            </Box>

            {/* Right: logout */}
            <Box sx={{ justifySelf: 'end' }}>
              <Button
                variant="text"
                size="small"
                onClick={handleLogout}
                sx={{ color: dt.muted, fontSize: '0.8125rem', fontWeight: 500, px: 1 }}
              >
                Abmelden
              </Button>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
        <Container maxWidth="sm" sx={{ pt: '80px', pb: '64px' }}>
          {children}
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
