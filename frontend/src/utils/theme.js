import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a1a2e',
      light: '#16213e',
      dark: '#0f0f23',
    },
    secondary: {
      main: '#e94560',
      light: '#ff6b84',
      dark: '#c73652',
    },
    background: {
      default: '#f5f6fa',
      paper: '#ffffff',
    },
    success: { main: '#00b894' },
    warning: { main: '#fdcb6e' },
    error: { main: '#e17055' },
  },
  typography: {
    fontFamily: '"DM Sans", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '8px 20px',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #16213e 0%, #0f0f23 100%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #e94560 0%, #c73652 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #c73652 0%, #a52d43 100%)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.04)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: 8 },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            fontWeight: 700,
            background: '#f5f6fa',
            color: '#1a1a2e',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

export default theme;
