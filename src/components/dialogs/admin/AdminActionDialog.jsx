import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";

const AdminActionDialog = ({ open, title, description, confirmLabel, loading, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");

  const close = () => {
    setReason("");
    onClose();
  };

  const confirm = async () => {
    await onConfirm(reason.trim());
    setReason("");
  };

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary">{description}</Typography>
          <TextField
            autoFocus
            label="Reason (required)"
            multiline
            minRows={3}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            inputProps={{ maxLength: 1000 }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={close} disabled={loading}>Cancel</Button>
        <Button
          variant="contained"
          color="error"
          onClick={confirm}
          disabled={!reason.trim() || loading}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AdminActionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  confirmLabel: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default AdminActionDialog;
