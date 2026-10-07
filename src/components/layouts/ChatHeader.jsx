import { Call as CallIcon, Videocam as VideocamIcon } from '@mui/icons-material'
import { Avatar, AvatarGroup, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { getSocket } from '../../socket';
import { NEW_AUDIO_CALL_ALERT } from '../../constants/events';
import { useEffect } from 'react';
import { useState } from 'react';
import IncomingCallDialog from '../call/IncomingCallDialog';
import { ACCEPT_AUDIO_CALL } from '../../constants/event';
import AudioCall from '../call/AudioCall';

const ChatHeader = ({ chat, user }) => {

  const [incomingCall, setIncomingCall] = useState(null);
  const [outgoingCall, setOutgoingCall] = useState(null);
  const [activeCall, setActiveCall] = useState(null);

  const socket = getSocket();
  const members = chat?.members || []

  const isGroupChat = chat?.groupChat || chat?.groupchat
  const otherMember = members.find((member) =>
    typeof member === 'object' && member?._id !== user?._id
  )

  const title = isGroupChat ? chat?.name : otherMember?.name || chat?.name || 'Chat'
  const avatars = isGroupChat
    ? members.map((member) => member?.avatar).filter(Boolean)
    : [otherMember?.avatar].filter(Boolean)

  const handleAudioCall = async () => {
    const data = await navigator.mediaDevices.getUserMedia({
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
      localStream: data,
      isCaller: true,
    });
  };

  const handleVideoCall = () => { };

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

  console.log(incomingCall)

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
          <Tooltip title="Audio call">
            <IconButton aria-label="Audio call" sx={{ color: 'success.main' }}
              onClick={() => handleAudioCall()}
            >
              <CallIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Video call">
            <IconButton aria-label="Video call" sx={{ color: 'primary.main' }}
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
    </>
  )
}

export default ChatHeader
