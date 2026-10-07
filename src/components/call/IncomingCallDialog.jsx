import {
    Dialog,
    DialogContent,
    Avatar,
    Typography,
    IconButton,
    Box,
    Stack,
    Tooltip,
} from "@mui/material";

import CallIcon from "@mui/icons-material/Call";
import CallEndIcon from "@mui/icons-material/CallEnd";

const IncomingCallDialog = ({
    open,
    caller,
    onAccept,
    onReject,
}) => {



    return (
        <Dialog open={open} maxWidth="xs" fullWidth>
            <DialogContent sx={{ px: 4, py: 5 }}>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={2.5}
                >
                    <Avatar
                        src={caller?.avatar?.url}
                        sx={{
                            width: 88,
                            height: 88,
                            bgcolor: "primary.main",
                            fontSize: 32,
                            boxShadow: 3,
                        }}
                    />

                    <Stack alignItems="center" spacing={0.5}>
                        <Typography variant="h6" fontWeight={600}>
                            {caller?.name || "Someone is calling"}
                        </Typography>

                        <Typography color="text.secondary">
                            Incoming audio call
                        </Typography>
                    </Stack>

                    <Box display="flex" gap={5} mt={1}>
                        <Tooltip title="Reject call">
                            <IconButton
                                onClick={onReject}
                                color="error"
                                aria-label="Reject call"
                                sx={{ width: 56, height: 56, boxShadow: 2 }}
                            >
                                <CallEndIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Accept call">
                            <IconButton
                                onClick={onAccept}
                                color="success"
                                aria-label="Accept call"
                                sx={{ width: 56, height: 56, boxShadow: 2 }}
                            >
                                <CallIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default IncomingCallDialog;