import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: { main: "#2e7d32", light: "#4caf50", dark: "#1b5e20", contrastText: "#ffffff" },
    secondary: { main: "#66bb6a" },
    background: { default: "#f1f8f0", paper: "#ffffff" },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: ["var(--font-noto-sans-thai)", "var(--font-geist-sans)", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600 },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundColor: "#ffffff" },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
      },
      defaultProps: {
        variant: "outlined",
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderColor: "#c8e6c9" },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
  },
});
