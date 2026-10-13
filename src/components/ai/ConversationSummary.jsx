import {
  AutoAwesome as AutoAwesomeIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import PropTypes from "prop-types";
import { useSummarizeConversationMutation } from "../../redux/services/ai.api";
import AIThinking from "./AIThinking";

const SECTIONS = [
  { key: "decisions", title: "Important decisions" },
  { key: "questions", title: "Unanswered questions" },
  { key: "actionItems", title: "Action items" },
];

const getErrorMessage = (error) =>
  error?.data?.message || error?.error || "Couldn't summarize this conversation.";

const ConversationSummary = ({ chatId, open, onClose }) => {
  const [summarize, { data, isLoading, error }] =
    useSummarizeConversationMutation();

  useEffect(() => {
    if (open && chatId) summarize({ chatId });
  }, [chatId, open, summarize]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <AutoAwesomeIcon color="primary" />
        Conversation summary
      </DialogTitle>
      <DialogContent dividers>
        {isLoading ? (
          <AIThinking message="Catching you up on this conversation..." />
        ) : error ? (
          <Alert severity="error">{getErrorMessage(error)}</Alert>
        ) : data ? (
          <Stack spacing={2}>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {data.summary}
            </Typography>
            {SECTIONS.map(({ key, title }) => (
              <Stack key={key} spacing={0.75}>
                <Divider />
                <Typography variant="subtitle2" fontWeight={700}>
                  {title}
                </Typography>
                {data[key]?.length ? (
                  <Stack component="ul" spacing={0.5} sx={{ my: 0, pl: 2.5 }}>
                    {data[key].map((item, index) => (
                      <Typography component="li" variant="body2" key={`${key}-${index}`}>
                        {item}
                      </Typography>
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    None identified in this conversation.
                  </Typography>
                )}
              </Stack>
            ))}
          </Stack>
        ) : (
          <Typography color="text.secondary">
            Generate a summary of this conversation.
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Close</Button>
        <Button
          startIcon={<RefreshIcon />}
          onClick={() => summarize({ chatId })}
          disabled={isLoading || !chatId}
        >
          Refresh summary
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConversationSummary.propTypes = {
  chatId: PropTypes.string,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ConversationSummary;
