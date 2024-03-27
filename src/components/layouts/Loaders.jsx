import { Grid, Skeleton, Stack } from '@mui/material'
import React from 'react'

export const LayoutLoader = () => {
  return (
    <Grid container  height="calc(100vh - 4rem)" spacing={"1rem"}>

    <Grid item height={"100%"}
    sm={4}
    md={3}
    sx={{
      display:{xs:"none", sm:"block"}
    }}
    >

      <Skeleton variant='rectangular' height={"100vh"}/>

      </Grid>
    <Grid item xs={12}
     height={"100%"}
     md={5}
     lg={6}
          >
            <Stack spacing={"1rem"}>

    {
        Array.from({length:10}).map((_, index)=>(
            
            <Skeleton variant='rounded' height={"5rem"} key={index}/>
        ))
    }
            </Stack>

    </Grid>
    <Grid item md={4}
     lg={3}
     sx={{
      display:{xs:"none", md:"block"},
    }}
      height={"100%"}
     ><Skeleton variant='rectangular' height={"100vh"}/></Grid>
   </Grid>
 
  )
}