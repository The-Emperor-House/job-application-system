import NavLink from "@/components/NavLink";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import { authApi } from "@/lib/api";
import { ApplicationStatus, JobApplication, PaginatedResult } from "@/lib/types";
import PaginationControl from "@/components/PaginationControl";

const statuses: ApplicationStatus[] = ["PENDING", "REVIEWING", "INTERVIEW", "OFFERED", "REJECTED", "HIRED", "RETURNED"];

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status, page } = await searchParams;
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (page) params.set("page", page);
  const query = params.toString() ? `?${params.toString()}` : "";
  const result = await authApi<PaginatedResult<JobApplication>>(`/api/applications${query}`);
  const applications = result.data;

  return (
    <div>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Applications
      </Typography>

      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 3 }}>
        <FilterChip label="All" active={!status} href="/dashboard/applications" />
        {statuses.map((s) => (
          <FilterChip key={s} label={s} active={status === s} href={`/dashboard/applications?status=${s}`} />
        ))}
      </Stack>

      <Paper variant="outlined">
        <Stack>
          {applications.map((app, i) => (
            <Box key={app.id}>
              {i > 0 && <Divider />}
              <Box
                component={NavLink}
                href={`/dashboard/applications/${app.id}`}
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  textDecoration: "none",
                  color: "inherit",
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <div>
                  <Typography sx={{ fontWeight: 500 }}>{app.fullName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {app.jobPosting?.title} · {app.email} · {new Date(app.createdAt).toLocaleDateString()}
                  </Typography>
                </div>
                <Chip label={app.status} size="small" />
              </Box>
            </Box>
          ))}
          {applications.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
              No applications found.
            </Typography>
          )}
        </Stack>
      </Paper>

      <PaginationControl
        page={result.page}
        totalPages={result.totalPages}
        basePath="/dashboard/applications"
        extraParams={{ status }}
      />
    </div>
  );
}

function FilterChip({ label, active, href }: { label: string; active: boolean; href: string }) {
  return (
    <Chip
      component={NavLink}
      href={href}
      label={label}
      clickable
      size="small"
      color={active ? "primary" : "default"}
      variant={active ? "filled" : "outlined"}
    />
  );
}
