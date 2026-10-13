import { useInfiniteScrollTop } from "6pp";
import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField } from '@mui/material';
import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from "prop-types";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import FileMenu from '../components/dialogs/FileMenu';
import AppLayout from '../components/layouts/AppLayout';
import ChatHeader from '../components/layouts/ChatHeader';
import { LayoutLoader, TypingLoader } from '../components/layouts/Loaders';
import MessageComponent from '../components/shared/MessageComponent';
import { InputBox } from '../components/styles/StyledComponents';
import ReplySuggestions from '../components/ai/ReplySuggestions';
import { grayColor, orange } from '../constants/color';
import { server } from '../constants/config';
import { ALERT, CHAT_JOINED, CHAT_LEAVED, MESSAGE_STATUS, NEW_MESSAGE, START_TYPING, STOP_TYPING } from '../constants/event';
import { useErrors, useSocketEvent } from '../hooks/hook';
import { v4 as uuid } from 'uuid';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import { removeNewMessageAlert } from '../redux/reducers/chat';
import { closeAiDialog } from '../redux/reducers/ai';
import { setIsFileMenu } from '../redux/reducers/misc';
import { getSocket } from '../socket';


const Chat = ({ chatId }) => {

  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const messageInputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const socket = getSocket();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [fileMenuEnchor, setFileMenuEnchor] = useState(null);
  const [page, setPage] = useState(1);
  const [userTyping, setUserTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [reportMessage, setReportMessage] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [reportError, setReportError] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);

  const typingTimeOut = useRef(null);

  const chatDetails = useChatDetailsQuery({ chatId, populate: true, skip: !chatId });
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });
  
  const { user } = useSelector(state => state.auth);

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  const members = chatDetails?.data?.chat?.members;
  const memberIds = members?.map((m) => (m?._id ? m._id : m)) || [];

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuEnchor(e.currentTarget);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    const temporaryId = uuid();
    const optimisticMessage = {
      _id: temporaryId,
      content: message.trim(),
      sender: { _id: user._id, name: user.name },
      chat: chatId,
      createdAt: new Date().toISOString(),
      status: "sending",
      attachment: [],
    };

    setMessages((previous) => [...previous, optimisticMessage]);
    socket.emit(NEW_MESSAGE, { chatId, message: message.trim() }, (result) => {
      if (!result?.success) {
        setMessages((previous) =>
          previous.filter((item) => item._id !== temporaryId),
        );
        toast.error(result?.message || "Unable to send message.");
        return;
      }

      setMessages((previous) =>
        previous.map((item) =>
          item._id === temporaryId ? result.message : item,
        ),
      );
    });
    setMessage("");
  };

  const handleSuggestionSelect = (suggestion) => {
    setMessage(suggestion);
    messageInputRef.current?.focus();
  };

  const submitReport = async (event) => {
    event.preventDefault();
    if (!reportMessage || !reportReason.trim()) return;

    setReportSubmitting(true);
    setReportError("");
    try {
      await axios.post(`${server}/user/report`, {
        targetMessage: reportMessage._id,
        reason: reportReason.trim(),
      }, { withCredentials: true });
      toast.success("Message reported. Thank you for helping keep the community safe.");
      setReportMessage(null);
      setReportReason("");
    } catch (requestError) {
      setReportError(requestError.response?.data?.message || "Could not submit this report.");
    } finally {
      setReportSubmitting(false);
    }
  };

  const closeReportDialog = () => {
    if (reportSubmitting) return;
    setReportMessage(null);
    setReportReason("");
    setReportError("");
  };

  const messageChangeHanlder = (e)=>{
    setMessage(e.target.value);

    if(!userTyping){
      socket.emit(START_TYPING, {members: memberIds, chatId});
      setUserTyping(true);
    }

    if(typingTimeOut.current) clearTimeout(typingTimeOut.current);

    typingTimeOut.current = setTimeout(() => {
      socket.emit(STOP_TYPING, {members: memberIds, chatId});
      setUserTyping(false);
    }, 2000);

  }

  useEffect(() => {
    if(bottomRef.current) bottomRef.current.scrollIntoView({behavior:"smooth"});
  }, [messages]);

  useEffect(() => {
   if(chatDetails.isError) return navigate("/")
  }, [chatDetails.isError, navigate]);
  
  

  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setMessages((previous) => {
        const existingIndex = previous.findIndex(
          (item) => item._id === data.message._id,
        );
        if (existingIndex === -1) return [...previous, data.message];
        return previous.map((item, index) =>
          index === existingIndex ? data.message : item,
        );
      });
    },
    [chatId]
  );

  const messageStatusListener = useCallback((data) => {
    if (data.chatId !== chatId) return;

    const applyReceipt = (items) =>
      items.map((item) =>
        item._id === data.messageId
          ? {
              ...item,
              deliveredTo: data.deliveredTo,
              readBy: data.readBy,
              recipientCount: data.recipientCount,
              status: data.status,
            }
          : item,
      );

    setMessages(applyReceipt);
    setOldMessages(applyReceipt);
  }, [chatId, setOldMessages]);

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      console.log("start typing",data);
      setOtherUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      console.log("stop typing",data);
      setOtherUserTyping(false);
    },
    [chatId]
  );

  const alertListener = useCallback((data)=>{
    const messageForAlert = {
      content: data,
      _id: uuid(),
      sender: {
          _id: "dfsdfsdf",
          name: "Admin"
      },
      chat: chatId,
      createdAt: new Date().toString()
  };
  setMessages((prev)=>[...prev, messageForAlert]);
  },[chatId]);

  const eventHandler = useMemo(() => ({
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [MESSAGE_STATUS]: messageStatusListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  }), [
    alertListener,
    messageStatusListener,
    newMessagesListener,
    startTypingListener,
    stopTypingListener,
  ]);


  useSocketEvent(socket, eventHandler);

  useEffect(() => {
    if (!chatId || !chatDetails.data?.chat || !user?._id) return undefined;

    socket.emit(CHAT_JOINED, { chatId });
    dispatch(removeNewMessageAlert(chatId));

    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      dispatch(closeAiDialog());
      socket.emit(CHAT_LEAVED, { chatId });
    };
  }, [chatId, chatDetails.data?.chat, dispatch, setOldMessages, socket, user?._id]);

  const allMessages = [...oldMessages, ...messages];

  useErrors(errors);


  return chatDetails.isLoading ? <LayoutLoader /> : (
    <>
      <Stack height="100%" minHeight={0}>
        <ChatHeader chat={chatDetails.data?.chat} user={user} />
        <Stack ref={containerRef}
          boxSizing={"border-box"}
          padding={"1rem"}
          spacing={"1rem"}
          bgcolor={grayColor}
          flex={1}
          minHeight={0}
          sx={{
            overflow: "hidden",
            overflowY: "auto"
          }}
        >

          {
            allMessages.map((i) => (
              <MessageComponent key={i._id} message={i} user={user} onReport={setReportMessage} />
            ))
          }

          {
            otherUserTyping && <TypingLoader/>
          }

          <div ref={bottomRef}/>

        </Stack>

        <form
          style={{ minHeight: "4.5rem", flexShrink: 0 }}
          onSubmit={handleSubmit}
        >
          <Stack spacing={1} sx={{ py: 1.25 }}>
            <ReplySuggestions
              key={chatId}
              chatId={chatId}
              onSelect={handleSuggestionSelect}
            />
            <Stack
              direction="row"
              alignItems="center"
              position="relative"
              sx={{ px: 1.5 }}
            >
              <IconButton
                aria-label="Attach a file"
                sx={{ rotate: "30deg" }}
                onClick={handleFileOpen}
              >
                <AttachFileIcon />
              </IconButton>
              <InputBox
                ref={messageInputRef}
                aria-label="Type a message"
                placeholder="Type message here..."
                sx={{
                  height: "2.75rem",
                  px: 2,
                  outline: "none",
                  flex: 1,
                  minWidth: 0,
                }}
                value={message}
                onChange={messageChangeHanlder}
              />

              <IconButton
                aria-label="Send message"
                type="submit"
                sx={{
                  rotate: "-30deg",
                  backgroundColor: orange,
                  color: "white",
                  marginLeft: "1rem",
                  padding: "0.5rem",
                  "&:hover": {
                    backgroundColor: "error.dark",
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Stack>
          </Stack>
        </form>
      </Stack>
      <FileMenu anchorE1={fileMenuEnchor} chatId={chatId}/>
      <Dialog
        open={Boolean(reportMessage)}
        onClose={closeReportDialog}
        fullWidth
        maxWidth="xs"
      >
        <form onSubmit={submitReport}>
          <DialogTitle>Report this message</DialogTitle>
          <DialogContent>
            <Stack spacing={1.5} sx={{ pt: 1 }}>
              <Alert severity="info">Reports are reviewed by authorized moderators. Only this message and your reason are shared for review.</Alert>
              <TextField
                autoFocus
                multiline
                minRows={3}
                inputProps={{ maxLength: 1000 }}
                label="Why are you reporting this message?"
                value={reportReason}
                onChange={(event) => setReportReason(event.target.value)}
                required
                error={Boolean(reportError)}
                helperText={reportError || `${reportReason.length}/1000`}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={closeReportDialog} disabled={reportSubmitting}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={reportSubmitting || !reportReason.trim()}>
              {reportSubmitting ? "Submitting..." : "Submit report"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

Chat.propTypes = {
  chatId: PropTypes.string,
};

export default AppLayout()(Chat);