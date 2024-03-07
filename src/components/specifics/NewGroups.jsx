import { useInputValidation } from '6pp';
import { Button, Dialog, DialogTitle, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { sampleUsers } from '../../constants/sampleData';
import UserItems from '../shared/UserItems';


const NewGroups = () => {

  const groupName = useInputValidation();

  const [members, setMembers] = useState(sampleUsers);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const selectHandler = (id) => {
    setSelectedMembers((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])
  }

  console.log(selectedMembers)

  const submitHandler = () => {

  }
  const closeHandler = () => {

  }

  return (
    <Dialog open>
      <Stack
        p={{
          xs: "1rem",
          sm: "2rem"
        }}
        width={"25rem"}
        spacing={"2rem"}
      >
        <DialogTitle
          textAlign={"center"}
          variant='h4'
        >New Group</DialogTitle>

        <TextField label="Group Name" value={groupName.value} onChange={groupName.changeHandler} />

        <Typography variant='body1'>
          Members
        </Typography>

        <Stack>
          {
            members.map((i) => (
              <UserItems user={i} key={i._id} handler={selectHandler} isAdded={selectedMembers.includes(i._id)}/>
            ))
          }
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Button variant='text' color="error" onClick={closeHandler}>Cancel</Button>
          <Button variant='contained' onClick={submitHandler}>Create</Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default NewGroups