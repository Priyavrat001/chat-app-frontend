import { CheckCircleRounded as ResolveIcon } from "@mui/icons-material";
import { Alert, Box, Button, Chip, Pagination, Skeleton, Stack, Typography } from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import AdminActionDialog from "../../components/dialogs/admin/AdminActionDialog";
import AdminLayout from "../../components/layouts/admin/AdminLayout";
import AdminDataTable from "../../components/shared/admin/AdminDataTable";
import { server } from "../../constants/config";
import { useAdminResource } from "../../hooks/useAdminResource";

const Reports = () => {
  const [status, setStatus] = useState("pending");
  const [page, setPage] = useState(1);
  const [action, setAction] = useState(null);
  const [saving, setSaving] = useState(false);
  const params = new URLSearchParams({ page: String(page), limit: "15", status });
  const { data, loading, error, refresh } = useAdminResource(`${server}/admin/reports?${params}`);
  const reports = data?.reports || [];
  const pagination = data?.pagination;

  const columns = useMemo(() => [
    {
      key: "target",
      label: "Reported item",
      render: (report) => {
        if (report.targetMessage) {
          return (
            <Stack spacing={0.5} sx={{ maxWidth: 360 }}>
              <Typography variant="body2" fontWeight={700}>
                Message by {report.targetMessage.sender?.username || report.targetMessage.sender?.name || "unknown"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "normal" }}>
                {report.targetMessage.content || "Reported attachment"}
              </Typography>
            </Stack>
          );
        }
        if (report.targetUser) return `Account: @${report.targetUser.username || report.targetUser.name}`;
        return `Group: ${report.targetChat?.name || "Unknown group"}`;
      },
    },
    {
      key: "reporter",
      label: "Reported by",
      render: (report) => report.reporter?.username || report.reporter?.name || "Unknown",
    },
    {
      key: "reason",
      label: "Report reason",
      render: (report) => <Typography variant="body2" sx={{ maxWidth: 250, whiteSpace: "normal" }}>{report.reason}</Typography>,
    },
    {
      key: "created",
      label: "Submitted",
      render: (report) => moment(report.createdAt).fromNow(),
    },
    {
      key: "status",
      label: "Status",
      render: (report) => (
        <Chip
          size="small"
          label={report.status}
          color={report.status === "resolved" ? "success" : report.status === "dismissed" ? "default" : "warning"}
          variant="outlined"
        />
      ),
    },
    {
      key: "action",
      label: "Review",
      render: (report) => (
        <Stack direction="row" spacing={0.5}>
          {report.status !== "reviewing" && (
            <Button size="small" onClick={() => setAction({ report, status: "reviewing" })}>
              Review
            </Button>
          )}
          {report.status !== "dismissed" && (
            <Button size="small" color="inherit" onClick={() => setAction({ report, status: "dismissed" })}>
              Dismiss
            </Button>
          )}
          {report.status !== "resolved" && (
            <Button size="small" color="success" startIcon={<ResolveIcon />} onClick={() => setAction({ report, status: "resolved" })}>
              Resolve
            </Button>
          )}
        </Stack>
      ),
    },
  ], []);

  const confirmAction = async (reason) => {
    setSaving(true);
    try {
      await axios.patch(`${server}/admin/reports/${action.report._id}`, {
        status: action.status,
        reason,
      }, { withCredentials: true });
      toast.success("Report decision saved.");
      setAction(null);
      refresh();
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || "Could not update this report.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="h5" fontWeight={800} color="#202238">Reports & moderation</Typography>
          <Typography color="text.secondary">Review only the account, group, or message that a user reported. Decisions require a reason and are audited.</Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          {["pending", "reviewing", "resolved", "dismissed"].map((option) => (
            <Chip
              key={option}
              clickable
              label={option}
              color={status === option ? "primary" : "default"}
              variant={status === option ? "filled" : "outlined"}
              onClick={() => { setStatus(option); setPage(1); }}
            />
          ))}
        </Stack>
        {error && <Alert severity="error">{error}</Alert>}
        {loading ? (
          <Skeleton variant="rounded" height={430} sx={{ borderRadius: 3 }} />
        ) : (
          <>
            <AdminDataTable columns={columns} rows={reports} rowKey={(report) => report._id} />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">{pagination?.total || 0} reports</Typography>
              <Pagination page={page} count={Math.max(pagination?.pages || 1, 1)} onChange={(_, next) => setPage(next)} color="primary" />
            </Stack>
          </>
        )}
      </Stack>
      {action && (
        <AdminActionDialog
          open
          title={`Mark report ${action.status}`}
          description="Record the moderation decision and reason. To suspend an account or restrict a group, use the corresponding management screen."
          confirmLabel={`Mark ${action.status}`}
          loading={saving}
          onClose={() => setAction(null)}
          onConfirm={confirmAction}
        />
      )}
    </AdminLayout>
  );
};

export default Reports;
