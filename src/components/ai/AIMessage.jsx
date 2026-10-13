import { AutoAwesome as AutoAwesomeIcon } from "@mui/icons-material";
import { Box, Chip, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";

const AIMessage = ({ answer, sources = [] }) => (
  <Stack spacing={1.5}>
    <Stack direction="row" spacing={1} alignItems="flex-start">
      <AutoAwesomeIcon color="primary" fontSize="small" sx={{ mt: 0.25 }} />
      <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
        {answer}
      </Typography>
    </Stack>

    {sources.length > 0 && (
      <Stack spacing={1} sx={{ pl: 3.5 }}>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          Sources from this chat
        </Typography>
        {sources.map((source) => (
          <Box
            key={source.messageId}
            sx={{
              p: 1.25,
              borderRadius: 2,
              bgcolor: "action.hover",
              borderLeft: 2,
              borderColor: "primary.main",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              <Chip size="small" label={source.sender || "Chat participant"} />
              {source.createdAt && (
                <Typography variant="caption" color="text.secondary">
                  {new Date(source.createdAt).toLocaleString()}
                </Typography>
              )}
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {source.excerpt}
            </Typography>
          </Box>
        ))}
      </Stack>
    )}
  </Stack>
);

AIMessage.propTypes = {
  answer: PropTypes.string.isRequired,
  sources: PropTypes.arrayOf(
    PropTypes.shape({
      messageId: PropTypes.string,
      sender: PropTypes.string,
      createdAt: PropTypes.string,
      excerpt: PropTypes.string,
    }),
  ),
};

export default AIMessage;
