import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { server } from '../../constants/config';


const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/`
    }),
    tagTypes: ["Chat", "User"],

    endpoints: (builder) => ({
        myChats: builder.query({
            query: () => ({
                url: "chat/my",
                credentials: "include"
            }),
            providesTags: ["Chat"],
        }),
        searchUsers:builder.query({
            query: (name) => ({
                url: `user/search?name=${name}`,
                credentials: "include"
            }),
            providesTags: ["User"],
        }),
        sendFriendRequest:builder.mutation({
            query: (data) => ({
                url: "user/send-request",
                method:"PUT",
                credentials: "include",
                body:data
            }),
            invalidatesTags: ["User"],
        })
    })
});

export default api;

export const {
    useMyChatsQuery,
    useLazySearchUsersQuery,
    useSendFriendRequestMutation
} = api;