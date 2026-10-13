import {
  GroupsRounded as GroupsIcon,
  MessageRounded as MessageIcon,
  PeopleAltRounded as UsersIcon,
  PersonAddAlt1Rounded as NewUsersIcon,
  WifiTetheringRounded as ActiveIcon,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import PropTypes from "prop-types";
import AdminLayout from "../../components/layouts/admin/AdminLayout";
import { LineChart } from "../../components/specifics/admin/Charts";
import { server } from "../../constants/config";
import { useAdminResource } from "../../hooks/useAdminResource";

const MetricCard = ({ title, value, icon, color, caption }) => (
  <Card elevation={0} sx={{ height: "100%", border: "1px solid #e9eaf1", borderRadius: 3 }}>
    <CardContent sx={{ p: 2.5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="body2" color="text.secondary">{title}</Typography>
          <Typography variant="h4" fontWeight={800} sx={{ mt: 1, color: "#202238" }}>
            {(value ?? 0).toLocaleString()}
          </Typography>
        </Box>
        <Box sx={{ width: 44, height: 44, display: "grid", placeItems: "center", color, bgcolor: `${color}18`, borderRadius: 2.5 }}>
          {icon}
        </Box>
      </Stack>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1.5 }}>
        {caption}
      </Typography>
    </CardContent>
  </Card>
);
MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number,
  icon: PropTypes.node,
  color: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
};

const HealthItem = ({ label, value, healthy }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
    <Typography variant="body2" color="text.secondary">{label}</Typography>
    <Chip
      size="small"
      label={value}
      color={healthy ? "success" : "warning"}
      variant="outlined"
      sx={{ textTransform: "capitalize" }}
    />
  </Stack>
);
HealthItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  healthy: PropTypes.bool.isRequired,
};

const Dashboard = () => {
  const [range, setRange] = useState("week");
  const { data: dashboardData, loading: dashboardLoading, error: dashboardError } =
    useAdminResource(`${server}/admin/stats?range=${range}`);
  const { data: healthData, loading: healthLoading, error: healthError } =
    useAdminResource(`${server}/admin/health`);
  const stats = dashboardData?.stats || {};
  const health = healthData?.health;

  return (
    <AdminLayout>
      <Stack spacing={3}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={1.5}>
          <Box>
            <Typography variant="h5" fontWeight={800} color="#202238">Admin overview</Typography>
            <Typography color="text.secondary">A real-time snapshot of your community and platform health.</Typography>
          </Box>
          <FormControl size="small" sx={{ minWidth: 150, bgcolor: "white" }}>
            <Select value={range} onChange={(event) => setRange(event.target.value)} aria-label="Dashboard date range">
              <MenuItem value="day">Last 24 hours</MenuItem>
              <MenuItem value="week">Last 7 days</MenuItem>
              <MenuItem value="month">Last 30 days</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {dashboardError && <Alert severity="error">{dashboardError}</Alert>}
        {dashboardLoading ? (
          <Grid container spacing={2}>
            {Array.from({ length: 6 }, (_, index) => <Grid item xs={12} sm={6} lg={4} key={index}><Skeleton height={145} variant="rounded" /></Grid>)}
          </Grid>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} lg={4}><MetricCard title="Registered users" value={stats.usersCount} icon={<UsersIcon />} color="#4f46e5" caption="All registered accounts" /></Grid>
            <Grid item xs={12} sm={6} lg={4}><MetricCard title="New users today" value={stats.newUsersToday} icon={<NewUsersIcon />} color="#0891b2" caption={`${stats.newUsersThisWeek || 0} registered this week`} /></Grid>
            <Grid item xs={12} sm={6} lg={4}><MetricCard title="Messages sent" value={stats.messagesCount} icon={<MessageIcon />} color="#d97706" caption="All messages across the platform" /></Grid>
            <Grid item xs={12} sm={6} lg={4}><MetricCard title="Groups" value={stats.groupsCount} icon={<GroupsIcon />} color="#7c3aed" caption="Group conversations" /></Grid>
            <Grid item xs={12} sm={6} lg={4}><MetricCard title="Direct conversations" value={Math.max((stats.totalChatsCount || 0) - (stats.groupsCount || 0), 0)} icon={<MessageIcon />} color="#db2777" caption="One-to-one conversations" /></Grid>
            <Grid item xs={12} sm={6} lg={4}><MetricCard title="Active users" value={stats.activeUsersCount} icon={<ActiveIcon />} color="#059669" caption="Seen within the last 15 minutes" /></Grid>
          </Grid>
        )}

        {!dashboardLoading && (
          <Grid container spacing={2}>
            <Grid item xs={12} lg={6}>
              <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, border: "1px solid #e9eaf1", borderRadius: 3, height: "100%" }}>
                <Typography fontWeight={750} color="#202238" sx={{ mb: 2 }}>User growth</Typography>
                <Box sx={{ height: 280 }}>
                  <LineChart value={stats.userGrowthChart || []} labels={stats.chartLabels} label="New users" color="#4f46e5" />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, border: "1px solid #e9eaf1", borderRadius: 3, height: "100%" }}>
                <Typography fontWeight={750} color="#202238" sx={{ mb: 2 }}>Messaging activity</Typography>
                <Box sx={{ height: 280 }}>
                  <LineChart value={stats.messagesChart || []} labels={stats.chartLabels} label="Messages" color="#d97706" />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}

        <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, border: "1px solid #e9eaf1", borderRadius: 3 }}>
          <Typography fontWeight={750} color="#202238" sx={{ mb: 2 }}>System health & AI usage</Typography>
          {healthError && <Alert severity="error" sx={{ mb: 2 }}>{healthError}</Alert>}
          {healthLoading ? <Skeleton height={130} /> : health && (
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6} md={4}>
                <Stack spacing={1.5}>
                  <HealthItem label="Database" value={health.database} healthy={health.database === "connected"} />
                  <HealthItem label="Cloudinary" value={health.cloudinary} healthy={health.cloudinary === "connected"} />
                  <HealthItem label="Socket connections" value={health.socketConnections} healthy />
                  <HealthItem label="Server uptime" value={`${Math.floor(health.uptimeSeconds / 3600)}h`} healthy />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Stack spacing={1.5}>
                  <HealthItem label="API requests (since restart)" value={health.api.requests} healthy />
                  <HealthItem label="API failures" value={health.api.failures} healthy={health.api.failureRate < 0.05} />
                  <HealthItem label="Average API latency" value={`${health.api.averageResponseTimeMs} ms`} healthy={health.api.averageResponseTimeMs < 1000} />
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Stack spacing={1.5}>
                  <HealthItem label="AI requests (7 days)" value={health.ai.requests} healthy />
                  <HealthItem label="AI failures / quota errors" value={`${health.ai.failures} / ${health.ai.quotaErrors}`} healthy={health.ai.failures === 0 && health.ai.quotaErrors === 0} />
                  <HealthItem label="Average AI latency" value={`${health.ai.averageLatencyMs} ms`} healthy />
                  <Typography variant="caption" color="text.secondary">Provider cost data is not available for this account.</Typography>
                </Stack>
              </Grid>
            </Grid>
          )}
        </Paper>
      </Stack>
    </AdminLayout>
  );
};

export default Dashboard;
