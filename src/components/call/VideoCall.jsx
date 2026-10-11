import { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import { getSocket } from "../../socket";
import {
  END_VIDEO_CALL,
  NEW_VIDEO_CALL_ANSWER,
  NEW_VIDEO_CALL_OFFER,
  VIDEO_ICE_CANDIDATE,
} from "../../constants/events";

const VideoCall = ({
  open,
  listenForOffer = false,
  isCaller,
  startCall,
  callerId,
  calledId,
  chatId,
  participant,
  localStream,
  onEnd,
}) => {
  const [error, setError] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const localStreamRef = useRef(localStream || null);
  const peerConnectionRef = useRef(null);
  const pendingCandidatesRef = useRef([]);
  const onEndRef = useRef(onEnd);
  const socket = getSocket();

  const setLocalVideoElement = useCallback((element) => {
    localVideoRef.current = element;
    if (element && localStreamRef.current) {
      element.srcObject = localStreamRef.current;
    }
  }, []);

  const setRemoteVideoElement = useCallback((element) => {
    remoteVideoRef.current = element;
    if (element && remoteStreamRef.current) {
      element.srcObject = remoteStreamRef.current;
    }
  }, []);

  useEffect(() => {
    onEndRef.current = onEnd;
  }, [onEnd]);

  const cleanup = useCallback(() => {
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    pendingCandidatesRef.current = [];
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    remoteStreamRef.current = null;
    setIsConnected(false);
  }, []);

  useEffect(() => {
    localStreamRef.current = localStream || localStreamRef.current;
    if (localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
  }, [localStream]);

  const getLocalStream = useCallback(async () => {
    if (localStreamRef.current) return localStreamRef.current;
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    localStreamRef.current = stream;
    if (localVideoRef.current) localVideoRef.current.srcObject = stream;
    return stream;
  }, []);

  const createPeerConnection = useCallback(() => {
    if (peerConnectionRef.current) return peerConnectionRef.current;
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnection.onicecandidate = ({ candidate }) => {
      if (!candidate) return;
      socket.emit(VIDEO_ICE_CANDIDATE, {
        callerId,
        calledId,
        chatId,
        candidate,
      });
    };
    peerConnection.ontrack = (event) => {
      const [stream] = event.streams;
      if (stream) {
        remoteStreamRef.current = stream;
      } else {
        remoteStreamRef.current ||= new MediaStream();
        if (!remoteStreamRef.current.getTracks().some((track) => track.id === event.track.id)) {
          remoteStreamRef.current.addTrack(event.track);
        }
      }
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStreamRef.current;
      }
    };
    peerConnection.onconnectionstatechange = () => {
      setIsConnected(peerConnection.connectionState === "connected");
      if (peerConnection.connectionState === "failed") {
        setError("The video connection failed. Please try again.");
      }
    };
    peerConnectionRef.current = peerConnection;
    return peerConnection;
  }, [socket, callerId, calledId, chatId]);

  const addLocalTracks = useCallback(async (peerConnection) => {
    const stream = await getLocalStream();
    stream.getTracks().forEach((track) => {
      if (!peerConnection.getSenders().some((sender) => sender.track === track)) {
        peerConnection.addTrack(track, stream);
      }
    });
  }, [getLocalStream]);

  const createOffer = useCallback(async () => {
    try {
      const peerConnection = createPeerConnection();
      await addLocalTracks(peerConnection);
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.emit(NEW_VIDEO_CALL_OFFER, {
        callerId,
        calledId,
        chatId,
        offer,
      });
    } catch (callError) {
      setError(callError.message || "Could not start the video call.");
    }
  }, [createPeerConnection, addLocalTracks, socket, callerId, calledId, chatId]);

  useEffect(() => {
    if (!open || !startCall || !isCaller) return;
    createOffer();
  }, [open, startCall, isCaller, createOffer]);

  useEffect(() => {
    const shouldListen = open || listenForOffer;
    if (!shouldListen) return undefined;

    const handleOffer = async ({ offer, callerId: offerCallerId, calledId: offerCalledId, chatId: offerChatId }) => {
      if (
        offerChatId !== chatId ||
        offerCallerId?.toString() !== callerId?.toString() ||
        offerCalledId?.toString() !== calledId?.toString()
      ) return;
      try {
        const peerConnection = createPeerConnection();
        await addLocalTracks(peerConnection);
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.emit(NEW_VIDEO_CALL_ANSWER, {
          callerId: offerCallerId,
          calledId: offerCalledId,
          chatId: offerChatId,
          answer,
        });
        for (const candidate of pendingCandidatesRef.current) {
          await peerConnection.addIceCandidate(candidate);
        }
        pendingCandidatesRef.current = [];
      } catch (callError) {
        setError(callError.message || "Could not answer the video call.");
      }
    };

    const handleAnswer = async ({
      answer,
      callerId: answerCallerId,
      calledId: answerCalledId,
      chatId: answerChatId,
    }) => {
      if (
        answerChatId !== chatId ||
        answerCallerId?.toString() !== callerId?.toString() ||
        answerCalledId?.toString() !== calledId?.toString() ||
        !peerConnectionRef.current
      ) return;
      try {
        await peerConnectionRef.current.setRemoteDescription(
          new RTCSessionDescription(answer),
        );
        for (const candidate of pendingCandidatesRef.current) {
          await peerConnectionRef.current.addIceCandidate(candidate);
        }
        pendingCandidatesRef.current = [];
      } catch (callError) {
        setError(callError.message || "Could not connect the video call.");
      }
    };

    const handleCandidate = async ({
      candidate,
      callerId: candidateCallerId,
      calledId: candidateCalledId,
      chatId: candidateChatId,
    }) => {
      if (
        candidateChatId !== chatId ||
        candidateCallerId?.toString() !== callerId?.toString() ||
        candidateCalledId?.toString() !== calledId?.toString()
      ) return;
      const iceCandidate = new RTCIceCandidate(candidate);
      if (!peerConnectionRef.current?.remoteDescription) {
        pendingCandidatesRef.current.push(iceCandidate);
        return;
      }
      try {
        await peerConnectionRef.current.addIceCandidate(iceCandidate);
      } catch (callError) {
        setError(callError.message || "Could not establish the video connection.");
      }
    };

    const handleRemoteEnd = ({ callerId: endedCallerId, calledId: endedCalledId, chatId: endedChatId }) => {
      if (
        endedChatId !== chatId ||
        endedCallerId?.toString() !== callerId?.toString() ||
        endedCalledId?.toString() !== calledId?.toString()
      ) return;
      cleanup();
      onEndRef.current?.();
    };

    socket.on(NEW_VIDEO_CALL_OFFER, handleOffer);
    socket.on(NEW_VIDEO_CALL_ANSWER, handleAnswer);
    socket.on(VIDEO_ICE_CANDIDATE, handleCandidate);
    socket.on(END_VIDEO_CALL, handleRemoteEnd);
    return () => {
      socket.off(NEW_VIDEO_CALL_OFFER, handleOffer);
      socket.off(NEW_VIDEO_CALL_ANSWER, handleAnswer);
      socket.off(VIDEO_ICE_CANDIDATE, handleCandidate);
      socket.off(END_VIDEO_CALL, handleRemoteEnd);
    };
  }, [
    open,
    listenForOffer,
    socket,
    chatId,
    callerId,
    calledId,
    cleanup,
    createPeerConnection,
    addLocalTracks,
  ]);

  const handleEnd = () => {
    socket.emit(END_VIDEO_CALL, { callerId, calledId, chatId });
    cleanup();
    onEndRef.current?.();
  };

  useEffect(() => () => cleanup(), [cleanup]);

  const toggleAudio = () => {
    const muted = !isMuted;
    localStreamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = !muted;
    });
    setIsMuted(muted);
  };

  const toggleCamera = () => {
    const cameraOn = !isCameraOn;
    localStreamRef.current?.getVideoTracks().forEach((track) => {
      track.enabled = cameraOn;
    });
    setIsCameraOn(cameraOn);
  };

  const participantName = participant?.name || "Video call";

  return (
    <Dialog
      open={open}
      onClose={handleEnd}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          overflow: "hidden",
          borderRadius: 3,
          color: "#f3f6f2",
          bgcolor: "#101513",
          backgroundImage: "linear-gradient(145deg, #1a2420, #0d1110)",
        },
      }}
    >
      <DialogContent sx={{ p: { xs: 1.5, sm: 2.5 } }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6" fontWeight={600}>{participantName}</Typography>
              <Typography variant="body2" color={isConnected ? "#9ee4bd" : "rgba(243,246,242,0.65)"}>
                {error || (isConnected ? "Connected" : isCaller ? "Calling..." : "Connecting...")}
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: "rgba(243,246,242,0.55)" }}>
              Video call
            </Typography>
          </Stack>

          <Box
            sx={{
              position: "relative",
              width: "100%",
              aspectRatio: "16 / 9",
              minHeight: { xs: 220, sm: 360 },
              overflow: "hidden",
              borderRadius: 2,
              bgcolor: "#080a09",
            }}
          >
            <video
              ref={setRemoteVideoElement}
              autoPlay
              playsInline
              aria-label="Remote video"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {!isConnected && (
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{ position: "absolute", inset: 0, pointerEvents: "none" }}
              >
                <Typography color="rgba(243,246,242,0.65)">
                  {error ? "Call could not connect" : `Waiting for ${participantName}...`}
                </Typography>
              </Stack>
            )}
            <Box
              component="video"
              ref={setLocalVideoElement}
              autoPlay
              muted
              playsInline
              aria-label="Your video"
              sx={{
                position: "absolute",
                right: { xs: 10, sm: 18 },
                bottom: { xs: 10, sm: 18 },
                width: { xs: 100, sm: 180 },
                aspectRatio: "4 / 3",
                objectFit: "cover",
                border: "2px solid rgba(255,255,255,0.7)",
                borderRadius: 2,
                bgcolor: "#222",
                boxShadow: 4,
              }}
            />
          </Box>

          <Stack direction="row" justifyContent="center" spacing={2}>
            <Tooltip title={isMuted ? "Turn microphone on" : "Mute microphone"}>
              <IconButton onClick={toggleAudio} aria-label="Toggle microphone" sx={{ color: "white", bgcolor: isMuted ? "#b64b46" : "rgba(255,255,255,0.12)" }}>
                {isMuted ? <MicOffIcon /> : <MicIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title={isCameraOn ? "Turn camera off" : "Turn camera on"}>
              <IconButton onClick={toggleCamera} aria-label="Toggle camera" sx={{ color: "white", bgcolor: !isCameraOn ? "#b64b46" : "rgba(255,255,255,0.12)" }}>
                {isCameraOn ? <VideocamIcon /> : <VideocamOffIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="End call">
              <IconButton onClick={handleEnd} aria-label="End video call" sx={{ color: "white", bgcolor: "#d44842", "&:hover": { bgcolor: "#bb3934" } }}>
                <CallEndIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default VideoCall;

VideoCall.propTypes = {
  open: PropTypes.bool.isRequired,
  listenForOffer: PropTypes.bool,
  isCaller: PropTypes.bool.isRequired,
  startCall: PropTypes.bool.isRequired,
  callerId: PropTypes.string.isRequired,
  calledId: PropTypes.string.isRequired,
  chatId: PropTypes.string.isRequired,
  participant: PropTypes.shape({ name: PropTypes.string }),
  localStream: PropTypes.object,
  onEnd: PropTypes.func,
};
