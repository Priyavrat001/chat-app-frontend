import React,{memo} from 'react'
import { sampleNotifications } from '../../constants/sampleData'
import { Avatar, Button, Dialog, DialogTitle, ListItem, Stack, Typography } from '@mui/material'
import { useAcceptFriendRequestMutation, useGetNotificaionsQuery } from '../../redux/api/api'
import { userError } from '../../hooks/hook'
import { LayoutLoader } from '../layouts/Loaders'
import { useDispatch, useSelector } from 'react-redux'
import { setIsNotification } from '../../redux/reducers/misc'
import { toast } from 'react-hot-toast'


const Notifications = () => {

  const {isLoading, data, isError, error} = useGetNotificaionsQuery();
  const [acceptRequest] = useAcceptFriendRequestMutation();
  const {isNotifactions} = useSelector(state=>state.misc);

  const dispatch = useDispatch();

const friendRequestHandler = async({_id, accept})=>{
  dispatch(setIsNotification(false));
    try {
      const res = await acceptRequest({requestId:_id, accept});
      if (res.data?.success) {
        console.log("User socket here");
        toast.success(res.data.message);
      } else {
        toast.error(res.data?.error || "Something went wrong");
      }
    } catch (error) {
      console.log(error)
    }
};

const oncloseHandler = ()=>{
  dispatch(setIsNotification(false));
}

userError([{error, isError}]);

  return (
    <Dialog open={isNotifactions} onClose={oncloseHandler}>
      <Stack
      p={{
        xs:"1rem",
        sm:"2rem"
      }}
      maxWidth={"25rem"}
      >
        <DialogTitle>Notifications</DialogTitle>

        {
          isLoading?<LayoutLoader/>:<>
          {
          data?.allRequest.length>0?(
            data?.allRequest.map((i)=> <NotificationsItems sender={i.sender} _id={i._id} handler={friendRequestHandler} key={i._id}/>)
          ):<Typography textAlign={"center"}>0 Notifications</Typography>
        }
          </>
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