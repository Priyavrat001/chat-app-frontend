import { ArchiveRounded as ArchiveIcon, SearchRounded as SearchIcon } from "@mui/icons-material";
import { Alert, Avatar, AvatarGroup, Box, Button, Chip, InputAdornment, Pagination, Skeleton, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import AdminActionDialog from "../../components/dialogs/admin/AdminActionDialog";
import AdminLayout from "../../components/layouts/admin/AdminLayout";
import AdminDataTable from "../../components/shared/admin/AdminDataTable";
import { server } from "../../constants/config";
import { useAdminResource } from "../../hooks/useAdminResource";

const ChatManagement = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [action, setAction] = useState(null);
  const [saving, setSaving] = useState(false);
  const params = new URLSearchParams({ page: String(page), limit: "15", search });
  const { data, loading, error, refresh } = useAdminResource(`${server}/admin/groups?${params}`);
  const groups = data?.groups || [];
  const pagination = data?.pagination;

  const columns = useMemo(() => [
    {
      key: "group",
      label: "Group",
      render: (group) => (
        <Stack direction="row" spacing={1.25} alignItems="center">
          <AvatarGroup max={3} sx={{ "& .MuiAvatar-root": { width: 30, height: 30 } }}>
            {(group.members || []).slice(0, 3).map((member) => (
              <Avatar key={member._id} src={member.avatar} alt={member.name}>
                {member.name?.charAt(0)}
              </Avatar>
            ))}
          </AvatarGroup>
          <Box>
            <Typography variant="body2" fontWeight={700}>{group.name}</Typography>
            <Typography variant="caption" color="text.secondary">Created {moment(group.createdAt).fromNow()}</Typography>
          </Box>
        </Stack>
      ),
    },
    {
      key: "creator",
      label: "Creator",
      render: (group) => group.creator?.name || "Unknown",
    },
    { key: "memberCount", label: "Members" },
    { key: "messageCount", label: "Messages" },
    {
      key: "status",
      label: "Status",
      render: (group) => (
        <Chip
          size="small"
          label={group.status || "active"}
          color={(group.status || "active") === "active" ? "success" : "warning"}
          variant="outlined"
        />
      ),
    },
    {
      key: "action",
      label: "Moderation",
      render: (group) => (
        <Stack direction="row" spacing={0.5}>
          {group.status !== "active" ? (
            <Button size="small" color="success" onClick={() => setAction({ group, status: "active" })}>
              Restore
            </Button>
          ) : (
            <Button size="small" color="warning" onClick={() => setAction({ group, status: "restricted" })}>
              Restrict
            </Button>
          )}
          {group.status !== "archived" && (
            <Button size="small" color="inherit" startIcon={<ArchiveIcon />} onClick={() => setAction({ group, status: "archived" })}>
              Archive
            </Button>
          )}
        </Stack>
      ),
    },
  ], []);

  const confirmAction = async (reason) => {
    setSaving(true);
    try {
      await axios.patch(
        `${server}/admin/groups/${action.group._id}/status`,
        { status: action.status, reason },
        { withCredentials: true },
      );
      toast.success("Group status updated.");
      setAction(null);
      refresh();
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || "Could not update this group.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="h5" fontWeight={800} color="#202238">Group management</Typography>
          <Typography color="text.secondary">Review group metadata and archive or restore groups with a recorded reason.</Typography>
        </Box>
        <TextField
          size="small"
          value={search}
          onChange={(event) => { setSearch(event.target.value); setPage(1); }}
          placeholder="Search group names"
          sx={{ width: { xs: "100%", sm: 340 }, bgcolor: "white" }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
        />
        {error && <Alert severity="error">{error}</Alert>}
        {loading ? (
          <Skeleton variant="rounded" height={430} sx={{ borderRadius: 3 }} />
        ) : (
          <>
            <AdminDataTable columns={columns} rows={groups} rowKey={(group) => group._id} />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">{pagination?.total || 0} groups</Typography>
              <Pagination page={page} count={Math.max(pagination?.pages || 1, 1)} onChange={(_, next) => setPage(next)} color="primary" />
            </Stack>
          </>
        )}
      </Stack>
      {action && (
        <AdminActionDialog
          open
          title={`${action.status === "archived" ? "Archive" : action.status === "restricted" ? "Restrict" : "Restore"} this group?`}
          description={`${action.group.name} will be ${action.status === "archived" || action.status === "restricted" ? "unavailable to members" : "available to members"} after this change.`}
          confirmLabel={action.status}
          loading={saving}
          onClose={() => setAction(null)}
          onConfirm={confirmAction}
        />
      )}
    </AdminLayout>
  );
};

export default ChatManagement;
