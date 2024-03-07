import {Add as AddIcon, Delete as DeleteIcon, Done as DoneIcon, Edit as EditIcon, KeyboardBackspace as KeyboardBackspaceIcon, Menu as MenuIcon } from '@mui/icons-material'
import { Backdrop, Button, Drawer, Grid, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material'
import React, { Suspense, lazy, memo, useEffect, useState } from 'react'
import { bgGradient, matBlack } from "../constants/color"
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Link } from "../components/styles/StyledComponents"
import AvatarCard from "../components/shared/AvatarCard"
import { sampleChats, sampleUsers } from "../constants/sampleData"
import UserItems from '../components/shared/UserItems'
const ConfirmDeleteDialog = lazy(()=>import("../components/dialogs/ConfirmDeleteDialog"))
const AddMemberDialog = lazy(()=>import("../components/dialogs/AddMemberDialog"))

const isAddMember = false;

const Group = () => {

  const chatId = useSearchParams()[0].get("group");

  const navigate = useNavigate();

  const [isMobileMenu, setIsMobileMenu] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);


  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");

  const navigateBack = () => {

    return navigate("/")
  };

  const handleMobileMenu = () => {
    setIsMobileMenu((prev) => !prev)
  };

  const handleMobileClose = () => {
    setIsMobileMenu(false)
  };

  const handleGroupName = () => {
    setIsEdit(false);
    console.log(groupNameUpdatedValue)
  };

  const OpenConfirmDeleteHandler = ()=>{
    console.log("confirm deltehandler")
    setConfirmDeleteDialog(true)
  };

  const closeConfirmDeleteHandler = ()=>{
    setConfirmDeleteDialog(false)
  };

  const openAddHandler = ()=>{

    console.log("open add hanlder")
  }

  const deleteHandler = ()=>{
    console.log("delete handler");
    closeConfirmDeleteHandler();
  };

  const removeMemberHandler = (id)=>{
    console.log("Remove Member", id)
  }

  useEffect(() => {
    if(chatId){
      setGroupName(`Group Name ${chatId}`);
    setGroupNameUpdatedValue(`Group Name ${chatId}`);
    }

    return () => {
      setGroupName("")
      setGroupNameUpdatedValue("");
      setIsEdit(false)
    }

  }, [chatId])


  const IconBtn = (<>
    <Tooltip title="Menu">
      <IconButton sx={{
        display: {
          xs: "block",
          sm: "none",
          position: "fixed",
          right: "1rem",
          top: "1rem",
        }
      }} onClick={handleMobileMenu}>
        <MenuIcon />
      </IconButton>
    </Tooltip>

    <Tooltip title="back">
      <IconButton sx={{
        position: "absolute",
        top: "2rem",
        left: "2rem",
        bgcolor: matBlack,
        color: "white",
        ":hover": {
          bgcolor: "rgba(0, 0, 0, 0.7)"
        }
      }}
        onClick={navigateBack}
      >
        <KeyboardBackspaceIcon />
      </IconButton>
    </Tooltip>
  </>)

  const GroupName = (<Stack direction={"row"} alignItems={"center"} justifyContent={"center"} padding={"2rem"} spacing={"1rem"}>
    {
      isEdit ? <>
        <TextField value={groupNameUpdatedValue} onChange={(e) => setGroupNameUpdatedValue(e.target.value)} />
        <IconButton onClick={handleGroupName}><DoneIcon /></IconButton>
      </> : (
        <>
          <Typography variant='h4'>{groupName}</Typography>
          <IconButton onClick={() => setIsEdit(true)}><EditIcon /></IconButton>
        </>
      )
    }
  </Stack>)


  const ButtonGroup = (
    <Stack
      direction={{
        sm: "row",
        xs: "column-reverse"
      }}
      spacing={"1rem"}
      p={{
        sm: "1rem",
        xs: "0",
        md: "1rem 4rem"
      }}
    >
      <Button size={"large"} color="error" startIcon={<DeleteIcon/>}onClick={OpenConfirmDeleteHandler}>Delete Group</Button>
      <Button size={"large"} variant='contained' startIcon={<AddIcon/>}onClick={openAddHandler}>Add Member</Button>
    </Stack>
  )

  return (
    <Grid container height={"100vh"}>
      <Grid
        item
        sx={{
          display: {
            xs: "none",
            sm: "block"
          },
        }}
        sm={4}
        bgcolor={"#f0f4f8"}
      >
        <GroupList myGroup={sampleChats} chatId={chatId} />
      </Grid>
      <Grid item xs={12} sm={4} sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        padding: "1rem 3rem",

      }} width={"100%"}>
        {IconBtn}
        {groupName && <>

          {GroupName}
          <Typography
            margin={"2rem"}
            alignSelf={"flex-start"}
            variant='body1'
          >Members</Typography>

          <Stack
            maxWidth={"45rem"}
            width={{
              md:"38vw",
              xs:"100%",
              sm:"100%"
            }}
            boxSizing={"border-box"}
            padding={{
              xs: "0",
              sm: "1rem",
              md: "1rem 4rem"
            }}
            spacing={"2rem"}
            height={"50vh"}
            overflow={"auto"}
          >
            {
              sampleUsers.map((i)=>(
                <UserItems key={i._id} user={i} isAdded styling={{
                  boxShadow:"0 0 0.5rem rgba(0,0,0,0.2)",
                  padding:"1rem 2rem",
                  borderRadius:"1rem",
                  width:"100vw"
                  
                }} handler={removeMemberHandler}/>
              ))
            }
          </Stack>
          {ButtonGroup}

        </>}

      </Grid>


      {
        isAddMember && <Suspense fallback={<Backdrop open/>}>
          <AddMemberDialog/>
        </Suspense>
      }

{
  confirmDeleteDialog && <>
  <Suspense fallback={<Backdrop open/>}>

  <ConfirmDeleteDialog
   handleClose={closeConfirmDeleteHandler}
   open={confirmDeleteDialog}
   deleteHandler={deleteHandler}
   message={"Are you sure you want to delete this group"}
   />
  </Suspense>
  </>
}


      <Drawer sx={{ display: { xs: "block", sm: "none" } }} open={isMobileMenu} onClose={handleMobileClose}>
        <GroupList myGroup={sampleChats} chatId={chatId} w={"50vw"} />      </Drawer>
    </Grid>
  )
}


const GroupList = ({ w = "100%", myGroup = [], chatId }) => (
  <Stack width={w}>
    {myGroup.length > 0 ? myGroup.map((group) => <GroupListItems group={group} chatId={chatId} key={group._id} />) :
      (<Typography textAlign={"center"} padding="1rem">No Group</Typography>)}
  </Stack>
);

const GroupListItems = memo(({ group, chatId }) => {
  const {
    name,
    avatar,
    _id
  } = group;

  return <Link to={`?group=${_id}`}
    onClick={e => {
      if (chatId === _id) e.preventDefault();
    }}
  >
    <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
      <AvatarCard avatar={avatar} />
      <Typography>{name}</Typography>
    </Stack>
  </Link>
}
)
export default Group