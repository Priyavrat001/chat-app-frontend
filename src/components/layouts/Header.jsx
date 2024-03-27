import { Add as AddIcon, Group as GroupIcon, Logout as LogoutIcon, Menu as MenuIcon, Notifications as NotificationsIcon, Search as SearchIcon } from "@mui/icons-material";
import { AppBar, Backdrop, Box, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import axios from 'axios';
import React, { Suspense, lazy, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { orange } from '../../constants/color';
import { server } from "../../constants/config";
import { userNotExists } from '../../redux/reducers/auth';
import { setIsMobile, setIsNotification, setIsSearch } from '../../redux/reducers/misc';

const SearchDialog = lazy(()=>import("../specifics/Search"))
const NotifactionsDialog = lazy(()=>import("../specifics/Notifications"))
const NewGroupDialog = lazy(()=>import("../specifics/NewGroups"))

const Header = () => {

    const dispatch = useDispatch();

    const {isSearch, isNotifactions} = useSelector(state=>state.misc);

    const [isNewGroup, setIsNewGroup] = useState(false);

    const navigate = useNavigate();

    const handleMobile = () => {
        dispatch(setIsMobile(true))
    }
    const openSearch = () => {
        dispatch(setIsSearch(true))
    }
    const openNewGroup = () => {
        setIsNewGroup((prev)=>!prev)
    }
    const navigateToGroup = () => {
        navigate("/groups")
    }
    const logoutHandler = async() => {

        try {
            const {data} = await axios.get(`${server}/user/logout`,{withCredentials:true});
            
            dispatch(userNotExists());

            toast.success(data.message);

        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong");
        }

    }
    const openNotification = ()=>{
        return dispatch(setIsNotification(true));
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
                isNotifactions && (
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