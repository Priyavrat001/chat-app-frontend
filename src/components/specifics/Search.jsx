import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import { Dialog, DialogTitle, InputAdornment, List, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAsyncMution } from "../../hooks/hook";
import { useLazySearchUsersQuery, useSendFriendRequestMutation } from '../../redux/api/api';
import { setIsSearch } from '../../redux/reducers/misc';
import UserItems from '../shared/UserItems';


const Search = () => {

  const {isSearch} = useSelector(state=>state.misc);
  const [searchUsers] = useLazySearchUsersQuery();
  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMution(useSendFriendRequestMutation);

  const search = useInputValidation("");
  const dispatch = useDispatch();

  const [users, setUsers] = useState([])

  const addHandler = async(id)=>{

    await sendFriendRequest("Sending friend request...", {userId:id})
    
  }

  const searchClosehandler = ()=>{
    dispatch(setIsSearch(false))
  };

  useEffect(() => {
   
    const timeOutId = setTimeout(() => {
       searchUsers(search.value).then(({data})=>setUsers(data.users)).catch(err=>console.log(err));
    }, 1000);

    return ()=>{
      clearTimeout(timeOutId)
    }

  }, [search.value])
  

  return (
    <Dialog open={isSearch} onClose={searchClosehandler}>
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