import { Dialog, Stack, DialogTitle, TextField, InputAdornment, List, ListItem, ListItemText } from '@mui/material'
import React, { useState } from 'react'
import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import UserItems from '../shared/UserItems';
import { sampleUsers } from '../../constants/sampleData';


const Search = () => {

  const search = useInputValidation("");

  let isLoadingSendFriendRequest = false;

  const [users, setUsers] = useState(sampleUsers)

  const addHandler = (id)=>{
    console.log(id)
  }

  return (
    <Dialog open>
      <Stack padding={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle textAlign={"center"} >
          Find Pepole
        </DialogTitle>
<TextField label="" value={search.value} onChange={search.changeHandler} variant='outlined' size='small' inputProps={{
  startAdornment:(
    <InputAdornment position='start'>
    <SearchIcon/>
    </InputAdornment>
  )
}}/>

<List>
{
  users.map((i)=>(
    <UserItems user={i} key={i._id} handler={addHandler} handlerIsLoading={isLoadingSendFriendRequest}/>
  ))
}
</List>
      </Stack>
    </Dialog>
  )
}

export default Search