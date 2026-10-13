import api from "../api/api";

const aiApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getReplySuggestions: builder.mutation({
      query: ({ chatId }) => ({
        url: "ai/reply-suggestions",
        method: "POST",
        credentials: "include",
        body: { chatId },
      }),
    }),
    summarizeConversation: builder.mutation({
      query: ({ chatId }) => ({
        url: "ai/summarize",
        method: "POST",
        credentials: "include",
        body: { chatId },
      }),
    }),
    askChatHistory: builder.mutation({
      query: ({ chatId, question }) => ({
        url: "ai/ask-history",
        method: "POST",
        credentials: "include",
        body: { chatId, question },
      }),
    }),
  }),
});

export const {
  useGetReplySuggestionsMutation,
  useSummarizeConversationMutation,
  useAskChatHistoryMutation,
} = aiApi;

export default aiApi;
