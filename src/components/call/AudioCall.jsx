import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
    Avatar,
    Box,
    Dialog,
    DialogContent,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from "@mui/material";
import CallEndIcon from "@mui/icons-material/CallEnd";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

import { getSocket } from "../../socket";
import {
    NEW_AUDIO_CALL_OFFER,
    NEW_AUDIO_CALL_ANSWER,
    ICE_CANDIDATE,
    END_AUDIO_CALL,
} from "../../constants/event";

const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60)
        .toString()
        .padStart(2, "0");

    const remainingSeconds = (seconds % 60)
        .toString()
        .padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;
};

const AudioCall = ({
    isCaller = false,
    participant,
    open = true,
    isConnected = false,
    startCall = false,
    callerId,
    calledId,
    chatId,
    localStream,
    onEnd,
    onMuteChange,
    onSpeakerChange,
}) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isSpeakerOn, setIsSpeakerOn] = useState(true);
    const [isEnded, setIsEnded] = useState(false);
    const [callConnected, setCallConnected] = useState(isConnected);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(localStream || null);
    const remoteAudioRef = useRef(null);

    const socket = getSocket();

    useEffect(() => {
        if (localStream) {
            localStreamRef.current = localStream;
        }
    }, [localStream]);

    /*
     * ----------------------------------------------------
     * Create RTCPeerConnection
     * ----------------------------------------------------
     */

    const createPeerConnection = () => {
        const peerConnection = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.l.google.com:19302",
                },
            ],
        });

        /*
         * Send ICE candidates to the other user
         */

        peerConnection.onicecandidate = (event) => {
            if (!event.candidate) return;

            socket.emit(ICE_CANDIDATE, {
                callerId,
                calledId,
                chatId,
                candidate: event.candidate,
            });
        };

        /*
         * Receive remote audio stream
         */

        peerConnection.ontrack = (event) => {
            const [remoteStream] = event.streams;

            if (remoteAudioRef.current) {
                remoteAudioRef.current.srcObject = remoteStream;
            }

            setCallConnected(true);
        };

        /*
         * Monitor WebRTC connection
         */

        peerConnection.onconnectionstatechange = () => {
            const state = peerConnection.connectionState;

            console.log("WebRTC connection state:", state);

            if (state === "connected") {
                setCallConnected(true);
            }

            if (
                state === "failed" ||
                state === "disconnected" ||
                state === "closed"
            ) {
                setCallConnected(false);
            }
        };

        peerConnectionRef.current = peerConnection;

        return peerConnection;
    };

    /*
     * ----------------------------------------------------
     * Get microphone
     * ----------------------------------------------------
     */

    const getLocalAudio = async () => {
        if (localStreamRef.current) {
            return localStreamRef.current;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });

        localStreamRef.current = stream;

        return stream;
    };

    /*
     * ----------------------------------------------------
     * Caller creates OFFER
     * ----------------------------------------------------
     */

    const createOffer = async () => {
        try {
            const stream = await getLocalAudio();

            const peerConnection =
                peerConnectionRef.current || createPeerConnection();

            stream.getTracks().forEach((track) => {
                peerConnection.addTrack(track, stream);
            });

            const offer = await peerConnection.createOffer();

            await peerConnection.setLocalDescription(offer);

            socket.emit(NEW_AUDIO_CALL_OFFER, {
                callerId,
                calledId,
                chatId,
                offer,
            });

            console.log("Audio offer sent");
        } catch (error) {
            console.error("Error creating audio offer:", error);
        }
    };

    /*
     * ----------------------------------------------------
     * Receiver creates ANSWER
     * ----------------------------------------------------
     */

    const handleOffer = async ({
        offer,
        callerId: incomingCallerId,
        calledId: incomingCalledId,
        chatId: incomingChatId,
    }) => {
        try {
            /*
             * Ignore offers that don't belong to this call
             */

            if (incomingChatId !== chatId) return;

            const stream = await getLocalAudio();

            const peerConnection =
                peerConnectionRef.current || createPeerConnection();

            stream.getTracks().forEach((track) => {
                peerConnection.addTrack(track, stream);
            });

            await peerConnection.setRemoteDescription(
                new RTCSessionDescription(offer)
            );

            const answer = await peerConnection.createAnswer();

            await peerConnection.setLocalDescription(answer);

            socket.emit(NEW_AUDIO_CALL_ANSWER, {
                callerId: incomingCallerId,
                calledId: incomingCalledId,
                chatId: incomingChatId,
                answer,
            });

            console.log("Audio answer sent");
        } catch (error) {
            console.error("Error handling audio offer:", error);
        }
    };

    /*
     * ----------------------------------------------------
     * Caller receives ANSWER
     * ----------------------------------------------------
     */

    const handleAnswer = async ({
        answer,
        chatId: incomingChatId,
    }) => {
        try {
            if (incomingChatId !== chatId) return;

            if (!peerConnectionRef.current) return;

            await peerConnectionRef.current.setRemoteDescription(
                new RTCSessionDescription(answer)
            );

            console.log("Audio answer received");
        } catch (error) {
            console.error("Error handling audio answer:", error);
        }
    };

    /*
     * ----------------------------------------------------
     * ICE candidate
     * ----------------------------------------------------
     */

    const handleIceCandidate = async ({
        candidate,
        chatId: incomingChatId,
    }) => {
        try {
            if (incomingChatId !== chatId) return;

            if (!peerConnectionRef.current) return;

            await peerConnectionRef.current.addIceCandidate(
                new RTCIceCandidate(candidate)
            );

            console.log("ICE candidate added");
        } catch (error) {
            console.error("Error adding ICE candidate:", error);
        }
    };

    /*
     * ----------------------------------------------------
     * Socket listeners
     * ----------------------------------------------------
     */

    useEffect(() => {
        if (!open) return;

        socket.on(NEW_AUDIO_CALL_OFFER, handleOffer);
        socket.on(NEW_AUDIO_CALL_ANSWER, handleAnswer);
        socket.on(ICE_CANDIDATE, handleIceCandidate);

        return () => {
            socket.off(NEW_AUDIO_CALL_OFFER, handleOffer);
            socket.off(NEW_AUDIO_CALL_ANSWER, handleAnswer);
            socket.off(ICE_CANDIDATE, handleIceCandidate);
        };
    }, [open, chatId]);

    /*
     * ----------------------------------------------------
     * Start caller
     * ----------------------------------------------------
     */

    useEffect(() => {
        if (!open || !isCaller || !startCall) return;

        createOffer();
    }, [open, isCaller, startCall]);

    /*
     * ----------------------------------------------------
     * Call timer
     * ----------------------------------------------------
     */

    useEffect(() => {
        if (!callConnected || isEnded) {
            setElapsedSeconds(0);
            return undefined;
        }

        const timer = window.setInterval(() => {
            setElapsedSeconds((elapsed) => elapsed + 1);
        }, 1000);

        return () => window.clearInterval(timer);
    }, [callConnected, isEnded]);

    /*
     * ----------------------------------------------------
     * Mute microphone
     * ----------------------------------------------------
     */

    const handleMute = () => {
        const nextMuted = !isMuted;

        setIsMuted(nextMuted);

        if (localStreamRef.current) {
            localStreamRef.current
                .getAudioTracks()
                .forEach((track) => {
                    track.enabled = !nextMuted;
                });
        }

        onMuteChange?.(nextMuted);
    };

    /*
     * ----------------------------------------------------
     * Speaker
     * ----------------------------------------------------
     */

    const handleSpeaker = () => {
        const nextSpeakerState = !isSpeakerOn;

        setIsSpeakerOn(nextSpeakerState);

        /*
         * Browser support for changing output device
         * varies. For now, control audio volume.
         */

        if (remoteAudioRef.current) {
            remoteAudioRef.current.volume = nextSpeakerState ? 1 : 0;
        }

        onSpeakerChange?.(nextSpeakerState);
    };

    /*
     * ----------------------------------------------------
     * End call
     * ----------------------------------------------------
     */

    const handleEnd = () => {
        setIsEnded(true);

        socket.emit(END_AUDIO_CALL, {
            callerId,
            calledId,
            chatId,
        });

        cleanup();

        onEnd?.();
    };

    /*
     * ----------------------------------------------------
     * Cleanup
     * ----------------------------------------------------
     */

    const cleanup = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => {
                track.stop();
            });

            localStreamRef.current = null;
        }

        if (peerConnectionRef.current) {
            peerConnectionRef.current.ontrack = null;
            peerConnectionRef.current.onicecandidate = null;
            peerConnectionRef.current.close();

            peerConnectionRef.current = null;
        }

        if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = null;
        }

        setCallConnected(false);
    };

    /*
     * ----------------------------------------------------
     * Remote user ended call
     * ----------------------------------------------------
     */

    useEffect(() => {
        const handleRemoteEnd = ({
            chatId: incomingChatId,
        }) => {
            if (incomingChatId !== chatId) return;

            setIsEnded(true);

            cleanup();

            onEnd?.();
        };

        socket.on(END_AUDIO_CALL, handleRemoteEnd);

        return () => {
            socket.off(END_AUDIO_CALL, handleRemoteEnd);
        };
    }, [chatId]);

    /*
     * ----------------------------------------------------
     * Cleanup when component unmounts
     * ----------------------------------------------------
     */

    useEffect(() => {
        return () => {
            cleanup();
        };
    }, []);

    const participantName = participant?.name || "Audio call";

    const avatarUrl =
        typeof participant?.avatar === "string"
            ? participant.avatar
            : participant?.avatar?.url;

    const status = callConnected
        ? formatDuration(elapsedSeconds)
        : isCaller
            ? "Calling..."
            : "Connecting...";

    return (
        <>
            {/* Hidden remote audio element */}

            <audio
                ref={remoteAudioRef}
                autoPlay
            />

            <Dialog
                open={open && !isEnded}
                onClose={handleEnd}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        overflow: "hidden",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: 3,
                        color: "#f3f6f2",
                        backgroundColor: "#151b18",
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                        boxShadow: "0 28px 90px rgba(0, 0, 0, 0.5)",
                    },
                }}
            >
                <DialogContent sx={{ p: { xs: 3, sm: 5 } }}>
                    <Stack alignItems="center" spacing={4}>
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                        >
                            <GraphicEqIcon
                                sx={{ color: "#9ee4bd" }}
                            />

                            <Typography
                                variant="overline"
                                sx={{
                                    color: "rgba(243, 246, 242, 0.64)",
                                    letterSpacing: 1.5,
                                }}
                            >
                                Voice call
                            </Typography>
                        </Stack>

                        <Box
                            sx={{
                                position: "relative",
                                display: "grid",
                                placeItems: "center",
                                width: 184,
                                height: 184,

                                "&::before": {
                                    content: '""',
                                    position: "absolute",
                                    inset: 0,
                                    border:
                                        "1px solid rgba(158, 228, 189, 0.35)",
                                    borderRadius: "50%",
                                    animation:
                                        "callPulse 2.8s ease-out infinite",
                                },

                                "@keyframes callPulse": {
                                    "0%": {
                                        transform: "scale(0.76)",
                                        opacity: 0.8,
                                    },
                                    "100%": {
                                        transform: "scale(1.12)",
                                        opacity: 0,
                                    },
                                },
                            }}
                        >
                            <Avatar
                                src={avatarUrl}
                                alt={participantName}
                                sx={{
                                    width: 132,
                                    height: 132,
                                    color: "#151b18",
                                    bgcolor: "#9ee4bd",
                                    fontSize: 48,
                                    fontWeight: 600,
                                    border:
                                        "4px solid rgba(255,255,255,0.08)",
                                    boxShadow:
                                        "0 12px 36px rgba(0,0,0,0.3)",
                                }}
                            >
                                {participantName
                                    .charAt(0)
                                    .toUpperCase()}
                            </Avatar>
                        </Box>

                        <Stack alignItems="center" spacing={1}>
                            <Typography
                                variant="h4"
                                component="h2"
                                textAlign="center"
                                sx={{
                                    fontWeight: 600,
                                    fontSize: {
                                        xs: 26,
                                        sm: 32,
                                    },
                                }}
                            >
                                {participantName}
                            </Typography>

                            <Typography
                                variant="body2"
                                aria-live="polite"
                                sx={{
                                    color: callConnected
                                        ? "#9ee4bd"
                                        : "rgba(243,246,242,0.62)",
                                }}
                            >
                                {status}
                            </Typography>
                        </Stack>

                        <Stack
                            direction="row"
                            alignItems="flex-start"
                            justifyContent="center"
                            spacing={{
                                xs: 3,
                                sm: 5,
                            }}
                            sx={{ pt: 1 }}
                        >
                            {/* Mute */}

                            <Stack alignItems="center" spacing={1}>
                                <Tooltip
                                    title={
                                        isMuted
                                            ? "Turn microphone on"
                                            : "Mute microphone"
                                    }
                                >
                                    <IconButton
                                        onClick={handleMute}
                                        aria-label={
                                            isMuted
                                                ? "Turn microphone on"
                                                : "Mute microphone"
                                        }
                                        aria-pressed={isMuted}
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            color: isMuted
                                                ? "#151b18"
                                                : "#f3f6f2",
                                            bgcolor: isMuted
                                                ? "#f3f6f2"
                                                : "rgba(255,255,255,0.1)",

                                            "&:hover": {
                                                bgcolor: isMuted
                                                    ? "#dce5de"
                                                    : "rgba(255,255,255,0.18)",
                                            },
                                        }}
                                    >
                                        {isMuted ? (
                                            <MicOffIcon />
                                        ) : (
                                            <MicIcon />
                                        )}
                                    </IconButton>
                                </Tooltip>

                                <Typography
                                    variant="caption"
                                    sx={{
                                        color:
                                            "rgba(243,246,242,0.68)",
                                    }}
                                >
                                    {isMuted ? "Muted" : "Mute"}
                                </Typography>
                            </Stack>

                            {/* Speaker */}

                            <Stack alignItems="center" spacing={1}>
                                <Tooltip
                                    title={
                                        isSpeakerOn
                                            ? "Turn speaker off"
                                            : "Turn speaker on"
                                    }
                                >
                                    <IconButton
                                        onClick={handleSpeaker}
                                        aria-label={
                                            isSpeakerOn
                                                ? "Turn speaker off"
                                                : "Turn speaker on"
                                        }
                                        aria-pressed={isSpeakerOn}
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            color: isSpeakerOn
                                                ? "#151b18"
                                                : "#f3f6f2",
                                            bgcolor: isSpeakerOn
                                                ? "#9ee4bd"
                                                : "rgba(255,255,255,0.1)",

                                            "&:hover": {
                                                bgcolor: isSpeakerOn
                                                    ? "#b7edcc"
                                                    : "rgba(255,255,255,0.18)",
                                            },
                                        }}
                                    >
                                        {isSpeakerOn ? (
                                            <VolumeUpIcon />
                                        ) : (
                                            <VolumeOffIcon />
                                        )}
                                    </IconButton>
                                </Tooltip>

                                <Typography
                                    variant="caption"
                                    sx={{
                                        color:
                                            "rgba(243,246,242,0.68)",
                                    }}
                                >
                                    Speaker
                                </Typography>
                            </Stack>

                            {/* End */}

                            <Stack alignItems="center" spacing={1}>
                                <Tooltip title="End call">
                                    <IconButton
                                        onClick={handleEnd}
                                        aria-label="End call"
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            color: "#fff",
                                            bgcolor: "#d9544d",

                                            "&:hover": {
                                                bgcolor: "#c8443d",
                                            },
                                        }}
                                    >
                                        <CallEndIcon />
                                    </IconButton>
                                </Tooltip>

                                <Typography
                                    variant="caption"
                                    sx={{
                                        color:
                                            "rgba(243,246,242,0.68)",
                                    }}
                                >
                                    End
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
};

AudioCall.propTypes = {
    isCaller: PropTypes.bool,

    participant: PropTypes.shape({
        name: PropTypes.string,

        avatar: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                url: PropTypes.string,
            }),
        ]),
    }),

    open: PropTypes.bool,

    isConnected: PropTypes.bool,

    startCall: PropTypes.bool,

    callerId: PropTypes.string,

    calledId: PropTypes.string,

    chatId: PropTypes.string,

    localStream: PropTypes.any,

    onEnd: PropTypes.func,

    onMuteChange: PropTypes.func,

    onSpeakerChange: PropTypes.func,
};

export default AudioCall;