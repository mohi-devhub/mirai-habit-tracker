import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MascotState, MascotMessage } from "@/types";

const initialState: MascotState = {
  currentMessage: null,
  messageHistory: [],
  isVisible: false,
};

const mascotSlice = createSlice({
  name: "mascot",
  initialState,
  reducers: {
    showMessage: (state, action: PayloadAction<MascotMessage>) => {
      state.currentMessage = action.payload;
      state.isVisible = true;
      state.messageHistory.unshift(action.payload);

      // Keep only last 50 messages
      if (state.messageHistory.length > 50) {
        state.messageHistory = state.messageHistory.slice(0, 50);
      }
    },
    hideMessage: (state) => {
      state.isVisible = false;
    },
    clearCurrentMessage: (state) => {
      state.currentMessage = null;
      state.isVisible = false;
    },
    clearMessageHistory: (state) => {
      state.messageHistory = [];
    },
  },
});

export const {
  showMessage,
  hideMessage,
  clearCurrentMessage,
  clearMessageHistory,
} = mascotSlice.actions;
export default mascotSlice.reducer;
