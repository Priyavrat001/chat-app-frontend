import { Avatar, Stack, Typography } from '@mui/material'
import React from 'react'
import { Face as FaceIcon, AlternateEmail as UserNameIcon, CalendarMonth as CalendarIcon } from "@mui/icons-material";
import moment from 'moment/moment';

const Profile = () => {
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      <Avatar
        sx={{
          width: 200,
          height: 200,
          objectFit: "contain",
          marginBottom: "1re",
          brder: "5px solid white"
        }}
      />
      <ProfileCard heading={"Bio"} text={"dfsfsdfs fsfd"} />
      <ProfileCard heading={"UserName"} text={"priyavrat"} icon={<UserNameIcon />} />
      <ProfileCard heading={"Name"} text={"Priyavrat Kumar"} icon={<FaceIcon />} />
      {/* <ProfileCard heading={"Joind"} text={"3months"} icon={<CalendarIcon />} /> */}
    </Stack>
  )
}

const ProfileCard = ({ text, icon, heading }) => <Stack
  direction={"row"}
  spacing={"1rem"}
  alignItems={"center"}
  color={"white"}
  textAlign={"center"}
  justifyContent={"center"}
>
  {
    icon && icon

  }
  <Typography variant='body1'>
    {text}
  </Typography>
  <Typography color={"gray"} variant='caption'>
    {heading}
  </Typography>
</Stack>

export default Profile