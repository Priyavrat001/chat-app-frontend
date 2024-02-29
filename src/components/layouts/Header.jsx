import React, { Suspense, lazy, useState } from 'react'
import { AppBar, Backdrop, Box, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import { orange } from '../../constants/color';
import { Menu as MenuIcon, Search as SearchIcon, Add as AddIcon, Group as GroupIcon, Logout as LogoutIcon, Notifications as NotificationsIcon } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';

const SearchDialog = lazy(()=>import("../specifics/Search"))
const NotifactionsDialog = lazy(()=>import("../specifics/Notifications"))
const NewGroupDialog = lazy(()=>import("../specifics/NewGroups"))

const Header = () => {

    const [ismobile, setIsMobile] = useState(false)
    const [isSearch, setIsSearch] = useState(false)
    const [isNewGroup, setIsNewGroup] = useState(false)
    const [isNotification, setIsNotification] = useState(false)

    const navigate = useNavigate();

    const handleMobile = () => {
        setIsMobile((prev)=>!prev)
    }
    const openSearch = () => {
        setIsSearch((prev)=>!prev)
    }
    const openNewGroup = () => {
        setIsNewGroup((prev)=>!prev)
    }
    const navigateToGroup = () => {
        navigate("/groups")
    }
    const logoutHandler = () => {
        console.log("Loggin out");
    }
    const openNotification = ()=>{
        setIsNotification((prev)=>!prev)
    }
    return (
        <>
            <Box sx={{ flexGrow: 1 }} height={"4rem"}>
                <AppBar position='static' sx={{
                    bgcolor: orange
                }}>

                    <Toolbar>
                        <Typography
                            variant='h6'
                            sx={{
                                display: { xs: "none", md: "block" }
                            }}
                        >
                            chatapp
                        </Typography>
                        <Box sx={{
                            display: { xs: "block", md: "none" }
                        }}>
                            <IconButton color='inherit' onClick={handleMobile}>
                                <MenuIcon />
                            </IconButton>
                        </Box>

                        <Box sx={{
                            flexGrow: 1
                        }} />
                        <Box>

                            <IconBtn
                                title={"Search"}
                                icon={<SearchIcon />}
                                onClick={openSearch}
                            />
                            <IconBtn
                                title={"New Group"}
                                icon={<AddIcon />}
                                onClick={openNewGroup}
                            />
                            <IconBtn
                                title={"Manage Group"}
                                icon={<GroupIcon />}
                                onClick={navigateToGroup}
                            />
                            <IconBtn
                                title={"Notifictions"}
                                icon={<NotificationsIcon />}
                                onClick={openNotification}
                            />
                            <IconBtn
                                title={"Log Out"}
                                icon={<LogoutIcon />}
                                onClick={logoutHandler}
                            />
                        </Box>
                    </Toolbar>
                </AppBar>

            </Box>

            {
                isSearch && (
                    <Suspense fallback={<Backdrop open/>}>

                        <SearchDialog/>
                    </Suspense>
                )
            }

            {
                isNotification && (
                    <Suspense fallback={<Backdrop open/>}>

                        <NotifactionsDialog/>
                    </Suspense>
                )
            }

            {
                isNewGroup && (
                    <Suspense fallback={<Backdrop open/>}>

                        <NewGroupDialog/>
                    </Suspense>
                )
            }
        </>
    )
};


//Util func for the btn
const IconBtn = ({ title, icon, onClick }) => {
    return (
        <Tooltip title={title}>

            <IconButton color='inherit' size='large' onClick={onClick}>
                {icon}
            </IconButton>
        </Tooltip>
    )
}

export default Header