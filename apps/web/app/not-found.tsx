import Link from "next/link";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function NotFound() {
  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{ flex: 1, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}
    >
      <Box>
        <Typography variant="h2" component="h1" sx={{ fontWeight: 700, color: "primary.main" }}>
          404
        </Typography>
        <Typography variant="h6" sx={{ mt: 1, mb: 1 }}>
          ไม่พบหน้านี้
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          หน้าที่คุณกำลังค้นหาไม่มีอยู่หรืออาจถูกย้ายไปแล้ว
        </Typography>
        <Button component={Link} href="/" variant="contained" size="large">
          กลับไปยังหน้าแรก
        </Button>
      </Box>
    </Container>
  );
}
