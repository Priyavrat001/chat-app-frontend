import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    isNewGroup: false,
    isAddMembers: false,
    isNotifactions: false,
    isMobile: false,
    isSearch: false,
    isFileMenu: false,
    isDeleteMenu: false,
    uploadingLoader: false,
    selectedDeleteChat: {
        chatId: "",
        groupChat: false
    }
}

const miscSlice = createSlice({
    name: "misc",
    initialState,
    reducers: {
        setIsNewGroup: (state, action) => {
            state.isNewGroup = action.payload;

        },
        setIsAddMember: (state, action) => {
            state.isAddMembers = action.payload;

        },
        setIsNotification: (state, action) => {
            state.isNotifactions = action.payload;

        },
        setIsMobile: (state, action) => {
            state.isMobile = action.payload;

        },
        setIsSearch: (state, action) => {
            state.isSearch = action.payload;

        },
        setIsFileMenu: (state, action) => {
            state.isFileMenu = action.payload;

        },
        setIsDeleteMenu: (state, action) => {
            state.isDeleteMenu = action.payload;

        },
        setUploadingLoader: (state, action) => {
            state.uploadingLoader = action.payload;

        },
        setSelectedDeleteChat: (state, action) => {
            state.selectedDeleteChat = action.payload;

        },
    }
});

export default miscSlice;

export const {
    setIsNewGroup,
    setIsAddMember,
    setIsNotification,
    setIsMobile,
    setIsSearch,
    setIsFileMenu,
    setIsDeleteMenu,
    setUploadingLoader,
    setSelectedDeleteChat
} = miscSlice.actions