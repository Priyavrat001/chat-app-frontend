import React,{memo} from 'react'
import { sampleNotifications } from '../../constants/sampleData'
import { Avatar, Button, Dialog, DialogTitle, ListItem, Stack, Typography } from '@mui/material'


const Notifications = () => {

const friendRequestHandler = ({_id, accept})=>{
  console.log(_id)
}

  return (
    <Dialog open>
      <Stack
      p={{
        xs:"1rem",
        sm:"2rem"
      }}
      maxWidth={"25rem"}
      >
        <DialogTitle>Notifications</DialogTitle>

        {
          sampleNotifications.length>0?(
            sampleNotifications.map((i)=> <NotificationsItems sender={i.sender} _id={i._id} handler={friendRequestHandler} key={i._id}/>)
          ):<Typography textAlign={"center"}>0 Notifications</Typography>
        }
      </Stack>
    </Dialog>
  )
}   



const NotificationsItems = memo(({sender, _id, handler})=>{
  return (
    <ListItem>
        <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} width={"100%"}>
            <Avatar
            />

            <Typography
                variant="body1"
                sx={{
                    flexGrow: "1",
                    display: "-webkit-box",
                    WebkitLineClamp: "vertical",
                    overflow:"hidden",
                    textOverflow:"ellipsis"
                }}
            >{`${sender.name} sent a request`}</Typography>

            <Stack direction={{
              xs:"column",
            }}>
              <Button onClick={()=>handler({_id, accept:true})}>
                Accept
              </Button>
              <Button color='error' onClick={()=>handler({_id, accept:false})}>
                Reject
              </Button>
            </Stack>
        </Stack>
    </ListItem> 
  )
})

export default Notifications