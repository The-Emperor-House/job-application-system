import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: { main: "#1d4ed8" },
    secondary: { main: "#0f172a" },
    background: { default: "#f8fafc" },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: ["var(--font-geist-sans)", "Roboto", "Helvetica", "Arial", "sans-serif"].join(","),
  },
});
