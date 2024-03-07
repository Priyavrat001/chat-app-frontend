import { Dialog, DialogTitle, Typography, Stack, Button } from '@mui/material'
import React, { useState } from 'react'
import { sampleUsers } from "../../constants/sampleData";
import UserItem from "../shared/UserItems";

const AddMemberDialog = ({addMember, isLoadingAddMember, chatId}) => {

    const [members, setMembers] = useState(sampleUsers);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const selectHandler = (id) => {
    setSelectedMembers((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])
  }

    const addMemberSubmitHandler = ()=>{
        closeHandler()
    }
    const closeHandler = ()=>{
        setSelectedMembers([])
        setMembers([])
    }
  return (
    <Dialog open onClose={closeHandler}>
        <Stack>
            <DialogTitle textAlign={"center"}>
                Add Member
            </DialogTitle>
            <Stack spacing={"1rem"}>
                {
                    members.length>0 ? members.map((i)=>(
                        <UserItem key={i._id} user={i} handler={selectHandler} isAdded={selectedMembers.includes(i._id)}/>
                    )) : <Typography textAlign={"center"}>No Friends</Typography>
                }
            </Stack>
           <Stack direction={"row"} alignItems={"center"} justifyContent={"space-evenly"} margin={"2rem"}>
           <Button color='error' onClick={closeHandler}>Cancel</Button>
            <Button variant='contained' disabled={isLoadingAddMember}onClick={addMemberSubmitHandler}>Submit Changes</Button>
           </Stack>
        </Stack>

    </Dialog>
  )
}

export default AddMemberDialog