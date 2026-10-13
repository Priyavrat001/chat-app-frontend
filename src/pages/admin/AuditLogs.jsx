import { Alert, Pagination, Skeleton, Stack, Typography } from "@mui/material";
import moment from "moment";
import AdminLayout from "../../components/layouts/admin/AdminLayout";
import AdminDataTable from "../../components/shared/admin/AdminDataTable";
import { server } from "../../constants/config";
import { useAdminResource } from "../../hooks/useAdminResource";
import { useState } from "react";

const AuditLogs = () => {
  const [page, setPage] = useState(1);
  const params = new URLSearchParams({ page: String(page), limit: "25" });
  const { data, loading, error } = useAdminResource(`${server}/admin/audit-logs?${params}`);
  const logs = data?.logs || [];
  const columns = [
    { key: "createdAt", label: "Time", render: (item) => moment(item.createdAt).format("D MMM YYYY, HH:mm") },
    { key: "actor", label: "Actor" },
    { key: "action", label: "Action" },
    { key: "targetType", label: "Target" },
    { key: "targetId", label: "Target ID", render: (item) => item.targetId || "—" },
    { key: "reason", label: "Reason", render: (item) => item.reason || "—" },
  ];

  return (
    <AdminLayout>
      <Stack spacing={2.5}>
        <Stack>
          <Typography variant="h5" fontWeight={800} color="#202238">Audit log</Typography>
          <Typography color="text.secondary">Sensitive account, role, group, and moderation changes.</Typography>
        </Stack>
        {error && <Alert severity="error">{error}</Alert>}
        {loading ? <Skeleton variant="rounded" height={430} sx={{ borderRadius: 3 }} /> : (
          <>
            <AdminDataTable columns={columns} rows={logs} rowKey={(item) => item._id} />
            <Stack direction="row" justifyContent="flex-end">
              <Pagination
                page={page}
                count={Math.max(data?.pagination?.pages || 1, 1)}
                onChange={(_, next) => setPage(next)}
                color="primary"
              />
            </Stack>
          </>
        )}
      </Stack>
    </AdminLayout>
  );
};

export default AuditLogs;
