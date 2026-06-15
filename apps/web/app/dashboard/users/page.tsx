import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { redirect } from "next/navigation";
import { authApi } from "@/lib/api";
import { AuthUser, PaginatedResult } from "@/lib/types";
import RoleSelector from "./RoleSelector";
import ActiveToggle from "./ActiveToggle";
import ResetPasswordButton from "./ResetPasswordButton";
import ViewDocumentsButton from "./ViewDocumentsButton";
import PaginationControl from "@/components/PaginationControl";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const currentUser = await authApi<AuthUser>("/api/auth/me");
  if (currentUser.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const { page } = await searchParams;
  const result = await authApi<PaginatedResult<AuthUser>>(`/api/users?page=${page ?? "1"}`);
  const users = result.data;

  return (
    <div>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        บัญชีผู้ใช้งาน
      </Typography>

      <Paper variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ชื่อ</TableCell>
              <TableCell>อีเมล</TableCell>
              <TableCell>บทบาท</TableCell>
              <TableCell>เปิดใช้งาน</TableCell>
              <TableCell>เข้าร่วมเมื่อ</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <RoleSelector userId={user.id} role={user.role} />
                </TableCell>
                <TableCell>
                  <ActiveToggle userId={user.id} isActive={user.isActive ?? true} />
                </TableCell>
                <TableCell>{user.createdAt ? new Date(user.createdAt).toLocaleDateString("th-TH") : "-"}</TableCell>
                <TableCell>
                  <ViewDocumentsButton userId={user.id} name={user.name} />
                  <ResetPasswordButton userId={user.id} name={user.name} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <PaginationControl page={result.page} totalPages={result.totalPages} basePath="/dashboard/users" />
    </div>
  );
}
