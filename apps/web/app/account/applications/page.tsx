import NavLink from "@/components/NavLink";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import { authApi } from "@/lib/api";
import { JobApplication } from "@/lib/types";

export default async function MyApplicationsPage() {
  const applications = await authApi<JobApplication[]>("/api/applications/my");

  return (
    <div>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        My Applications
      </Typography>

      {applications.length === 0 ? (
        <Typography color="text.secondary">You haven&apos;t applied to any positions yet.</Typography>
      ) : (
        <Paper variant="outlined">
          <Stack>
            {applications.map((app, i) => (
              <Box key={app.id}>
                {i > 0 && <Divider />}
                <Box
                  component={NavLink}
                  href={`/account/applications/${app.id}`}
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
                    <Typography sx={{ fontWeight: 500 }}>{app.jobPosting?.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Applied {new Date(app.createdAt).toLocaleDateString()}
                    </Typography>
                  </div>
                  <Chip label={app.status} size="small" color={app.status === "RETURNED" ? "warning" : "default"} />
                </Box>
              </Box>
            ))}
          </Stack>
        </Paper>
      )}
    </div>
  );
}
