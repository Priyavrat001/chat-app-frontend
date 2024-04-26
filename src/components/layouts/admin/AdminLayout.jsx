import { Close as CloseIcon, Dashboard as DashboardIcon, ExitToApp as ExitToAppIcon, Groups as GroupsIcon, ManageAccounts as ManageAccountsIcon, Menu as MenuIcon, Message as MessageIcon } from '@mui/icons-material'
import { Box, Drawer, Grid, IconButton, Stack, Typography, styled } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link as LinkComponent, Navigate, useLocation } from 'react-router-dom'
import { adminLogout } from '../../../redux/thunks/admin'

const Link = styled(LinkComponent)`
padidng:0 3rem;
text-decoration:none;
border-radius:2rem;
color:black;
&:hover{
    color:rgba(0,0,0,0.54);
}
`

const admintab = [{
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <DashboardIcon />
},
{
    name: "Users",
    path: "/admin/users",
    icon: <ManageAccountsIcon />
},
{
    name: "Chats",
    path: "/admin/chats",
    icon: <GroupsIcon />
},
{
    name: "Message",
    path: "/admin/messages",
    icon: <MessageIcon />
},
]

const SideBar = ({ w = "100vw" }) => {
    const location = useLocation();

    const dispatch = useDispatch();

    const logoutHandler = () => { 

        dispatch(adminLogout());
     };


    return <Stack width={w} direction={"column"} spacing={"3rem"} margin={"2rem 5rem"}>
        <Typography variant='h5'>Chat app</Typography>
        <Stack spacing={"1rem"} gap={"2rem"}>
            {
                admintab.map((tab) => (
                    <Link key={tab.path} to={tab.path}
                    sx={
                        location.pathname === tab.path && {
                            bgcolor:"gray",
                            color:"white",
                            ":hover":{color:"white"}
                        }
                    }
                    >
                        <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                            {tab.icon}
                            <Typography fontSize={"1.2rem"}>{tab.name}</Typography>
                        </Stack>
                    </Link>
                ))
            }
                 <Link onClick={logoutHandler}>
                        <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                            <ExitToAppIcon/>
                            <Typography fontSize={"1.2rem"}>Logout</Typography>
                        </Stack>
                    </Link>
        </Stack>
    </Stack>
}


const AdminLayout = ({ children }) => {

    const {isAdmin} = useSelector(state=>state.auth);

    const [isMobile, setIsMobile] = useState(false)

    const handleMobile = () => { setIsMobile(prev => !prev) };
    const handleClose = () => { setIsMobile(prev => !prev) };

    if(!isAdmin) return <Navigate to={"/admin"}/>

    return (
        <Grid container minHeight={"100vh"}>

            <Box
                sx={{
                    display: { xs: "block", md: "none" },
                    position: "fixed",
                    right: "1rem",
                    top: "1rem"
                }}
            >
                <IconButton onClick={handleMobile}>
                    {

                        isMobile ? <CloseIcon /> : <MenuIcon />
                    }
                </IconButton>
            </Box>

            <Grid
                item
                md={4}
                lg={3}
                sx={{
                    display: {
                        xs: "none",
                        md: "block"
                    }
                }}
                overflow={"hidden"}
            >
                <SideBar />
            </Grid>
            <Grid
                item
                xs={12}
                md={8}
                lg={9}
                sx={{
                    bgcolor: "#f5f5f5"
                }}
            >
                {children}
            </Grid>
            <Drawer open={isMobile} onClose={handleClose}>
                <SideBar w={"50vw"} />
            </Drawer>

        </Grid>
    )
}

export default AdminLayout