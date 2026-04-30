import { createTheme } from '@mui/material/styles';

const navy = '#0F1B3D';
const navyLight = '#1A2B5C';
const orange = '#F26B2A';
const orangeLight = '#FFE7D6';
const bgCanvas = '#F4F5F7';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: navy, dark: '#0A1330', light: navyLight },
    secondary: { main: orange, light: orangeLight, dark: '#D9551A' },
    background: { default: bgCanvas, paper: '#FFFFFF' },
    text: { primary: '#0F1B3D', secondary: '#6B7280' },
    success: { main: '#16A34A', light: '#DCFCE7' },
    warning: { main: '#F26B2A', light: '#FFE7D6' },
    info: { main: '#2563EB', light: '#DBEAFE' },
    divider: '#E5E7EB',
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
    h1: { fontWeight: 700, fontSize: '2.5rem', letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, fontSize: '2rem', letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, fontSize: '1.5rem' },
    h4: { fontWeight: 700, fontSize: '1.25rem' },
    h5: { fontWeight: 600, fontSize: '1.125rem' },
    h6: { fontWeight: 600, fontSize: '1rem' },
    body1: { fontSize: '0.95rem' },
    body2: { fontSize: '0.875rem' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: bgCanvas },
        '*': { boxSizing: 'border-box' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, paddingInline: 18, paddingBlock: 10 },
        containedSecondary: {
          color: '#FFFFFF',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
      },
    },
  },
});
