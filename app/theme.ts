import { createTheme } from '@mui/material/styles';

// Design tokens from DESIGN.md (Cursor-inspired editorial style)
// Primary blue derived from design.md's timeline-read (#9fbbe0), saturated + darkened for AA contrast
export const dt = {
  primary:         '#4a82b4',
  primaryActive:   '#3a6d9a',
  ink:             '#26251e',
  body:            '#5a5852',
  muted:           '#807d72',
  mutedSoft:       '#a09c92',
  hairline:        '#e6e5e0',
  hairlineSoft:    '#efeee8',
  hairlineStrong:  '#cfcdc4',
  canvas:          '#f7f7f4',
  canvasSoft:      '#fafaf7',
  surfaceCard:     '#ffffff',
  surfaceStrong:   '#e6e5e0',
  onPrimary:       '#ffffff',
  semanticError:   '#cf2d56',
  semanticSuccess: '#1f8a65',
};

const theme = createTheme({
  palette: {
    primary: {
      main:         dt.primary,
      dark:         dt.primaryActive,
      contrastText: dt.onPrimary,
    },
    background: {
      default: dt.canvas,
      paper:   dt.surfaceCard,
    },
    text: {
      primary:   dt.ink,
      secondary: dt.body,
      disabled:  dt.mutedSoft,
    },
    divider: dt.hairline,
    error:   { main: dt.semanticError },
    success: { main: dt.semanticSuccess },
  },

  shape: { borderRadius: 8 }, // md = 8px base; cards override to 12px

  typography: {
    fontFamily: 'var(--font-inter), Inter, system-ui, "Helvetica Neue", Helvetica, Arial, sans-serif',
    // Display: weight 400, negative letter-spacing — editorial voice
    h1: { fontSize: '2rem',    fontWeight: 400, letterSpacing: '-0.04em', lineHeight: 1.1,  color: dt.ink },
    h2: { fontSize: '1.625rem',fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.2,  color: dt.ink },
    h3: { fontSize: '1.375rem',fontWeight: 400, letterSpacing: '-0.01em', lineHeight: 1.25, color: dt.ink },
    h4: { fontSize: '1.125rem',fontWeight: 600, letterSpacing: 0,         lineHeight: 1.4,  color: dt.ink },
    h5: { fontSize: '1rem',    fontWeight: 600, letterSpacing: 0,         lineHeight: 1.4,  color: dt.ink },
    h6: { fontSize: '0.875rem',fontWeight: 500, letterSpacing: 0,         lineHeight: 1.4,  color: dt.ink },
    body1:   { fontSize: '1rem',     fontWeight: 400, lineHeight: 1.5, color: dt.body },
    body2:   { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.5, color: dt.body },
    caption: { fontSize: '0.8125rem',fontWeight: 400, lineHeight: 1.4 },
    overline:{ fontSize: '0.6875rem',fontWeight: 600, lineHeight: 1.4, letterSpacing: '0.88px', textTransform: 'uppercase' as const },
    button:  { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.0, textTransform: 'none' as const },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          boxShadow: 'none',
          borderRadius: 8,
          '&:hover': { boxShadow: 'none' },
          '&:active': { boxShadow: 'none' },
        },
        contained: {
          backgroundColor: dt.primary,
          color: dt.onPrimary,
          height: 44,
          padding: '12px 20px',
          '&:hover': { backgroundColor: dt.primaryActive, boxShadow: 'none' },
          '&.Mui-disabled': { backgroundColor: dt.hairline, color: dt.mutedSoft },
        },
        outlined: {
          backgroundColor: dt.surfaceCard,
          color: dt.ink,
          borderColor: dt.hairlineStrong,
          height: 40,
          padding: '10px 18px',
          '&:hover': { backgroundColor: dt.canvasSoft, borderColor: dt.hairlineStrong, boxShadow: 'none' },
        },
        text: {
          color: dt.ink,
          '&:hover': { backgroundColor: 'rgba(38,37,30,0.05)' },
        },
        sizeLarge: { height: 44, padding: '12px 20px' },
        sizeSmall: { height: 32, padding: '6px 12px', fontSize: '0.8125rem' },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: 'none',
          border: `1px solid ${dt.hairline}`,
          backgroundColor: dt.surfaceCard,
        },
        outlined: { boxShadow: 'none' },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: 'none',
          border: `1px solid ${dt.hairline}`,
          overflow: 'hidden',
          backgroundColor: dt.surfaceCard,
        },
      },
    },

    MuiCardActionArea: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: dt.canvasSoft },
          '&:active': { backgroundColor: `rgba(38,37,30,0.04)` },
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: 'none',
          backgroundColor: dt.canvas,
          borderBottom: `1px solid ${dt.hairline}`,
          color: dt.ink,
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: dt.surfaceCard,
          borderRadius: 8,
          color: dt.ink,
          '& fieldset': { borderColor: dt.hairline },
          '&:hover fieldset': { borderColor: dt.hairlineStrong },
          '&.Mui-focused fieldset': { borderColor: dt.ink, borderWidth: '1px' },
        },
        input: { color: dt.ink },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: dt.muted,
          '&.Mui-focused': { color: dt.ink },
        },
      },
    },

    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderColor: dt.hairline,
          color: dt.body,
          fontWeight: 500,
          fontSize: '0.875rem',
          '&.Mui-selected': {
            backgroundColor: dt.ink,
            color: dt.canvas,
            borderColor: dt.ink,
            '&:hover': { backgroundColor: dt.ink },
          },
          '&:hover': { backgroundColor: dt.canvasSoft },
        },
      },
    },

    MuiDivider: {
      styleOverrides: { root: { borderColor: dt.hairlineSoft } },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            backgroundColor: dt.canvasSoft,
            borderBottom: `1px solid ${dt.hairline}`,
            color: dt.muted,
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: '0.88px',
            textTransform: 'uppercase',
            paddingTop: 10,
            paddingBottom: 10,
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${dt.hairlineSoft}`,
          color: dt.ink,
          fontSize: '0.875rem',
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: `${dt.canvasSoft} !important` },
          '&:last-child td, &:last-child th': { borderBottom: 0 },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: '0.6875rem',
          fontWeight: 600,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          borderRadius: 9999,
          height: 22,
          boxShadow: 'none',
        },
        colorPrimary: {
          backgroundColor: dt.ink,
          color: dt.canvas,
        },
        colorDefault: {
          backgroundColor: dt.surfaceStrong,
          color: dt.ink,
          border: 'none',
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          color: dt.muted,
          borderRadius: 8,
          '&:hover': {
            color: dt.semanticError,
            backgroundColor: 'rgba(207,45,86,0.06)',
          },
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 8, fontSize: '0.875rem' },
        standardError: { backgroundColor: 'rgba(207,45,86,0.06)', color: dt.semanticError },
        standardSuccess: { backgroundColor: 'rgba(31,138,101,0.06)', color: dt.semanticSuccess },
      },
    },
  },
});

export default theme;
