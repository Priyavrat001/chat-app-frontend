import { useFetchData } from "6pp";
import {
  GroupsRounded as GroupIcon,
  MessageRounded as MessageIcon,
  PeopleAltRounded as PersonIcon,
} from "@mui/icons-material";
import { Box, Paper, Skeleton, Stack, Typography } from "@mui/material";
import moment from "moment/moment";
import WighetComponent from "../../components/WighetComponent";
import AdminLayout from "../../components/layouts/admin/AdminLayout";
import { DoughnutChart, LineChart } from "../../components/specifics/admin/Charts";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hook";

const Dashboard = () => {
  const { loading, data, error } = useFetchData(
    `${server}/admin/stats`,
    "dashboard-stats",
  );
  const { stats } = data || {};

  useErrors([{ isError: error, error }]);

  const singleChats = Math.max(
    (stats?.totalChatsCount || 0) - (stats?.groupsCount || 0),
    0,
  );
  const dateLabel = moment().format("ddd, D MMMM YYYY");

  return (
    <AdminLayout>
      {loading ? (
        <Stack spacing={3}>
          <Skeleton variant="rounded" height={150} sx={{ borderRadius: 4 }} />
          <Skeleton variant="rounded" height={360} sx={{ borderRadius: 4 }} />
        </Stack>
      ) : (
        <Stack spacing={3.5}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "flex-start", sm: "flex-end" }}
            justifyContent="space-between"
            spacing={1}
          >
            <Box>
              <Typography
                variant="h4"
                fontWeight={800}
                letterSpacing={-1.2}
                sx={{ color: "#202238", fontSize: { xs: 27, sm: 34 } }}
              >
                Good to see you
              </Typography>
              <Typography sx={{ mt: 0.5, color: "#777b8e" }}>
                Here&apos;s what&apos;s happening across your community.
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                px: 1.75,
                py: 1,
                border: "1px solid #e6e7ee",
                borderRadius: 3,
                bgcolor: "#fff",
                color: "#686c80",
                fontWeight: 600,
              }}
            >
              {dateLabel}
            </Typography>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ alignItems: "stretch" }}
          >
            <WighetComponent
              title="Users"
              value={stats?.usersCount}
              icon={<PersonIcon />}
            />
            <WighetComponent
              title="Chats"
              value={stats?.totalChatsCount}
              icon={<GroupIcon />}
            />
            <WighetComponent
              title="Messages"
              value={stats?.messagesCount}
              icon={<MessageIcon />}
            />
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 1.8fr) minmax(300px, 1fr)" },
              gap: 2.5,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                minWidth: 0,
                p: { xs: 2, sm: 3 },
                border: "1px solid #e9eaf1",
                borderRadius: 4,
                bgcolor: "#fff",
                boxShadow: "0 12px 34px rgba(31,36,66,.045)",
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={1}
                sx={{ mb: 3 }}
              >
                <Box>
                  <Typography variant="h6" fontWeight={800} color="#202238">
                    Message activity
                  </Typography>
                  <Typography variant="body2" color="#85889b">
                    Messages over the last seven days
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    px: 1.25,
                    py: 0.75,
                    borderRadius: 2,
                    bgcolor: "#eeedff",
                    color: "#4f46e5",
                    fontWeight: 700,
                  }}
                >
                  LAST 7 DAYS
                </Typography>
              </Stack>
              <Box sx={{ height: { xs: 245, sm: 300 } }}>
                <LineChart vlaue={stats?.messagesChart || []} />
              </Box>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                minWidth: 0,
                p: { xs: 2, sm: 3 },
                border: "1px solid #e9eaf1",
                borderRadius: 4,
                bgcolor: "#fff",
                boxShadow: "0 12px 34px rgba(31,36,66,.045)",
              }}
            >
              <Typography variant="h6" fontWeight={800} color="#202238">
                Conversation mix
              </Typography>
              <Typography variant="body2" color="#85889b" sx={{ mb: 2 }}>
                Direct and group chats
              </Typography>
              <Box
                sx={{
                  position: "relative",
                  mx: "auto",
                  width: "min(100%, 290px)",
                  aspectRatio: "1",
                }}
              >
                <DoughnutChart
                  labels={["Direct chats", "Group chats"]}
                  vlaue={[singleChats, stats?.groupsCount || 0]}
                />
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  sx={{ position: "absolute", inset: 0, pointerEvents: "none" }}
                >
                  <Typography variant="h4" fontWeight={800} color="#202238">
                    {(stats?.totalChatsCount || 0).toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="#85889b">
                    total chats
                  </Typography>
                </Stack>
              </Box>
              <Stack spacing={1.5} sx={{ mt: 1 }}>
                {[
                  { label: "Direct chats", value: singleChats, color: "#6258e8" },
                  { label: "Group chats", value: stats?.groupsCount || 0, color: "#f2a65a" },
                ].map((item) => (
                  <Stack
                    key={item.label}
                    direction="row"
                    alignItems="center"
                    spacing={1}
                  >
                    <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: item.color }} />
                    <Typography variant="body2" color="#777b8e" sx={{ flexGrow: 1 }}>
                      {item.label}
                    </Typography>
                    <Typography variant="body2" fontWeight={700} color="#303349">
                      {item.value.toLocaleString()}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </Box>
        </Stack>
      )}
    </AdminLayout>
  );
};

export default Dashboard;
