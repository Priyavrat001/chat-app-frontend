import {
  AutoAwesome as AutoAwesomeIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { Alert, Chip, Stack, Tooltip, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useGetReplySuggestionsMutation } from "../../redux/services/ai.api";
import AIThinking from "./AIThinking";

const QUICK_REPLIES = [
  "Sounds good!",
  "Can you explain more?",
  "I'll get back to you.",
];

const getErrorMessage = (error) =>
  error?.data?.message || error?.error || "Couldn't generate reply suggestions.";

const ReplySuggestions = ({ chatId, onSelect }) => {
  const [getSuggestions, { data, isLoading, error }] =
    useGetReplySuggestionsMutation();
  const suggestions = data?.suggestions?.length
    ? data.suggestions
    : QUICK_REPLIES;

  return (
    <Stack spacing={0.75} sx={{ px: 1.5 }}>
      <Stack direction="row" alignItems="center" spacing={0.75}>
        <AutoAwesomeIcon color="primary" sx={{ fontSize: 17 }} />
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          {data?.suggestions?.length ? "AI reply ideas" : "Quick replies"}
        </Typography>
        <Tooltip title="Generate suggestions from this conversation">
          <Chip
            size="small"
            icon={data?.suggestions?.length ? <RefreshIcon /> : <AutoAwesomeIcon />}
            label={data?.suggestions?.length ? "Refresh" : "AI suggestions"}
            variant="outlined"
            color="primary"
            disabled={isLoading || !chatId}
            onClick={() => getSuggestions({ chatId })}
            sx={{ ml: 0.25 }}
          />
        </Tooltip>
      </Stack>

      {isLoading ? (
        <AIThinking message="Finding a natural reply..." />
      ) : (
        <Stack
          direction="row"
          spacing={0.75}
          sx={{ overflowX: "auto", pb: 0.25, scrollbarWidth: "none" }}
        >
          {suggestions.map((suggestion) => (
            <Chip
              key={suggestion}
              label={suggestion}
              size="small"
              variant="outlined"
              onClick={() => onSelect(suggestion)}
              sx={{ flexShrink: 0, bgcolor: "background.paper" }}
            />
          ))}
        </Stack>
      )}

      {error && (
        <Alert severity="error" variant="outlined" sx={{ py: 0 }}>
          {getErrorMessage(error)}
        </Alert>
      )}
    </Stack>
  );
};

ReplySuggestions.propTypes = {
  chatId: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

export default ReplySuggestions;
