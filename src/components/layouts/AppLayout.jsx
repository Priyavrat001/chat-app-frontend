import { Drawer, Grid } from '@mui/material'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useSocketEvent, userError } from '../../hooks/hook'
import { useMyChatsQuery } from '../../redux/api/api'
import { setIsMobile } from '../../redux/reducers/misc'
import Title from "../shared/Title"
import ChatList from '../specifics/ChatList'
import Profile from '../specifics/Profile'
import Header from './Header'
import { LayoutLoader } from "./Loaders"
import { getSocket } from '../../socket'
import { NEW_MESSAGE_ALERT, NEW_REQUEST } from '../../constants/event'
import { incrementNotification, setNewMessagesAlert } from '../../redux/reducers/chat'

const AppLayout = () => (WrappedComponent) => {
  return (props) => {

    const { id } = useParams();

    const dispatch = useDispatch();
    const socket = getSocket();

    const { isMobileMenu } = useSelector(state => state.misc)
    const { user } = useSelector(state => state.auth);
    const { newMessageAlert } = useSelector(state => state.chat);

    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");

    userError([{ isError, error }]);

    const handleDeleteChat = (e, _id, groupChat) => {
      e.preventDefault();
      console.log("chat is deleted", _id, groupChat)
    };

    const handleMobileClose = () => dispatch(setIsMobile(false));
    
    const newMessageAlertListener = useCallback((data)=>{
      if(data.chatId === id) return;
      dispatch(setNewMessagesAlert(data));
    }, [id]);
    
    const newRequestListener = useCallback(() => {
      dispatch(incrementNotification());
    }, [dispatch]);

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertListener,
      [NEW_REQUEST]: newRequestListener,
    };

    useSocketEvent(socket, eventHandlers);

    return (
      <>
        <Title />
        <Header />
        {
          isLoading ? <LayoutLoader /> : (
            <Drawer open={isMobileMenu} onClose={handleMobileClose}>
              <ChatList width="70vw" chats={data?.chats} chatId={id}
                handleDeleteChat={handleDeleteChat}  newMessagesAlert={newMessageAlert}
              />
            </Drawer>
          )
        }
        <Grid container height="calc(100vh - 4rem)">

          <Grid item height={"100%"}
            sm={4}
            md={3}
            sx={{
              display: { xs: "none", sm: "block" }
            }}
          >
            {
              isLoading ? <LayoutLoader /> : (
                <ChatList chats={data?.chats} chatId={id}
                  handleDeleteChat={handleDeleteChat} newMessagesAlert={newMessageAlert}
                />
              )
            }
          </Grid>
          <Grid item xs={12}
            height={"100%"}
            md={5}
            lg={6}
          >
            <WrappedComponent {...props} chatId={id} />
          </Grid>
          <Grid item md={4}
            lg={3}
            sx={{
              display: { xs: "none", md: "block" },
              padding: "2rem",
              backgroundColor: "rgba(0,0,0,0.85)"
            }}
            height={"100%"}
          ><Profile user={user} /></Grid>
        </Grid>

      </>

    )
  }
}

export default AppLayout