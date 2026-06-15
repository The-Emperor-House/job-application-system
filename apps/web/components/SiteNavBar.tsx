"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export interface NavItem {
  href: string;
  label: string;
}

export default function SiteNavBar({
  logoHref,
  logoLabel,
  links,
  right,
  maxWidth = 1024,
}: {
  logoHref: string;
  logoLabel: string;
  links: NavItem[];
  right?: React.ReactNode;
  maxWidth?: number;
}) {
  const pathname = usePathname();

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        boxShadow: "0 1px 2px rgba(16,24,20,0.04)",
      }}
    >
      <Toolbar sx={{ maxWidth, width: "100%", mx: "auto", gap: { xs: 1, md: 4 }, minHeight: { xs: 64, md: 72 }, px: { xs: 2, sm: 3 } }}>
        <Stack
          component={Link}
          href={logoHref}
          direction="row"
          spacing={1.25}
          sx={{ alignItems: "center", textDecoration: "none", color: "inherit", flexShrink: 0 }}
        >
          <Box component="img" src="/EMP_Logo.svg" alt="Logo" sx={{ height: 34 }} />
          <Typography sx={{ fontWeight: 800, fontSize: 17, letterSpacing: 0.2, whiteSpace: "nowrap" }}>
            {logoLabel}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={0.5} sx={{ flex: 1, overflowX: "auto" }}>
          {links.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Box
                key={link.href}
                component={Link}
                href={link.href}
                sx={{
                  px: 1.5,
                  py: 1,
                  borderRadius: 1.5,
                  fontSize: 14,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  textDecoration: "none",
                  color: active ? "primary.main" : "text.secondary",
                  bgcolor: active ? "rgba(27,94,32,0.08)" : "transparent",
                  transition: "background-color 0.15s, color 0.15s",
                  "&:hover": { color: "primary.main", bgcolor: "rgba(27,94,32,0.06)" },
                }}
              >
                {link.label}
              </Box>
            );
          })}
        </Stack>

        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", flexShrink: 0 }}>
          {right}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
