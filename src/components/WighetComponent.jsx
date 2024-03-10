import { Paper, Stack, Typography } from '@mui/material'
import React from 'react'

const WighetComponent = ({title, icon, value}) => {
  return (
    <Paper
    sx={{
        padding:"2rem",
        margin:"2rem 0",
        borderRadius:"1rem",
        width:"20rem"
    }}
    >
        <Stack alignItems={"center"} spacing={"1rem"}>
    <Typography
    sx={{
        color:"rgba(0,0,0,0.7)",
        borderRadius:"50%",
        border:"4px solid rgba(0,0,0,0.9)",
        width:"40px",
        heigth:"5rem",
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
    }}
    >{value}</Typography>
    <Stack>{icon}</Stack>
    <Typography>{title}</Typography>
        </Stack>
    </Paper>
  )
}

export default WighetComponent