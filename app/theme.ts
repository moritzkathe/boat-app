import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1e88e5',
    },
    background: {
      default: '#fafafa',
    },
  },
  typography: {
    fontFamily: 'var(--font-inter), Inter, Roboto, Helvetica, Arial, sans-serif',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'saturate(180%) blur(8px)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

export default theme;
