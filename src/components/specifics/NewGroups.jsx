import { useInputValidation } from '6pp';
import { Button, Dialog, DialogTitle, Skeleton, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAsyncMution, useErrors } from '../../hooks/hook';
import { useAvailableFriendsQuery, useNewGroupMutation } from '../../redux/api/api';
import { setIsNewGroup } from '../../redux/reducers/misc';
import UserItems from '../shared/UserItems';
import { toast } from 'react-hot-toast';


const NewGroups = () => {

  const {isNewGroup} = useSelector(state=>state.misc)
  const dispatch = useDispatch();
  const {isError, error, isLoading, data} = useAvailableFriendsQuery("");
  const [newGroup, isLoadingNewGroup] = useAsyncMution(useNewGroupMutation)
  const groupName = useInputValidation();

  const [selectedMembers, setSelectedMembers] = useState([]);

  const errors = [{
    isError,
    error
  }];

  useErrors(errors);

  const selectHandler = (id) => {
    setSelectedMembers((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])
  };

  const submitHandler = () => {
    if(!groupName.value) return toast.error("Group name is required");

    if(selectedMembers.length < 2) return toast.error("Please select atleast 3 members");
    newGroup("Creating New Group", {name:groupName.value, members:selectedMembers});
    closeHandler()
  }
  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  }

  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
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
            isLoading?(
              <Skeleton/>
            ):
           ( data?.friends?.map((i) => (
              <UserItems user={i} key={i._id} handler={selectHandler} isAdded={selectedMembers.includes(i._id)}/>
            ))
            )
          }
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Button variant='text' color="error" onClick={closeHandler}>Cancel</Button>
          <Button variant='contained' onClick={submitHandler} disabled={isLoadingNewGroup}>Create</Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default NewGroups