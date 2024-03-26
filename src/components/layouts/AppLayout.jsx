import { Drawer, Grid } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { userError } from '../../hooks/hook'
import { useMyChatsQuery } from '../../redux/api/api'
import { setIsMobile } from '../../redux/reducers/misc'
import Title from "../shared/Title"
import ChatList from '../specifics/ChatList'
import Profile from '../specifics/Profile'
import Header from './Header'
import { LayoutLoader } from "./Loaders"

const AppLayout = () => (WrappedComponent) => {
  return (props) => {

    const { id } = useParams();

    const dispatch = useDispatch();

    const {isMobileMenu } = useSelector(state=>state.misc)

    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");

    userError([{isError, error}]);

    const handleDeleteChat = (e, _id, groupChat) => {
      e.preventDefault();
      console.log("chat is deleted", _id, groupChat)
    };

    const handleMobileClose = ()=> dispatch(setIsMobile(false))

    return (
      <>
        <Title />
        <Header />
        {
          isLoading?<LayoutLoader/>:(
            <Drawer open={isMobileMenu} onClose={handleMobileClose}>
              <ChatList width="70vw" chats={data?.chats} chatId={id}
                  handleDeleteChat={handleDeleteChat}
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
                  handleDeleteChat={handleDeleteChat}
                />
              )
            }
          </Grid>
          <Grid item xs={12}
            height={"100%"}
            md={5}
            lg={6}
          >
            <WrappedComponent {...props} />
          </Grid>
          <Grid item md={4}
            lg={3}
            sx={{
              display: { xs: "none", md: "block" },
              padding: "2rem",
              backgroundColor: "rgba(0,0,0,0.85)"
            }}
            height={"100%"}
          ><Profile /></Grid>
        </Grid>

      </>

    )
  }
}

export default AppLayout