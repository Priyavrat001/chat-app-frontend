import {
  BlockRounded as SuspendIcon,
  CheckCircleRounded as RestoreIcon,
  SearchRounded as SearchIcon,
  ShieldRounded as RoleIcon,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  FormControl,
  InputAdornment,
  MenuItem,
  Pagination,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import AdminActionDialog from "../../components/dialogs/admin/AdminActionDialog";
import AdminLayout from "../../components/layouts/admin/AdminLayout";
import AdminDataTable from "../../components/shared/admin/AdminDataTable";
import { server } from "../../constants/config";
import { useAdminResource } from "../../hooks/useAdminResource";

const UserManagement = () => {
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("createdAt:desc");
  const [action, setAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const params = new URLSearchParams({
    page: String(page),
    limit: "15",
    search: searchQuery,
    sort: sort.split(":")[0],
    order: sort.split(":")[1],
  });
  const url = `${server}/admin/users?${params.toString()}`;
  const { data, loading, error, refresh } = useAdminResource(url);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearchQuery(search.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const users = data?.users || [];
  const pagination = data?.pagination;

  const columns = useMemo(() => [
    {
      key: "user",
      label: "Account",
      render: (user) => (
        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ minWidth: 170 }}>
          <Avatar src={user.avatar} alt={user.name} />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" fontWeight={700} noWrap>{user.name}</Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              @{user.username}{user.email ? ` · ${user.email}` : ""}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (user) => (
        <Chip
          size="small"
          label={user.status || "active"}
          color={user.status === "suspended" || user.status === "deactivated" ? "error" : "success"}
          variant="outlined"
        />
      ),
    },
    {
      key: "activity",
      label: "Activity",
      render: (user) => (
        <Stack>
          <Typography variant="body2">{user.messagesCount} messages</Typography>
          <Typography variant="caption" color="text.secondary">
            {user.chatsCount} conversations · {user.isOnline ? "Active now" : user.lastSeenAt ? `Seen ${moment(user.lastSeenAt).fromNow()}` : "No recent activity"}
          </Typography>
        </Stack>
      ),
    },
    {
      key: "joined",
      label: "Joined",
      render: (user) => moment(user.createdAt).format("D MMM YYYY"),
    },
    {
      key: "actions",
      label: "Admin actions",
      render: (user) => (
        <Stack direction={{ xs: "column", sm: "row" }} spacing={0.75}>
          {user.status === "active" ? (
            <>
              <Button
                size="small"
                color="warning"
                startIcon={<SuspendIcon />}
                onClick={() => setAction({ type: "status", user, status: "suspended" })}
              >
                Suspend
              </Button>
              <Button
                size="small"
                color="error"
                onClick={() => setAction({ type: "status", user, status: "deactivated" })}
              >
                Deactivate
              </Button>
            </>
          ) : (
            <Button
              size="small"
              color="success"
              startIcon={<RestoreIcon />}
              onClick={() => setAction({ type: "status", user, status: "active" })}
            >
              Restore
            </Button>
          )}
          <Button
            size="small"
            startIcon={<RoleIcon />}
            onClick={() => setAction({
              type: "role",
              user,
              role: user.role === "moderator" ? "user" : "moderator",
            })}
          >
            {user.role === "moderator" ? "Remove mod" : "Make mod"}
          </Button>
        </Stack>
      ),
    },
  ], []);

  const confirmAction = async (reason) => {
    setActionLoading(true);
    try {
      const route = action.type === "role"
        ? `/admin/users/${action.user._id}/role`
        : `/admin/users/${action.user._id}/status`;
      const payload = action.type === "role"
        ? { role: action.role, reason }
        : { status: action.status, reason };
      await axios.patch(`${server}${route}`, payload, { withCredentials: true });
      toast.success(action.type === "role" ? "Role updated." : "Account status updated.");
      setAction(null);
      refresh();
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || "Could not apply this action.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Stack spacing={2.5}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }} justifyContent="space-between">
          <Box>
            <Typography variant="h5" fontWeight={800} color="#202238">User directory</Typography>
            <Typography color="text.secondary">Search accounts, review activity, and apply audited access changes.</Typography>
          </Box>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <TextField
              size="small"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Name, username, email, or ID"
              sx={{ width: { xs: "100%", sm: 300 }, bgcolor: "white" }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
            />
            <FormControl size="small" sx={{ minWidth: 170, bgcolor: "white" }}>
              <Select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }}>
                <MenuItem value="createdAt:desc">Newest first</MenuItem>
                <MenuItem value="createdAt:asc">Oldest first</MenuItem>
                <MenuItem value="name:asc">Name A–Z</MenuItem>
                <MenuItem value="username:asc">Username A–Z</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>

        {error && <Alert severity="error">{error}</Alert>}
        {loading ? (
          <Skeleton variant="rounded" height={440} sx={{ borderRadius: 3 }} />
        ) : (
          <>
            <AdminDataTable columns={columns} rows={users} rowKey={(user) => user._id} />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {pagination?.total?.toLocaleString() || 0} accounts
              </Typography>
              <Pagination
                page={page}
                count={Math.max(pagination?.pages || 1, 1)}
                onChange={(_, nextPage) => setPage(nextPage)}
                color="primary"
              />
            </Stack>
          </>
        )}
      </Stack>
      {action && (
        <AdminActionDialog
          open
          title={action.type === "role" ? "Change account role" : "Change account status"}
          description={action.type === "role"
            ? `Change @${action.user.username} to ${action.role}. Admin access cannot be granted here.`
            : `Set @${action.user.username} to ${action.status}. The action will be recorded in the audit log.`}
          confirmLabel={action.type === "role" ? "Update role" : `${action.status}`}
          loading={actionLoading}
          onClose={() => setAction(null)}
          onConfirm={confirmAction}
        />
      )}
    </AdminLayout>
  );
};

export default UserManagement;
