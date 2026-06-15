import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: { main: "#1b5e20", light: "#4caf50", dark: "#003212", contrastText: "#ffffff" },
    secondary: { main: "#37474f" },
    background: { default: "#ffffff", paper: "#ffffff" },
    divider: "#e6e8e6",
    text: { primary: "#1a1f1c", secondary: "#5f6b66" },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: ["var(--font-noto-sans-thai)", "var(--font-geist-sans)", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
    h4: { fontWeight: 700, letterSpacing: -0.3 },
    h5: { fontWeight: 700, letterSpacing: -0.2 },
    h6: { fontWeight: 700 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600 },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
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
        root: { borderColor: "#e6e8e6" },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
  },
});
