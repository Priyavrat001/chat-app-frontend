import React from 'react'
import Header from './Header'
import Title from "../shared/Title"
import { Grid } from '@mui/material'
import ChatList from '../specifics/ChatList'
import { sampleChats } from "../../constants/sampleData";
import { useParams } from 'react-router-dom'
import Profile from '../specifics/Profile'

const AppLayout = ()=> (WrappedComponent) => {
  return (props)=>{

    const {id} = useParams();

    const handleDeleteChat = (e, _id, groupChat)=>{
      e.preventDefault();
      console.log("chat is deleted", _id, groupChat)
    }

    return (
        <>
        <Title/>
         <Header/>
         <Grid container  height="calc(100vh - 4rem)">

          <Grid item height={"100%"}
          sm={4}
          md={3}
          sx={{
            display:{xs:"none", sm:"block"}
          }}
          ><ChatList chats={sampleChats} chatId={id}
          handleDeleteChat={handleDeleteChat}
          />
          </Grid>
          <Grid item xs={12}
           height={"100%"}
           md={5}
           lg={6}
                >
          <WrappedComponent {...props}/>
          </Grid>
          <Grid item md={4}
           lg={3}
           sx={{
            display:{xs:"none", md:"block"},
            padding:"2rem",
            bgcolor:"rgba(0,0,0,0.85)"
          }}
            height={"100%"}
           ><Profile/></Grid>
         </Grid>
       
        </>
       
    )
  }
}

export default AppLayout