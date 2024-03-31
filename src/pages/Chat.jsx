import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material';
import { IconButton, Stack } from '@mui/material';
import React, { useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FileMenu from '../components/dialogs/FileMenu';
import AppLayout from '../components/layouts/AppLayout';
import { LayoutLoader } from '../components/layouts/Loaders';
import MessageComponent from '../components/shared/MessageComponent';
import { InputBox } from '../components/styles/StyledComponents';
import { grayColor, orange } from '../constants/color';
import { NEW_MESSAGE } from '../constants/event';
import { useSocketEvent, userError } from '../hooks/hook';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import { getSocket } from '../socket';
import { useInfiniteScrollTop } from "6pp";
import { setIsFileMenu } from '../redux/reducers/misc';


const Chat = ({ chatId }) => {

  const containerRef = useRef(null);
  const dispatch = useDispatch();

  const socket = getSocket();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [fileMenuEnchor, setFileMenuEnchor] = useState(null);
  const [page, setPage] = useState(1);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const oldMessages = useGetMessagesQuery({ chatId, page });
  const { user } = useSelector(state => state.auth);

  const { data:oldMessagesChunk, setData:setOldMessagesChunk } = useInfiniteScrollTop(
    containerRef,
    oldMessages?.data?.totalPages,
    page,
    setPage,
    oldMessages?.data?.message
  )

  const members = chatDetails?.data?.chat?.members;
  const errors = [
    {
      isError: chatDetails.isError,
      error: chatDetails.error
    },
    {
      isError: oldMessages.isError,
      error: oldMessages.error
    },
  ]

  const handleFileOpen = (e)=>{
    dispatch(setIsFileMenu(true));
    setFileMenuEnchor(e.currentTarget);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    socket.emit(NEW_MESSAGE, { chatId, members, message });

    setMessage("");
  };

  const newMessagesHandler = useCallback((data) => {
    setMessages(prev => [...prev, data.message])
  }, [])

  const eventHandler = { [NEW_MESSAGE]: newMessagesHandler };

  useSocketEvent(socket, eventHandler);

  const allMessages = [...oldMessagesChunk, ...messages];

  userError(errors);


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
          }} value={message} onChange={(e) => setMessage(e.target.value)} />

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