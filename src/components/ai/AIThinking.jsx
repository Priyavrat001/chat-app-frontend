import { AutoAwesome as AutoAwesomeIcon } from "@mui/icons-material";
import { CircularProgress, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";

const AIThinking = ({ message = "Thinking..." }) => (
  <Stack
    direction="row"
    alignItems="center"
    spacing={1}
    role="status"
    aria-live="polite"
    sx={{ py: 1 }}
  >
    <CircularProgress size={18} aria-label="AI is thinking" />
    <AutoAwesomeIcon fontSize="small" color="primary" />
    <Typography variant="body2" color="text.secondary">
      {message}
    </Typography>
  </Stack>
);

AIThinking.propTypes = {
  message: PropTypes.string,
};

export default AIThinking;
