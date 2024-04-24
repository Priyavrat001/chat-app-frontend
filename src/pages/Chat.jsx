import { useInfiniteScrollTop } from "6pp";
import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material';
import { IconButton, Stack } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FileMenu from '../components/dialogs/FileMenu';
import AppLayout from '../components/layouts/AppLayout';
import { LayoutLoader, TypingLoader } from '../components/layouts/Loaders';
import MessageComponent from '../components/shared/MessageComponent';
import { InputBox } from '../components/styles/StyledComponents';
import { grayColor, orange } from '../constants/color';
import { ALERT, NEW_MESSAGE, START_TYPING, STOP_TYPING } from '../constants/event';
import { useErrors, useSocketEvent } from '../hooks/hook';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import { removeNewMessageAlert } from '../redux/reducers/chat';
import { setIsFileMenu } from '../redux/reducers/misc';
import { getSocket } from '../socket';


const Chat = ({ chatId }) => {

  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const socket = getSocket();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [fileMenuEnchor, setFileMenuEnchor] = useState(null);
  const [page, setPage] = useState(1);
  const [userTyping, setUserTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);

  const typingTimeOut = useRef(null);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
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

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuEnchor(e.currentTarget);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    // Emitting the message to the server
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  const messageChangeHanlder = (e)=>{
    setMessage(e.target.value);

    if(!userTyping){
      socket.emit(START_TYPING, {members, chatId});
      setUserTyping(true);
    };

    if(typingTimeOut.current) clearTimeout(typingTimeOut.current);

    typingTimeOut.current = setTimeout(() => {
      socket.emit(STOP_TYPING, {members, chatId});
      setUserTyping(false);
    }, 2000);

  }

  useEffect(() => {
    dispatch(removeNewMessageAlert(chatId));

    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
    };
  }, [chatId]);

  useEffect(() => {
    if(bottomRef.current) bottomRef.current.scrollIntoView({behavior:"smooth"});
  }, [messages]);

  useEffect(() => {
   if(chatDetails.isError) return navigate("/")
  }, [chatDetails.isError]);
  
  

  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );

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

  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };


  useSocketEvent(socket, eventHandler);

  const allMessages = [...oldMessages, ...messages];

  useErrors(errors);


  return chatDetails.isLoading ? <LayoutLoader /> : (
    <>
      <Stack ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={grayColor}
        height={"90%"}
        sx={{
          overflow: "hidden",
          overflowY: "auto"
        }}
      >

        {
          allMessages.map((i) => (
            <MessageComponent key={i._id} message={i} user={user} />
          ))
        }

        {
          otherUserTyping && <TypingLoader/>
        }

        <div ref={bottomRef}/>

      </Stack>

      <form style={{ height: "10%" }} onSubmit={handleSubmit}>

        <Stack direction={"row"} height={"100%"} padding={"1rem"} alignItems={"center"} position={"relative"}>
          <IconButton sx={{
            rotate: "30deg",
          }}
          onClick={handleFileOpen}
          >
            <AttachFileIcon />
          </IconButton>
          <InputBox placeholder='Type message here...' sx={{
            height: "5vh"
          }} value={message} onChange={messageChangeHanlder} />

          <IconButton type='submit' sx={{
            rotate: "-30deg",
            backgroundColor: orange,
            color: "white",
            marginLeft: "1rem",
            padding: "0.5rem",
            "&:hover": {
              backgroundColor: "error.dark",
            }
          }}>
            <SendIcon />
          </IconButton>

        </Stack>

      </form>
      <FileMenu anchorE1={fileMenuEnchor} chatId={chatId}/>
    </>
  )
}

export default AppLayout()(Chat);