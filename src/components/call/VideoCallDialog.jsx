import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import CallEndIcon from "@mui/icons-material/CallEnd";
import VideocamIcon from "@mui/icons-material/Videocam";
import PropTypes from "prop-types";

const VideoCallDialog = ({ open, caller, onAccept, onReject }) => {
  const avatar =
    typeof caller?.avatar === "string" ? caller.avatar : caller?.avatar?.url;

  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogContent sx={{ px: 4, py: 5 }}>
        <Stack alignItems="center" spacing={2.5}>
          <Box sx={{ position: "relative" }}>
            <Avatar
              src={avatar}
              alt={caller?.name || "Caller"}
              sx={{
                width: 88,
                height: 88,
                bgcolor: "primary.main",
                fontSize: 32,
                boxShadow: 3,
              }}
            >
              {caller?.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <VideocamIcon
              sx={{
                position: "absolute",
                right: -4,
                bottom: -4,
                p: 0.5,
                color: "white",
                bgcolor: "primary.main",
                borderRadius: "50%",
                boxSizing: "content-box",
              }}
            />
          </Box>

          <Stack alignItems="center" spacing={0.5}>
            <Typography variant="h6" fontWeight={600}>
              {caller?.name || "Someone is calling"}
            </Typography>
            <Typography color="text.secondary">Incoming video call</Typography>
          </Stack>

          <Stack direction="row" spacing={5} mt={1}>
            <Tooltip title="Decline call">
              <IconButton
                onClick={onReject}
                color="error"
                aria-label="Decline video call"
                sx={{ width: 56, height: 56, boxShadow: 2 }}
              >
                <CallEndIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Accept call">
              <IconButton
                onClick={onAccept}
                color="success"
                aria-label="Accept video call"
                sx={{ width: 56, height: 56, boxShadow: 2 }}
              >
                <VideocamIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default VideoCallDialog;

VideoCallDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  caller: PropTypes.shape({
    name: PropTypes.string,
    avatar: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({ url: PropTypes.string }),
    ]),
  }),
  onAccept: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
};
