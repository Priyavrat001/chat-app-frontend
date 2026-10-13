import {
  AutoAwesome as AutoAwesomeIcon,
  Call as CallIcon,
  Videocam as VideocamIcon,
} from '@mui/icons-material'
import {
  Avatar,
  AvatarGroup,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { getSocket } from '../../socket';
import {
  ACCEPT_VIDEO_CALL,
  END_VIDEO_CALL,
  NEW_AUDIO_CALL_ALERT,
  NEW_VIDEO_CALL_ALERT,
} from '../../constants/events';
import { useEffect } from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import IncomingCallDialog from '../call/IncomingCallDialog';
import { ACCEPT_AUDIO_CALL } from '../../constants/event';
import AudioCall from '../call/AudioCall';
import VideoCallDialog from '../call/VideoCallDialog';
import VideoCall from '../call/VideoCall';
import { useDispatch, useSelector } from 'react-redux';
import { closeAiDialog, openAiDialog } from '../../redux/reducers/ai';
import ConversationSummary from '../ai/ConversationSummary';
import AskChatHistoryDialog from '../ai/AskChatHistoryDialog';

const ChatHeader = ({ chat, user }) => {

  const dispatch = useDispatch();
  const activeAiDialog = useSelector((state) => state.ai.activeDialog);
  const [aiMenuAnchor, setAiMenuAnchor] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [outgoingCall, setOutgoingCall] = useState(null);

  const [activeCall, setActiveCall] = useState(null);
  const [incomingVideoCall, setIncomingVideoCall] = useState(null);
  const [outgoingVideoCall, setOutgoingVideoCall] = useState(null);
  const [activeVideoCall, setActiveVideoCall] = useState(null);

  const socket = getSocket();
  const members = chat?.members || []

  const isGroupChat = chat?.groupChat || chat?.groupchat
  const otherMember = members.find((member) =>
    typeof member === 'object' && member?._id !== user?._id
  )

  const title = isGroupChat ? chat?.name : otherMember?.name || chat?.name || 'Chat'
  const isSummaryOpen =
    activeAiDialog?.type === 'summary' && activeAiDialog.chatId === chat?._id;
  const isAskHistoryOpen =
    activeAiDialog?.type === 'ask-history' && activeAiDialog.chatId === chat?._id;
  const avatars = isGroupChat
    ? members.map((member) => member?.avatar).filter(Boolean)
    : [otherMember?.avatar].filter(Boolean);

  //Audio calling logic
  const handleAudioCall = async () => {
    const audioCall = await navigator.mediaDevices.getUserMedia({
      audio: true
    });

    
    const calledId = chat.members.find(
      member => member._id.toString() !== user._id.toString()
    );
    
    socket.emit(NEW_AUDIO_CALL_ALERT, { chatId: chat._id, userId: user._id, calledId });

    setOutgoingCall({
      callerId: user._id.toString(),
      userId: user._id.toString(),
      chatId: chat._id.toString(),
      calledId: calledId._id.toString(),
      participant: calledId,
      localStream: audioCall,
      isCaller: true,
    });
  };

  //video calling logic
  const handleVideoCall = async () => {
    const calledMember = members.find(
      (member) => member?._id?.toString() !== user?._id?.toString()
    );
    if (
      !calledMember ||
      isGroupChat ||
      outgoingVideoCall ||
      activeVideoCall ||
      incomingVideoCall
    ) return;

    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      const call = {
        callerId: user._id.toString(),
        chatId: chat._id.toString(),
        calledId: calledMember._id.toString(),
        participant: calledMember,
        localStream: videoStream,
        isCaller: true,
      };

      socket.emit(NEW_VIDEO_CALL_ALERT, {
        calledId: call.calledId,
        chatId: call.chatId,
      });
      setOutgoingVideoCall(call);
    } catch (error) {
      console.error("Unable to access camera or microphone for video call:", error);
      toast.error(error.message || "Unable to access your camera or microphone.");
    }
  };

  const handleAccept = () => {
    console.log("call accepted");

    const { callerInfo, chatId } = incomingCall;

    socket.emit(ACCEPT_AUDIO_CALL, {
      callerId: callerInfo._id,
      chatId,
    });

    setIncomingCall(null);

    setActiveCall({
      callerId: callerInfo._id,
      calledId: user._id.toString(),
      chatId,
      isCaller: false,
      participant: callerInfo,
    });
  };

  const handleReject = () => {
    console.log("call rejected");
    setIncomingCall(null);
  };

  const handleAcceptVideoCall = () => {
    const { callerInfo, chatId } = incomingVideoCall;
    const callerId = callerInfo._id.toString();
    const calledId = user._id.toString();

    socket.emit(ACCEPT_VIDEO_CALL, {
      callerId,
      calledId,
      chatId,
    });
    setActiveVideoCall({
      callerId,
      calledId,
      chatId: chatId.toString(),
      participant: callerInfo,
      isCaller: false,
    });
    setIncomingVideoCall(null);
  };

  const handleRejectVideoCall = () => {
    const { callerInfo, chatId } = incomingVideoCall;
    socket.emit(END_VIDEO_CALL, {
      callerId: callerInfo._id.toString(),
      calledId: user._id.toString(),
      chatId,
    });
    setIncomingVideoCall(null);
  };

  useEffect(() => {
    const handleIncomingCall = ({callerInfo, chatId }) => {
      setIncomingCall({
        callerInfo,
        chatId,
      });
    };

    socket.on(NEW_AUDIO_CALL_ALERT, handleIncomingCall);

    return () => {
      socket.off(NEW_AUDIO_CALL_ALERT, handleIncomingCall);
    }
  }, [socket]);

  useEffect(() => {
    const handleIncomingVideoCall = ({ callerInfo, chatId }) => {
      setIncomingVideoCall({ callerInfo, chatId });
    };

    socket.on(NEW_VIDEO_CALL_ALERT, handleIncomingVideoCall);
    return () => socket.off(NEW_VIDEO_CALL_ALERT, handleIncomingVideoCall);
  }, [socket]);

  useEffect(() => {
    const handleVideoCallAccepted = ({ chatId }) => {
      if (!outgoingVideoCall || outgoingVideoCall.chatId !== chatId) return;
      setActiveVideoCall({ ...outgoingVideoCall, isCaller: true });
      setOutgoingVideoCall(null);
    };

    socket.on(ACCEPT_VIDEO_CALL, handleVideoCallAccepted);
    return () => socket.off(ACCEPT_VIDEO_CALL, handleVideoCallAccepted);
  }, [socket, outgoingVideoCall]);

  useEffect(() => {
    const handleCallAccepted = ({
      callerId,
      chatId,
    }) => {
      console.log("Call accepted");

      setActiveCall({
        callerId: callerId,
        calledId: outgoingCall?.calledId,
        chatId,
        isCaller: true,
        participant: outgoingCall?.participant,
        localStream: outgoingCall?.localStream,
      });
      setOutgoingCall(null);
    };

    socket.on(ACCEPT_AUDIO_CALL, handleCallAccepted);

    return () => {
      socket.off(ACCEPT_AUDIO_CALL, handleCallAccepted);
    };
  }, [socket, outgoingCall, user?._id]);

  const callSession = activeCall || outgoingCall;

  const openAiFeature = (type) => {
    setAiMenuAnchor(null);
    dispatch(openAiDialog({ type, chatId: chat?._id }));
  };

  const closeAiFeature = () => dispatch(closeAiDialog());

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          minHeight: '4.5rem',
          px: 2,
          py: 1,
          boxSizing: 'border-box',
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 0 }}>
          {isGroupChat ? (
            <AvatarGroup max={3}>
              {avatars.map((avatar, index) => (
                <Avatar key={`${avatar}-${index}`} src={avatar} />
              ))}
            </AvatarGroup>
          ) : (
            <Avatar src={avatars[0]}>{title?.charAt(0)?.toUpperCase()}</Avatar>
          )}
          <Stack sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" fontWeight={600} noWrap>
              {title}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {isGroupChat ? `${members.length} members` : 'Direct message'}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={0.5}>
          <Tooltip title="AI conversation tools">
            <span>
              <IconButton
                aria-label="AI conversation tools"
                aria-haspopup="menu"
                aria-expanded={Boolean(aiMenuAnchor)}
                disabled={!chat?._id}
                onClick={(event) => setAiMenuAnchor(event.currentTarget)}
                sx={{ color: 'primary.main' }}
              >
                <AutoAwesomeIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Menu
            anchorEl={aiMenuAnchor}
            open={Boolean(aiMenuAnchor)}
            onClose={() => setAiMenuAnchor(null)}
          >
            <MenuItem onClick={() => openAiFeature('summary')}>
              Summarize conversation
            </MenuItem>
            <MenuItem onClick={() => openAiFeature('ask-history')}>
              Ask about this chat
            </MenuItem>
          </Menu>
          <Tooltip title="Audio call">
            <IconButton aria-label="Audio call" sx={{ color: 'success.main' }}
              onClick={() => handleAudioCall()}
            >
              <CallIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Video call">
            <IconButton
              aria-label="Video call"
              disabled={isGroupChat || !!(incomingVideoCall || outgoingVideoCall || activeVideoCall)}
              sx={{ color: 'primary.main' }}
              onClick={() => handleVideoCall()}
            >
              <VideocamIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
      <IncomingCallDialog
        open={!!incomingCall}
        caller={incomingCall?.callerInfo}
        onAccept={handleAccept}
        onReject={handleReject}
      />
      <VideoCallDialog
        open={!!incomingVideoCall}
        caller={incomingVideoCall?.callerInfo}
        onAccept={handleAcceptVideoCall}
        onReject={handleRejectVideoCall}
      />
      {isSummaryOpen && (
        <ConversationSummary
          chatId={chat._id}
          open={isSummaryOpen}
          onClose={closeAiFeature}
        />
      )}
      {isAskHistoryOpen && (
        <AskChatHistoryDialog
          chatId={chat._id}
          open={isAskHistoryOpen}
          onClose={closeAiFeature}
        />
      )}

      <AudioCall
        open={!!callSession}
        isCaller={!!callSession?.isCaller}
        startCall={!!activeCall?.isCaller}
        callerId={callSession?.callerId}
        calledId={callSession?.calledId}
        chatId={callSession?.chatId}
        participant={callSession?.participant}
        localStream={callSession?.localStream}
        onEnd={() => {
          setOutgoingCall(null);
          setActiveCall(null);
        }} />

      {(activeVideoCall || outgoingVideoCall || incomingVideoCall) && (
        <VideoCall
          open={!!(activeVideoCall || outgoingVideoCall)}
          listenForOffer={!!incomingVideoCall}
          isCaller={!!(activeVideoCall || outgoingVideoCall)?.isCaller}
          startCall={!!activeVideoCall?.isCaller}
          callerId={(activeVideoCall || outgoingVideoCall)?.callerId || incomingVideoCall?.callerInfo?._id?.toString()}
          calledId={(activeVideoCall || outgoingVideoCall)?.calledId || user?._id?.toString()}
          chatId={(activeVideoCall || outgoingVideoCall)?.chatId || incomingVideoCall?.chatId?.toString()}
          participant={(activeVideoCall || outgoingVideoCall)?.participant || incomingVideoCall?.callerInfo}
          localStream={(activeVideoCall || outgoingVideoCall)?.localStream}
          onEnd={() => {
            setOutgoingVideoCall(null);
            setActiveVideoCall(null);
          }}
        />
      )}
    </>
  )
}

export default ChatHeader

ChatHeader.propTypes = {
  chat: PropTypes.object,
  user: PropTypes.object,
};
