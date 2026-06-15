import Link from "next/link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default function ApplySuccessPage() {
  return (
    <Container component="main" maxWidth="sm" sx={{ flex: 1, py: 12, textAlign: "center" }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
        ส่งใบสมัครเรียบร้อยแล้ว!
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        ขอบคุณที่สมัครงานกับเรา ทีม HR จะตรวจสอบใบสมัครของคุณและติดต่อกลับหากคุณได้รับการคัดเลือกในขั้นตอนต่อไป
      </Typography>
      <Link href="/" style={{ color: "var(--mui-palette-primary-main)" }}>
        ← กลับไปยังตำแหน่งงานที่เปิดรับ
      </Link>
    </Container>
  );
}
