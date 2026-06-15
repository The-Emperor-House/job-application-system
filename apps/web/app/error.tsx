"use client";

import Link from "next/link";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{ flex: 1, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}
    >
      <Box>
        <Typography variant="h2" component="h1" sx={{ fontWeight: 700, color: "primary.main" }}>
          อุ๊ปส์
        </Typography>
        <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
          เกิดข้อผิดพลาด
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ คุณสามารถลองใหม่อีกครั้งหรือกลับไปยังหน้าแรก
        </Typography>
        <Stack direction="row" spacing={2} sx={{ justifyContent: "center" }}>
          <Button onClick={() => reset()} variant="outlined" size="large">
            ลองใหม่อีกครั้ง
          </Button>
          <Button component={Link} href="/" variant="contained" size="large">
            กลับไปยังหน้าแรก
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
