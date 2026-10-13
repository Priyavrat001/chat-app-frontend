import {
  AutoAwesome as AutoAwesomeIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";
import { useAskChatHistoryMutation } from "../../redux/services/ai.api";
import AIMessage from "./AIMessage";
import AIThinking from "./AIThinking";

const EXAMPLE_QUESTIONS = [
  "What did we decide about the project?",
  "What tasks are still pending?",
  "When did we discuss the deadline?",
];

const getErrorMessage = (error) =>
  error?.data?.message || error?.error || "Couldn't answer from this chat history.";

const AskChatHistoryDialog = ({ chatId, open, onClose }) => {
  const [question, setQuestion] = useState("");
  const [askHistory, { data, isLoading, error }] =
    useAskChatHistoryMutation();

  const submitQuestion = (event) => {
    event.preventDefault();
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion || isLoading) return;
    askHistory({ chatId, question: trimmedQuestion });
  };

  const handleClose = () => {
    setQuestion("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="ask-chat-history-title"
    >
      <DialogTitle id="ask-chat-history-title" sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <AutoAwesomeIcon color="primary" />
        Ask about this chat
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            Get an answer grounded in messages from this conversation.
          </Typography>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {EXAMPLE_QUESTIONS.map((example) => (
              <Button
                key={example}
                size="small"
                variant="outlined"
                onClick={() => setQuestion(example)}
                disabled={isLoading}
              >
                {example}
              </Button>
            ))}
          </Stack>
          <form onSubmit={submitQuestion}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <TextField
                fullWidth
                autoFocus
                label="Your question"
                placeholder="Ask a question about this conversation"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                inputProps={{ maxLength: 500 }}
                disabled={isLoading}
              />
              <Button
                type="submit"
                variant="contained"
                endIcon={<SendIcon />}
                disabled={!question.trim() || isLoading || !chatId}
              >
                Ask
              </Button>
            </Stack>
          </form>

          {isLoading && <AIThinking message="Searching the conversation..." />}
          {error && <Alert severity="error">{getErrorMessage(error)}</Alert>}
          {!isLoading && !error && data?.answer && (
            <AIMessage answer={data.answer} sources={data.sources || []} />
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

AskChatHistoryDialog.propTypes = {
  chatId: PropTypes.string,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AskChatHistoryDialog;
