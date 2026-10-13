import { createSlice } from "@reduxjs/toolkit";

const aiSlice = createSlice({
  name: "ai",
  initialState: {
    activeDialog: null,
  },
  reducers: {
    openAiDialog: (state, action) => {
      state.activeDialog = action.payload;
    },
    closeAiDialog: (state) => {
      state.activeDialog = null;
    },
  },
});

export default aiSlice;

export const { openAiDialog, closeAiDialog } = aiSlice.actions;
