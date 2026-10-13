import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth";
import api from "./api/api";
import miscSlice from "./reducers/misc";
import chatSlice from "./reducers/chat";
import aiSlice from "./reducers/ai";

const store = configureStore({
    reducer:{
        [authSlice.name]:authSlice.reducer,
        [miscSlice.name]:miscSlice.reducer,
        [chatSlice.name]:chatSlice.reducer,
        [aiSlice.name]:aiSlice.reducer,
        [api.reducerPath]:api.reducer,
    },
    middleware:(defaultMiddleWare)=>[
        ...defaultMiddleWare(),
        api.middleware,
    ]
});



export default store;