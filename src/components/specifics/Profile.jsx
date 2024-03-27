import { Avatar, Stack, Typography } from '@mui/material'
import React from 'react'
import { Face as FaceIcon, AlternateEmail as UserNameIcon, CalendarMonth as CalendarIcon } from "@mui/icons-material";
import moment from 'moment/moment';
import { transformImage } from "../../lib/features";

const Profile = ({user}) => {
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      <Avatar
        src={transformImage(user?.avatar?.url)}
        sx={{
          width: 200,
          height: 200,
          objectFit: "contain",
          marginBottom: "1re",
          brder: "5px solid white"
        }}
      />
      <ProfileCard heading={"Bio"} text={user?.bio} />
      <ProfileCard heading={"UserName"} text={user?.username} icon={<UserNameIcon />} />
      <ProfileCard heading={"Name"} text={user?.name} icon={<FaceIcon />} />
      <ProfileCard heading={"Joind"} text={user?.createdAt} icon={<CalendarIcon />} />
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